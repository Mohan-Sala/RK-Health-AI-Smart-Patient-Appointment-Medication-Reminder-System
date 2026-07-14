import { prisma } from "../config/database.js";
import { generateSummaryFromNotes } from "../services/aiService.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError, BadRequestError } from "../utils/customError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Generate a new AI Healthcare Summary for an appointment
 * POST /api/ai/generate-summary
 */
export const generateSummary = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  // 1. Verify appointment exists and belongs to user
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.userId !== req.user.id) {
    throw new NotFoundError("Appointment not found");
  }

  // 2. Check if summary already exists for this appointment
  const existingSummary = await prisma.aiSummary.findUnique({
    where: { appointmentId },
  });

  if (existingSummary) {
    throw new BadRequestError("An AI summary already exists for this appointment. Use regenerate instead.");
  }

  // 3. Fetch user medications to include in context
  const medications = await prisma.medication.findMany({
    where: { userId: req.user.id },
  });

  // 4. Call Groq service
  const aiResult = await generateSummaryFromNotes(appointment, req.user, medications);

  // 5. Save summary in database
  const aiSummary = await prisma.aiSummary.create({
    data: {
      appointmentId,
      visitOverview: aiResult.content.visitOverview,
      medicalExplanation: aiResult.content.patientExplanation,
      medicationInstructions: aiResult.content.medicationGuidance,
      followUpAdvice: aiResult.content.followUpAdvice,
      recommendations: `${aiResult.content.healthRecommendations}\n\nPrecautions:\n${aiResult.content.precautions}`,
      summary: aiResult.content.summary,
      generatedBy: `${aiResult.metadata.modelName} (Prompt v${aiResult.metadata.promptVersion})`,
    },
  });

  // 6. Generate notification
  await createNotification(
    req.user.id,
    "AI Summary Generated",
    `AI Healthcare Summary is now available for appointment "${appointment.title}".`,
    "AI"
  );

  // 7. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "AI Summary",
      action: "GENERATE",
      description: `Generated AI Healthcare Summary for appointment "${appointment.title}".`,
    },
  });

  res.status(201).json(
    successResponse("AI summary generated successfully", aiSummary, 201)
  );
});

/**
 * List previous AI summaries for the authenticated user
 * GET /api/ai/summaries
 */
export const getSummaries = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const summaries = await prisma.aiSummary.findMany({
    where: {
      appointment: { userId },
    },
    include: {
      appointment: true,
    },
    orderBy: {
      generatedAt: "desc",
    },
  });

  res.status(200).json(
    successResponse("AI summaries retrieved successfully", summaries)
  );
});

/**
 * Get detailed view of an AI summary by ID
 * GET /api/ai/summaries/:id
 */
export const getSummaryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const summary = await prisma.aiSummary.findUnique({
    where: { id },
    include: {
      appointment: true,
    },
  });

  if (!summary || summary.appointment.userId !== req.user.id) {
    throw new NotFoundError("AI summary not found");
  }

  res.status(200).json(
    successResponse("AI summary retrieved successfully", summary)
  );
});

/**
 * Regenerate an existing AI summary
 * PUT /api/ai/summaries/:id/regenerate
 */
export const regenerateSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Ensure summary exists and belongs to user
  const existingSummary = await prisma.aiSummary.findUnique({
    where: { id },
    include: { appointment: true },
  });

  if (!existingSummary || existingSummary.appointment.userId !== req.user.id) {
    throw new NotFoundError("AI summary not found");
  }

  // 2. Fetch user medications
  const medications = await prisma.medication.findMany({
    where: { userId: req.user.id },
  });

  // 3. Call Groq service
  const aiResult = await generateSummaryFromNotes(existingSummary.appointment, req.user, medications);

  // 4. Update summary in database
  const updatedSummary = await prisma.aiSummary.update({
    where: { id },
    data: {
      visitOverview: aiResult.content.visitOverview,
      medicalExplanation: aiResult.content.patientExplanation,
      medicationInstructions: aiResult.content.medicationGuidance,
      followUpAdvice: aiResult.content.followUpAdvice,
      recommendations: `${aiResult.content.healthRecommendations}\n\nPrecautions:\n${aiResult.content.precautions}`,
      summary: aiResult.content.summary,
      generatedBy: `${aiResult.metadata.modelName} (Prompt v${aiResult.metadata.promptVersion})`,
      generatedAt: new Date(),
    },
  });

  // 5. Generate notification
  await createNotification(
    req.user.id,
    "AI Summary Regenerated",
    `AI Healthcare Summary was successfully updated for appointment "${existingSummary.appointment.title}".`,
    "AI"
  );

  // 6. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "AI Summary",
      action: "REGENERATE",
      description: `Regenerated AI Healthcare Summary for appointment "${existingSummary.appointment.title}".`,
    },
  });

  res.status(200).json(
    successResponse("AI summary regenerated successfully", updatedSummary)
  );
});

/**
 * Delete an AI summary
 * DELETE /api/ai/summaries/:id
 */
export const deleteSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Ensure summary exists and belongs to user
  const existingSummary = await prisma.aiSummary.findUnique({
    where: { id },
    include: { appointment: true },
  });

  if (!existingSummary || existingSummary.appointment.userId !== req.user.id) {
    throw new NotFoundError("AI summary not found");
  }

  // 2. Delete from database
  await prisma.aiSummary.delete({
    where: { id },
  });

  // 3. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "AI Summary",
      action: "DELETE",
      description: `Deleted AI Healthcare Summary for appointment "${existingSummary.appointment.title}".`,
    },
  });

  res.status(200).json(
    successResponse("AI summary deleted successfully")
  );
});

/**
 * Get compiled printable healthcare report data for the summary
 * GET /api/ai/summaries/:id/report
 */
export const getReportData = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Fetch summary and associated appointment
  const summary = await prisma.aiSummary.findUnique({
    where: { id },
    include: {
      appointment: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!summary || summary.appointment.userId !== req.user.id) {
    throw new NotFoundError("AI summary not found");
  }

  // Fetch medications for report context
  const medications = await prisma.medication.findMany({
    where: { userId: req.user.id },
  });

  res.status(200).json(
    successResponse("Printable report data compiled successfully", {
      patientInformation: {
        fullName: req.user.fullName,
        email: req.user.email,
        phone: req.user.phone,
        dateOfBirth: req.user.dateOfBirth,
        gender: req.user.gender,
        bloodGroup: req.user.bloodGroup,
        allergies: req.user.allergies,
        medicalConditions: req.user.medicalConditions,
      },
      appointmentDetails: {
        doctorName: summary.appointment.doctorName,
        title: summary.appointment.title,
        hospital: summary.appointment.hospital,
        specialization: summary.appointment.specialization,
        appointmentDate: summary.appointment.appointmentDate,
        appointmentTime: summary.appointment.appointmentTime,
        visitType: summary.appointment.visitType,
      },
      aiVisitSummary: {
        visitOverview: summary.visitOverview,
        patientExplanation: summary.medicalExplanation,
        medicationGuidance: summary.medicationInstructions,
        recommendations: summary.recommendations,
        followUpAdvice: summary.followUpAdvice,
        healthSummary: summary.summary,
      },
      medicationGuidance: medications,
      reportTimestamp: new Date().toISOString(),
    })
  );
});

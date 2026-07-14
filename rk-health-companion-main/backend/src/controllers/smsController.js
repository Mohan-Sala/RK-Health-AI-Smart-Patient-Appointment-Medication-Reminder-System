import { prisma } from "../config/database.js";
import { sendSms } from "../services/twilioService.js";
import { createNotification } from "../services/notificationService.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError, BadRequestError } from "../utils/customError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Send manual Medication SMS reminder
 * POST /api/sms/send-medication-reminder
 */
export const sendMedicationSmsReminder = asyncHandler(async (req, res) => {
  const { medicationId } = req.body;

  // 1. Fetch medication and ensure user owns it
  const medication = await prisma.medication.findUnique({
    where: { id: medicationId },
  });

  if (!medication || medication.userId !== req.user.id) {
    throw new NotFoundError("Medication record not found.");
  }

  if (!medication.phoneNumber) {
    throw new BadRequestError("No phone number configured for this medication reminder.");
  }

  // 2. Format SMS body
  const body = `Hello ${req.user.fullName.split(" ")[0]},\nThis is your RK Health reminder.\nPlease take:\n${medication.medicineName} (${medication.dosage})\nTime: ${medication.reminderTime}\nStay healthy.`;

  // 3. Call Twilio service
  const twilioResult = await sendSms(medication.phoneNumber, body);

  // 4. Save history in ReminderHistory
  const log = await prisma.reminderHistory.create({
    data: {
      medicationId,
      reminderType: "SMS",
      status: twilioResult.success ? "Sent" : "Failed",
      deliveryProvider: "Twilio",
      deliveryTime: new Date(),
      response: twilioResult.success ? `SMS SID: ${twilioResult.sid}` : twilioResult.error,
    },
  });

  // 5. Generate app notification
  await createNotification(
    req.user.id,
    "Medication Reminder Sent",
    `SMS reminder sent to ${medication.phoneNumber} for medication "${medication.medicineName}".`,
    "Medication"
  );

  // 6. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Medication",
      action: twilioResult.success ? "SMS_SENT" : "SMS_FAILED",
      description: twilioResult.success
        ? `Sent SMS reminder for medication "${medication.medicineName}".`
        : `Failed to send SMS reminder for medication "${medication.medicineName}": ${twilioResult.error}`,
    },
  });

  if (!twilioResult.success) {
    throw new BadRequestError(`Failed to send SMS: ${twilioResult.error}`);
  }

  res.status(200).json(
    successResponse("Reminder SMS sent successfully", log)
  );
});

/**
 * Send manual Appointment SMS reminder
 * POST /api/sms/send-appointment-reminder
 */
export const sendAppointmentSmsReminder = asyncHandler(async (req, res) => {
  const { appointmentId, phoneNumber } = req.body;

  // 1. Fetch appointment
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });

  if (!appointment || appointment.userId !== req.user.id) {
    throw new NotFoundError("Appointment record not found.");
  }

  const targetPhone = phoneNumber || req.user.phone;
  if (!targetPhone) {
    throw new BadRequestError("Recipient phone number is required to send reminder.");
  }

  // 2. Format SMS body
  const dateStr = new Date(appointment.appointmentDate).toISOString().slice(0, 10);
  const body = `Hello ${req.user.fullName.split(" ")[0]},\nYou have an appointment scheduled with ${appointment.doctorName} at ${appointment.hospital || "clinic"} on ${dateStr} at ${appointment.appointmentTime}.\nTitle: ${appointment.title}`;

  // 3. Call Twilio
  const twilioResult = await sendSms(targetPhone, body);

  // 4. Generate app notification
  await createNotification(
    req.user.id,
    "Appointment Reminder Sent",
    `SMS reminder sent to ${targetPhone} for appointment "${appointment.title}".`,
    "Appointment"
  );

  // 5. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Appointment",
      action: twilioResult.success ? "SMS_SENT" : "SMS_FAILED",
      description: twilioResult.success
        ? `Sent SMS reminder for appointment "${appointment.title}".`
        : `Failed to send SMS reminder for appointment "${appointment.title}": ${twilioResult.error}`,
    },
  });

  if (!twilioResult.success) {
    throw new BadRequestError(`Failed to send SMS: ${twilioResult.error}`);
  }

  res.status(200).json(
    successResponse("Reminder SMS sent successfully")
  );
});

/**
 * Get SMS log history
 * GET /api/sms/history
 */
export const getSmsHistory = asyncHandler(async (req, res) => {
  const history = await prisma.reminderHistory.findMany({
    where: {
      medication: { userId: req.user.id },
      reminderType: "SMS",
    },
    include: {
      medication: true,
    },
    orderBy: { deliveryTime: "desc" },
  });

  res.status(200).json(
    successResponse("SMS reminder history retrieved successfully", history)
  );
});

/**
 * Retrieve status check details for a reminder log by ID
 * GET /api/sms/status/:id
 */
export const getSmsStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const log = await prisma.reminderHistory.findUnique({
    where: { id },
    include: { medication: true },
  });

  if (!log || log.medication.userId !== req.user.id) {
    throw new NotFoundError("Reminder history log not found.");
  }

  res.status(200).json(
    successResponse("SMS log status retrieved", {
      id: log.id,
      medicineName: log.medication.medicineName,
      status: log.status,
      deliveryTime: log.deliveryTime,
      response: log.response,
    })
  );
});

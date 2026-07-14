import { prisma } from "../config/database.js";
import { successResponse } from "../utils/apiResponse.js";
import { NotFoundError, BadRequestError } from "../utils/customError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../services/notificationService.js";

/**
 * Create a new medication
 * POST /api/medications
 */
export const createMedication = asyncHandler(async (req, res) => {
  const {
    medicineName,
    dosage,
    strength,
    medicineType,
    frequency,
    foodPreference,
    startDate,
    endDate,
    reminderTime,
    phoneNumber,
    reminderEnabled,
    status,
    notes,
  } = req.body;

  // 1. Create medication in database
  const medication = await prisma.medication.create({
    data: {
      userId: req.user.id,
      medicineName,
      dosage,
      strength,
      medicineType,
      frequency,
      foodPreference,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reminderTime,
      phoneNumber,
      reminderEnabled: reminderEnabled !== undefined ? reminderEnabled : true,
      status: status || "Pending",
      notes,
    },
  });

  // 2. Generate notification
  await createNotification(
    req.user.id,
    "Medication Added",
    `You have successfully added medication "${medicineName}".`,
    "Medication"
  );

  // 3. Write activity log
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Medication",
      action: "CREATE",
      description: `Added new medication "${medicineName}".`,
    },
  });

  res.status(201).json(
    successResponse("Medication created successfully", medication, 201)
  );
});

/**
 * Get medications belonging to the authenticated user
 * GET /api/medications
 */
export const getMedications = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    reminderEnabled,
    medicineType,
    startDate,
    endDate,
    sortBy = "newest",
  } = req.query;

  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  const skip = (parsedPage - 1) * parsedLimit;

  // Build filters query
  const where = {
    userId: req.user.id,
  };

  // Text search
  if (search) {
    where.OR = [
      { medicineName: { contains: search, mode: "insensitive" } },
      { dosage: { contains: search, mode: "insensitive" } },
      { notes: { contains: search, mode: "insensitive" } },
    ];
  }

  // Exact filters
  if (status) where.status = status;
  if (reminderEnabled !== undefined) where.reminderEnabled = reminderEnabled === "true";
  if (medicineType) where.medicineType = medicineType;

  // Date range filters
  if (startDate || endDate) {
    where.startDate = {};
    if (startDate) where.startDate.gte = new Date(startDate);
    if (endDate) where.startDate.lte = new Date(endDate);
  }

  // Sorting maps
  let orderBy = { createdAt: "desc" };
  if (sortBy === "oldest") orderBy = { createdAt: "asc" };
  else if (sortBy === "medicineName") orderBy = { medicineName: "asc" };
  else if (sortBy === "reminderTime") orderBy = { reminderTime: "asc" };
  else if (sortBy === "startDate") orderBy = { startDate: "asc" };

  // Fetch medications & count total
  const [medications, total] = await Promise.all([
    prisma.medication.findMany({
      where,
      orderBy,
      skip,
      take: parsedLimit,
    }),
    prisma.medication.count({ where }),
  ]);

  // Dynamically calculate compliance percentage on the fly for each medication
  const medicationsWithCompliance = await Promise.all(
    medications.map(async (med) => {
      const logs = await prisma.reminderHistory.findMany({
        where: { medicationId: med.id },
      });
      const totalLogs = logs.length;
      const takenLogs = logs.filter((l) => l.status === "Taken").length;
      const compliance = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;
      return {
        ...med,
        compliance,
      };
    })
  );

  res.status(200).json(
    successResponse("Medications retrieved successfully", {
      medications: medicationsWithCompliance,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        pages: Math.ceil(total / parsedLimit),
      },
    })
  );
});

/**
 * Get a single medication by ID
 * GET /api/medications/:id
 */
export const getMedicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const medication = await prisma.medication.findUnique({
    where: { id },
  });

  if (!medication || medication.userId !== req.user.id) {
    throw new NotFoundError("Medication not found");
  }

  // Calculate compliance dynamically
  const logs = await prisma.reminderHistory.findMany({
    where: { medicationId: id },
  });
  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === "Taken").length;
  const compliance = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;

  res.status(200).json(
    successResponse("Medication retrieved successfully", {
      ...medication,
      compliance,
      history: logs,
    })
  );
});

/**
 * Update medication details
 * PUT /api/medications/:id
 */
export const updateMedication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Ensure medication exists and belongs to user
  const existing = await prisma.medication.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== req.user.id) {
    throw new NotFoundError("Medication not found");
  }

  // 2. Format dates if present
  const updateData = { ...req.body };
  if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
  if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);

  // 3. Update database
  const medication = await prisma.medication.update({
    where: { id },
    data: updateData,
  });

  // 4. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Medication",
      action: "UPDATE",
      description: `Updated medication "${medication.medicineName}" details.`,
    },
  });

  res.status(200).json(
    successResponse("Medication updated successfully", medication)
  );
});

/**
 * Delete a medication
 * DELETE /api/medications/:id
 */
export const deleteMedication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Ensure medication exists and belongs to user
  const existing = await prisma.medication.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== req.user.id) {
    throw new NotFoundError("Medication not found");
  }

  // 2. Delete from database (cascades to ReminderHistory)
  await prisma.medication.delete({
    where: { id },
  });

  // 3. Log activity
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Medication",
      action: "DELETE",
      description: `Deleted medication "${existing.medicineName}".`,
    },
  });

  res.status(200).json(
    successResponse("Medication deleted successfully")
  );
});

/**
 * Update medication status (Pending, Taken, Missed, Skipped)
 * PATCH /api/medications/:id/status
 */
export const updateMedicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // 1. Ensure medication exists and belongs to user
  const existing = await prisma.medication.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== req.user.id) {
    throw new NotFoundError("Medication not found");
  }

  // 2. Update medication status
  const updatedMedication = await prisma.medication.update({
    where: { id },
    data: { status },
  });

  // 3. Store in compliance log history (ReminderHistory)
  const log = await prisma.reminderHistory.create({
    data: {
      medicationId: id,
      reminderType: "Push",
      status: status, // Taken, Missed, Skipped
      deliveryProvider: "LocalPush",
      deliveryTime: new Date(),
      response: `Status changed to ${status}`,
    },
  });

  // 4. Log specific Activity Log action
  const actionMap = {
    Taken: "TAKEN",
    Missed: "MISSED",
    Skipped: "SKIPPED",
    Pending: "UPDATE_STATUS",
  };

  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "Medication",
      action: actionMap[status] || "UPDATE_STATUS",
      description: `Marked medication "${existing.medicineName}" as ${status}.`,
    },
  });

  // 5. Calculate updated compliance
  const logs = await prisma.reminderHistory.findMany({
    where: { medicationId: id },
  });
  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === "Taken").length;
  const compliance = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;

  res.status(200).json(
    successResponse(`Medication status updated to ${status}`, {
      medication: updatedMedication,
      compliance,
      historyLog: log,
    })
  );
});

/**
 * Recalculate/Get medication compliance statistics
 * PATCH /api/medications/:id/compliance
 */
export const updateCompliance = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.medication.findUnique({
    where: { id },
  });

  if (!existing || existing.userId !== req.user.id) {
    throw new NotFoundError("Medication not found");
  }

  // Fetch compliance history logs
  const logs = await prisma.reminderHistory.findMany({
    where: { medicationId: id },
  });

  const totalLogs = logs.length;
  const takenLogs = logs.filter((l) => l.status === "Taken").length;
  const compliance = totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100;

  res.status(200).json(
    successResponse("Compliance calculated successfully", {
      medicationId: id,
      medicineName: existing.medicineName,
      compliance,
      totalRemindersLogged: totalLogs,
      takenCount: takenLogs,
      history: logs,
    })
  );
});

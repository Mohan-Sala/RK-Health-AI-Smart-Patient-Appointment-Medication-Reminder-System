import { getUserSettings, updateUserSettings } from "../services/settingsService.js";
import { prisma } from "../config/database.js";
import { successResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Get user configuration preferences
 * GET /api/settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await getUserSettings(req.user.id);
  res.status(200).json(
    successResponse("User settings retrieved successfully", settings)
  );
});

/**
 * Update user configuration preferences
 * PUT /api/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const updated = await updateUserSettings(req.user.id, req.body);

  // Log activity audit
  await prisma.activityLog.create({
    data: {
      userId: req.user.id,
      module: "User",
      action: "SETTINGS_UPDATE",
      description: "Updated user preferences and notification settings.",
    },
  });

  res.status(200).json(
    successResponse("User settings updated successfully", updated)
  );
});

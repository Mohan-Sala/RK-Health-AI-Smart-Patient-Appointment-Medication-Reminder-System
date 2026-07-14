import { Router } from "express";
import {
  sendSystemNotification,
  getNotifications,
  getNotificationById,
  markNotificationRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

// Protect all routes underneath
router.use(protect);

router.post("/send", sendSystemNotification);
router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.patch("/:id/read", markNotificationRead);
router.delete("/:id", deleteNotification);

export default router;

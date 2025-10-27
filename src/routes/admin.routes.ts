import { Router } from "express";
import {
  getAllStudents,
  getAllWashermen,
  updateStudent,
  deleteStudent,
  updateWasherman,
  deleteWasherman,
} from "../controllers/admin.controller";

const router = Router();

// Student Admin Routes
router.get("/students", getAllStudents);
router.put("/students/:bagNo", updateStudent);
router.delete("/students/:bagNo", deleteStudent);

// Washerman Admin Routes
router.get("/washermen", getAllWashermen);
router.put("/washermen/:id", updateWasherman);
router.delete("/washermen/:id", deleteWasherman);

export default router;

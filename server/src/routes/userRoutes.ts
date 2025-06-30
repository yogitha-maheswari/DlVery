import { Router } from "express";
import { createUser, deleteUser, getUsers, updateUser} from "../controllers/userController";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.delete("/", deleteUser);
router.put("/", updateUser);

export default router;
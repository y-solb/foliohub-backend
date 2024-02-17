import { Router } from "express";
import auth from "./auth";
import metadata from "./metadata";

const router = Router();

router.use("/auth", auth);
router.use("/metadata", metadata);

export default router;

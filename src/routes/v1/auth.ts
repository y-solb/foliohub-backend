import { Router } from "express";
import { socialRedirect, googleCallback } from "../../controllers/auth/google";

const router = Router();

router.get("/redirect/:provider", socialRedirect);

router.get("/callback/google", googleCallback);

export default router;

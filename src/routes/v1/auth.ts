import { Router } from "express";
import { socialRedirect, googleCallback } from "../../controllers/auth/google";
import { register } from "../../controllers/auth/register";
import userMiddleware from "../../middlewares/user";
import { getAuthInfo } from "../../controllers/auth/getAuthInfo";

const router = Router();

router.get("/", userMiddleware, getAuthInfo);

router.post("/register", register);

router.get("/redirect/:provider", socialRedirect);

router.get("/callback/google", googleCallback);

export default router;

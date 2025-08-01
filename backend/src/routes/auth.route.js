import express from "express";
import { signUpController, loginController, logoutController, onboardingController, serverCheck } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUpController);
router.post("/login", loginController);
router.post("/logout", logoutController);

router.post("/onboarding", protectRoute ,onboardingController);
router.get("/me", protectRoute, serverCheck)



export default router;
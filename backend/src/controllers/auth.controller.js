import {
  signupService,
  loginService,
  onboardingService,
  logoutService,
} from "../services/auth.service.js";
import {
  loginError,
  onboardingError,
  onboardingResponse,
  response,
  signUpError,
  storeJwtTokenToCookies,
  userResponse,
} from "../lib/utils.js";


const signUpController = async (req, res) => {
  // start
  const { email, password, fullName } = req.body;
  try {
    if (!email || !password || !fullName) {
      return response(res, 400, signUpError.required);
    }
    if (password.length < 6) {
      return response(res, 400, signUpError.passwordLength);
    }
    // check email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return response(res, 400, signUpError.invalidEmail);
    }

    //creating new user with our signup service
    try {
      const { user, token } = await signupService(email, password, fullName);
      await storeJwtTokenToCookies(res, token);
      return userResponse(res, 201, "User created successfully!", user);
    } catch (err) {
      if (err.message === "EMAIL_EXISTS") {
        return response(res, 400, signUpError.existingUser);
      }
      if (err.message.includes("STREAM_ERROR")) {
        return response(res, 400, err.message);
      }
      console.log("Error in signup service", err);
      response(res, 500, signUpError.internalServer);
    }
  } catch (error) {
    console.log("Error in signup controller", error);
    response(res, 500, signUpError.internalServer);
  }
  // End
};

const loginController = async (req, res) => {
  // start
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return response(res, 400, loginError.required);
    }
    //user and checking credentials if they match in our system and login
    try {
      const { user, token } = await loginService(email, password);
      await storeJwtTokenToCookies(res, token);
      return userResponse(res, 200, "Login was successful!", user);
    } catch (err) {
      if (err.message === "INVALID_CREDENTIALS") {
        return response(res, 401, loginError.invalidCredentials);
      }
      console.log("Error in login service", err);
      response(res, 500, loginError.internalServer);
    }
  } catch (error) {
    console.log("Error in login controller", err);
    response(res, 500, loginError.internalServer);
  }
  //   end
};

const logoutController = async (req, res) => {
  // start
  try {
    const { message } = await logoutService(req, res);
    return response(res, 200, message, true);
  } catch (error) {
    if (error.message === "LOGGED_OUT") {
      return response(res, 400, "You are logged out, Kindly login!");
    }
    console.log("Error in logout controller: ", error);
  }
  // end
};

const onboardingController = async (req, res) => {
    // start
  try {
    try {
      const { user } = await onboardingService(req, res);
      return userResponse(res, 201, "Onboarding was succesful!", user);
    } catch (error) {
      if (error.type === "REQUIRED") {
        return onboardingResponse(
          res,
          400,
          onboardingError.required,
          error.missingFields
        );
      }
      if (error.message === "USER_NOT_FOUND") {
        return response(res, 400, "User not found!");
      }
      console.log("Error in onboarding service: ", error);
    }
  } catch (err) {
    console.log("Error in onboarding controller: ", err);
    response(res, 500, onboardingError.internalServer);
  }
//   end
};

const serverCheck = async (req, res) => {
  const user = req.user;
  return userResponse(res, 200, "Server is Healthy and a user is available and authenticated!", user);

}

export {
  signUpController,
  loginController,
  logoutController,
  onboardingController,
  serverCheck
};

import jwt from "jsonwebtoken";
import { generateRandomAvatar } from "../lib/utils.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export async function signupService(email, password, fullName) {
  //checking if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) throw new Error("EMAIL_EXISTS");

  //generate random avatars for users
  const randomAvatar = generateRandomAvatar();

  // create new user
  const newUser = await User.create({
    email,
    password,
    fullName,
    profilePic: randomAvatar,
  });

  //   create the user in stream as well
  try {
    await upsertStreamUser({
      id: newUser._id.toString(),
      name: newUser.fullName,
      image: newUser.profilePic || "",
    });
    console.log(`Stream user created for ${newUser.fullName}`);
  } catch (error) {
    throw new Error("STREAM_ERROR", error);
  }
  //   create a jwt token to auto sign in created user
  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  return { user: newUser, token };
}

export async function loginService(email, password) {
  // checking if user exist
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  //checking if password is correct
  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) throw new Error("INVALID_CREDENTIALS");

  // create token
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );

  return { user, token };
}

export async function logoutService(req, res) {
  // clear cookies
  const token = req.cookies.jwt;
  if (!token) {
    throw new Error("LOGGED_OUT");
  }
  res.clearCookie("jwt");
  return { message: "Logout was successful!" };
}

export async function onboardingService(req, res) {
  const userId = req.user._id;
  const { fullName, bio, nativeLanguage, learningLanguage, location } =
    req.body;

  let missingFields = [];

  if (!fullName) missingFields.push("fullName");
  if (!bio) missingFields.push("bio");
  if (!nativeLanguage) missingFields.push("nativeLanguage");
  if (!learningLanguage) missingFields.push("learningLanguage");
  if (!location) missingFields.push("location");

  if (missingFields.length > 0) {
    const error = new Error("REQUIRED");
    error.type = "REQUIRED";
    error.missingFields = missingFields;
    throw error;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.body,
      isOnboarded: true,
    },
    { new: true }
  );

  if (!updatedUser) throw new Error("USER_NOT_FOUND");

  //   UPDATE THE USER INFO IN STREAM
try{
      await upsertStreamUser({
    id: updatedUser._id.toString(),
    name: updatedUser.fullName,
    image: updatedUser.profilePic || ""
  });
  console.log(`Stream user updated after onboading for ${updatedUser.fullName}`);
} catch(err){
    console.log("Error in onboarding update user in stream: ", err.message);
}

  return { user: updatedUser };
}

export const signUpError = {
  required: "All fields are required!",
  passwordLength: "Password must be at least 6 characters!",
  invalidEmail: "Invalid email format!",
  existingUser: "Email already exists, please use a different email!",
  internalServer: "Internal Server Error!",
};
export const loginError = {
  required: "All fields are required!",
  passwordLength: "Password must be at least 6 characters!",
  invalidCredentials: "Invalid email or password!",
  internalServer: "Internal Server Error!",
};

export const onboardingError = {
  required: "All fields are required!",
  internalServer: "Internal Server Error!",
};
export const userError = {
  internalServer: "Internal Server Error!",
  selfRequest: "You can't send friend request to yourself!",
  internalServer: "Internal Server Error!",
  recipientNotFound: "Recipient not found!",
  alreadyFriends: "You are already friends with this user!",
  requestExists: "A friend request already exists between you and this user!",
  requestDoesNotExist: "Friend request not found!",
  unauthorizedRequest: "You are not authorized to accpt this request!"
};


export function response(res, statusCode, message, success = false) {
  return res.status(statusCode).json({ success: success, message: message });
}
export function userResponse(res, statusCode, message, user) {
  return res
    .status(statusCode)
    .json({ success: true, message: message, user});
}
export function usersResponse(res, statusCode, message, users=[]) {
  return res
    .status(statusCode)
    .json({users});
}
export function requestResponse(res, statusCode, message, request) {
  return res
    .status(statusCode)
    .json({ request});
}
export function requestsResponse(res, statusCode, message, incomingReqs, acceptedReqs) {
  return res
    .status(statusCode)
    .json({ incomingReqs: incomingReqs, acceptedReqs});
}
export function onboardingResponse(
  res,
  statusCode,
  message,
  missingFields = [],
  success = false
) {
  return res
    .status(statusCode)
    .json({ success: success, message: message, missingFields: missingFields });
}

export function generateRandomAvatar() {
  const idx = Math.floor(Math.random() * 100) + 1;
  const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
  return randomAvatar;
}

export async function storeJwtTokenToCookies(res, token) {
  return await res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent xss attacks,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

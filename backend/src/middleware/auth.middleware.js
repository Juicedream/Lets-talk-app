import jwt, { decode } from "jsonwebtoken";
import User from "../models/User.js";
import { response } from "../lib/utils.js";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return response(res, 401, "Unauthorized - No token provided!");
    }

    //    decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return response(res, 401, "Unauthorized - Invalid token!");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if(!user){
       return response(res, 401, "Unauthorized - User not found!");
    }

    req.user = user;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    return response(res, 500, "Internal Server Error!");
  }
}

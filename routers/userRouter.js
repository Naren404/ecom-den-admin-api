import express from "express";
import { v4 as uuidv4 } from 'uuid';
import { otpGen } from "otp-gen-agent"

import { newUserValidation } from "../middlewares/validationMiddleware/userValidation.js";
import { comparePassword, hashPassword } from "../utility/bcryptHelper.js";
import { createUser, findUserByEmail, updateRefreshJWT, updateUser } from "../models/user/userModel.js";
import { createSession, deleteSession } from "../models/session/sessionModel.js";
import { passwordUpdatedNotificationEmail, sendAccountVerifiedEmail, sendOtpEmail, sendVerificationLinkEmail } from "../utility/nodemailerHelper.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";
import { generateJWTs } from "../utility/jwtHelper.js";
import { adminAuth, refreshAuth } from "../middlewares/authMiddleware/authMiddleware.js";


const userRouter = express.Router();

// PUBLIC ROUTERs

// CREATE A USER | SIGNUP
userRouter.post("/", newUserValidation, async(req, res) => {
  try {
    // hash the password
    const { password } = req.body

    const encryptedPassword = hashPassword(password)

    const user = await createUser({
      ...req.body,
      password: encryptedPassword,
    })

    // if user is creaete, we send verificatin email to the user
    if(user?._id){
      // generate random user Id
      const randomId = uuidv4()

      // we store this random id in session collection agains user email
      const session = await createSession({ token: randomId, userEmail: user.email })

      if(session?._id){
        // create verification link and send verification email
        const verificatinUrl = `${process.env.CLIENT_ROOT_URL}/verify-email?e=${user.email}&id=${randomId}`

        // Now send verificaion email
        sendVerificationLinkEmail(user, verificatinUrl)
      }
    }

    user?._id
      ? buildSuccessResponse(res, {}, "Check your inbox/spam to verify your email") 
      : buildErrorResponse(res, "Could not register the user")
  } catch (error) {
    if(error.code === 11000){
      error.message = "User with this email already exists!!"
    }

    buildErrorResponse(res, error.message)
  }
})

// VERIFY USER EMAIL 
userRouter.post("/verify-email", async(req, res) => {
  try {
    const { userEmail, token } = req.body

    if(userEmail && token){
      const result = await deleteSession( { token, userEmail })

      // if the token exist in session against user email
      if(result?._id){
        // update user to set isVerified true
        const user = await updateUser({email: userEmail}, { isVerified: true })

        if(user?._id){
          // send account verified and welcome email
          sendAccountVerifiedEmail(user, process.env.CLIENT_ROOT_URL)
          return buildSuccessResponse(res, {}, "You email verified. You may log in now.")
        }
      }
    }

    return buildErrorResponse(res, "Account Cannot be verified")
  } catch (error) {
    return buildErrorResponse(res, "Account Cannot be verified")
  }
})

userRouter.post("/login", async(req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await findUserByEmail(email)

    // return error if user is not found or user is not verified
    if(!user?._id){
      return buildErrorResponse(res, "User account does not exist!")
    }

    if(!user?.isVerified){
      return buildErrorResponse(res, "User is not verified")
    }

    if(user?.role !== "admin"){
      return buildErrorResponse(res, "You are not authorized to access this app")
    }
    // Compare password
    const isPasswordMatched = comparePassword(password, user.password)
    // Generate and send back tokens

    if(isPasswordMatched){
      const jwt = await generateJWTs(user.email)

      return buildSuccessResponse(res, jwt, "Logged in Successfully")
    }

    return buildErrorResponse(res, "Invalid Credentials")
  } catch (error) {
    buildErrorResponse(res, "Invalid Credentials")
  }
})

// PRIBVATE ROUTES
userRouter.get("/", adminAuth, async(req, res) => {
  try {
    buildSuccessResponse(res, req.userInfo, "User Info")
  } catch (error) {
    buildErrorResponse(res, error.message)
  }
})


// GET NEW ACCESS TOKEN
userRouter.get("/accessjwt", refreshAuth)

//LOGOUT USER
userRouter.post("/logout", async(req, res)=> {
  try {
    const { email, accessJWT } = req.body

    //remove session for the user
    await deleteSession(accessJWT)

    // update[remove] refreshJWT for the user
    await updateRefreshJWT(email, "")

    buildSuccessResponse(res, {}, "Bye, See you again!!")
  } catch (error) {
    buildErrorResponse(res, error.message)
  }
})

// SEND OTP TO USER
userRouter.post("/request-otp", async(req, res) => {
  try {
    const { email } = req.body

    // find user by email
    const user = await findUserByEmail(email)

    if(user?._id){
      // generate otp
      const otp = await otpGen()

      // create session for that OTP and email
      const session = await createSession({ token: otp, userEmail: email })

      if(session?._id){
        // send otp email
        sendOtpEmail(user, otp)
      }
      return buildSuccessResponse(res, [], "If your email is registered in our system, an OTP will be sent to your email address. Kindly ensure to check your Junk/Spam folder as well.")
    }

    buildErrorResponse(res, "Could not send OTP, please try again later")
  } catch (error) {
    buildErrorResponse(res, "Could not send OTP, please try again later")
  }
})

// RESET PASSWORD
userRouter.patch("/reset-password", async(req, res) => {
  try {
    const { otp, email, password } = req.body
    // Check if otp and email exist in session
    const session = await deleteSession({ token: otp, userEmail: email })

    if(session?._id){
      // hash the password
      const hashedPassword = hashPassword(password)

      // update user password
      const user = await updateUser({ email }, { password: hashedPassword })

      if(user?._id){
        // send email saying you password was reset
        passwordUpdatedNotificationEmail(user)

        return buildSuccessResponse(res, [], "Your password has been udpated, you may login now!")
      }
    }

    buildErrorResponse(res, "Invalid OTP, try again later")
  } catch (error) {
    buildErrorResponse(res, "Invalid OTP, try again later")
  }
})

export default userRouter
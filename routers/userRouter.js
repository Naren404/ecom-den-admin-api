import express from "express";
import { v4 as uuidv4 } from 'uuid';

import { newUserValidation } from "../middlewares/validationMiddleware/userValidation.js";
import { hashPassword } from "../utility/bcryptHelper.js";
import { createUser, updateUser } from "../models/user/userModel.js";
import { createSession, deleteSession } from "../models/session/sessionModel.js";
import { sendAccountVerifiedEmail, sendVerificationLinkEmail } from "../utility/nodemailerHelper.js";
import { buildErrorResponse, buildSuccessResponse } from "../utility/responseHelper.js";


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

export default userRouter
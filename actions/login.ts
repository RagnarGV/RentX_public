"use server";

import * as z from "zod";
import { LoginSchema } from "../schemas";
import bcrypt from "bcryptjs";

import { signIn } from "../auth";
import { DEFAULT_LOGIN_REDIRECT } from "../routes";
import { AuthError } from "next-auth";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getUserByEmail } from "@/data/user";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { userInfoByEmail } from "./userInfo";
// import { AuthError } from "next-auth";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);
  console.log(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  // const isPassMatch = await bcrypt.compare(password,existingUser?.password);

  // console.log("hhhhhh"+isPassMatch);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // if(isPassMatch){
  //   return {success:true}
  // }

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email,
  //   );

  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token,
  //   );

  //   return { success: "Confirmation email sent!" };
  // }

  // if (existingUser.isTwoFactorEnabled && existingUser.email) {
  //   if (code) {
  //     const twoFactorToken = await getTwoFactorTokenByEmail(
  //       existingUser.email
  //     );

  //     if (!twoFactorToken) {
  //       return { error: "Invalid code!" };
  //     }

  //     if (twoFactorToken.token !== code) {
  //       return { error: "Invalid code!" };
  //     }

  //     const hasExpired = new Date(twoFactorToken.expires) < new Date();

  //     if (hasExpired) {
  //       return { error: "Code expired!" };
  //     }

  //     await db.twoFactorToken.delete({
  //       where: { id: twoFactorToken.id }
  //     });

  //     const existingConfirmation = await getTwoFactorConfirmationByUserId(
  //       existingUser.id
  //     );

  //     if (existingConfirmation) {
  //       await db.twoFactorConfirmation.delete({
  //         where: { id: existingConfirmation.id }
  //       });
  //     }

  //     await db.twoFactorConfirmation.create({
  //       data: {
  //         userId: existingUser.id,
  //       }
  //     });
  //   } else {
  //     const twoFactorToken = await generateTwoFactorToken(existingUser.email)
  //     await sendTwoFactorTokenEmail(
  //       twoFactorToken.email,
  //       twoFactorToken.token,
  //     );

  //     return { twoFactor: true };
  //   }
  // }

  try {
    let redirect = DEFAULT_LOGIN_REDIRECT;
    await signIn("credentials", {
      email,
      password,
      redirectTo: redirect,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }
};

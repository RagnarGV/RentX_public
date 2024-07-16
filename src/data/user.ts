import { db } from "@/lib/db";
import { NewPasswordSchema } from "../../schemas";
import { auth } from "../../auth";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    console.log("hiiiiiiiii");

    console.log(user?.password);

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

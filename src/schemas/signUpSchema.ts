import {z} from "zod"

export  const usernameValidation=z.string()
.min(4,"username must have at least 4 characters")
.max(10,"username cannot exceed 10 characters limit")
.regex(/^[a-zA-Z0-9]+$/," Username cannot conatin special characters")


export const signUpSchema =z.object({
    username:usernameValidation,
    email:z.email({message:"please enter valid email address"}),
    password:z.string().min(6,"password should contain at least 6 character")
})
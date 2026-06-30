import {z} from "zod"

export const signInSchema=z.object({
    email:z.email({message :"enter valid email address"}),
    password:z.string().min(6,"password must be at least 6 characters long")
})
import {z} from "zod"

export const messageSchema =z.object({
    content :z.string()
    .min(10,"content must at least 10 characters long")
    .max(200,"content must at most 200 characters long")
})
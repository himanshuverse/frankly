import {z } from "zod"

export const acceptMessageSchema =z.object({
    isAcceptMsg :z.boolean()
})
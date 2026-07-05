
import dbConnect from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs"
import UserModel from "@/src/model/user";
import { sendVerificationEmail } from "@/src/helpers/sendVerificationEmail";

export async function POST(request: Request) {

    await dbConnect()

    try {
        const { username, email, password } = await request.json()

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "username already taken",
            }, {
                status: 400
            })}
            const existingUserByEmail = await UserModel.findOne({
                email
            })
            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
            if (existingUserByEmail) {
                if (existingUserByEmail.isVerified) {
                    Response.json({
                        success: false,
                        message: "user already exist with this email"
                    }, {
                        status: 400
                    })
                }
                else {
                    const hashedPassword = await bcrypt.hash(password, 10)
                    existingUserByEmail.password = hashedPassword
                    existingUserByEmail.verifyCode = verifyCode
                    existingUserByEmail.verifyCodeExp = new Date(Date.now() + 3600000)
                    await existingUserByEmail.save()
                }
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                const newUser = new UserModel({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: [],
                });
                await newUser.save()

            }
            // send email
            const emailResponse = await sendVerificationEmail(username, email, verifyCode)

            if (!emailResponse) {
                return Response.json({
                    success: false,
                    message: "email not sent"
                }, {
                    status: 400
                })
            }
            return Response.json({
                success: true,
                message: "User is successfully registered"
            }, {
                status: 201
            })
        }

    
    
 catch (error) {

    console.error('Error registering user:', error);
    return Response.json(
        {
            success: false,
            message: 'Error registering user',
        },
        { status: 500 }
    );
}
}
import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/user";
import { Message } from "@/src/model/user";



export async function POST(request: Request) {
    await dbConnect()

    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ username })
        if (!user) {
            return Response.json(
                { success: false, message: 'user not found' },
                { status: 404 }
            );
        }

        //check if user accepting msg

        if (!user.isAcceptingMsg) {
            return Response.json(
                { success: false, message: 'user not accepting messages' },
                { status: 403 }
            );
        }

        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)

        await user.save()
        return Response.json(
            { success: true, message: 'message sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('An unexpected error', error);
        return Response.json(
            { success: false, message: 'An unexpected error' },
            { status: 500 }
        );
    }
}
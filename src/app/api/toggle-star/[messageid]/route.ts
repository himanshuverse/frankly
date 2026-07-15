import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/user";
import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  const { messageid } = await params;
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const user = await UserModel.findById(sessionUser._id);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Find message by ID in the user's subdocument messages array using Mongoose's .id() helper
    const message = (user.messages as any).id(messageid);
    if (!message) {
      return Response.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    // Toggle starred value
    message.isStarred = !message.isStarred;
    
    // Explicitly notify Mongoose that the subdocument array has been modified
    user.markModified("messages");
    await user.save();

    return Response.json(
      {
        success: true,
        message: `Message ${message.isStarred ? "starred" : "unstarred"}`,
        isStarred: message.isStarred,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error toggling message star:", error);
    return Response.json(
      { success: false, message: "Failed to toggle star status" },
      { status: 500 }
    );
  }
}

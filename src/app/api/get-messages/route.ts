import dbConnect from "@/src/lib/dbConnect";
import UserModel from "@/src/model/user";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  try {
    if (!sessionUser._id) {
      return Response.json(
        {
          success: false,
          message: "User ID not found in session",
        },
        {
          status: 401,
        }
      );
    }

    const userId = new mongoose.Types.ObjectId(sessionUser._id);

    const users = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!users || users.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found or no messages available",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Messages retrieved successfully",
        messages: users[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);

    return Response.json(
      {
        success: false,
        message: "Error retrieving messages",
      },
      {
        status: 500,
      }
    );
  }
}

import mongoose ,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content:string,
    createdAt:Date
}

const MessageSchema : Schema<Message>= new Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})


export interface User extends Document{
    username:string,
    password:string,
    email:string,
    verifyCode:string,
    verifyCodeExp:Date,
    isVerified:boolean,
    isAcceptingMsg:boolean,
    messages:Message[]
}

const UserSchema :Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true
    },email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"please use valid email address"]
    },password:{
        type:String,
        required:[true,"password is required"],
    },verifyCode:{
        type:String,
        required:[true,"verifyCode is required"],
    },
    verifyCodeExp:{
        type:Date,
    },
    isVerified:{
        type:Boolean,
        required:true,
        defaut:false
    },isAcceptingMsg:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",UserSchema))

export default UserModel
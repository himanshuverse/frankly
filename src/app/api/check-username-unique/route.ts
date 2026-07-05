import dbConnect from "@/src/lib/dbConnect";
import {z} from "zod"
import UserModel from "@/src/model/user";
import { usernameValidation } from "@/src/schemas/signUpSchema";


const usernameQuerySchema =z.object({
    username:usernameValidation
})


 export async function GET(request:Request){

    
        await dbConnect();
        try {
            const {searchParams} = new URL(request.url)
            const queryParam ={
                username:searchParams.get("username")
            }
            console.log(queryParam)
            // validate with zod 
            const result = usernameQuerySchema.safeParse(queryParam)
            
            if(!result.success){
                return Response.json({
                    success:false,
                message:"invalid query parameter"                          },{
                    status:400
                })
            }

            const {username}= result.data

            const existingVerifiedUser= await UserModel.findOne({
                username,isVerified:true
            })

            if(existingVerifiedUser){
                return Response.json({
                success:false,
                message:"username already taken  "
            },{
                status:400
            })
            }

            return Response.json({
                success:true,
                message:"username is unique "
            },{
                status:200
            })


        } catch (error) {
            console.error("error checking username", error)
            return Response.json({
                success:false,
                message:"error checking username "
            },{
                status:400
            })
            
        }
}
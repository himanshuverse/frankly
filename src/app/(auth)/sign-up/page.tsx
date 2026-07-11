"use client"

import {z} from "zod"
import { useState,useEffect } from "react";
import Link from "next/link";
import { ApiResponse } from "@/src/types/ApiResponse";
import { zodResolver } from '@hookform/resolvers/zod';
import {useDebounceCallback} from "usehooks-ts";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signUpSchema } from "@/src/schemas/signUpSchema";
import {useForm , Controller} from "react-hook-form"
import axios from "axios"
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Loader2}  from "lucide-react"
import toast from "react-hot-toast";



export default  function signUpFrom(){
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 300);

  const router =useRouter()

const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode:"onBlur",
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

   useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage(''); // Reset message
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${debounced}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debounced]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);

      router.replace(`/verify/${username}`);
      toast("success")

      setIsSubmitting(false);
    } catch (error) {
      console.error('Error during sign-up:', error);

      const axiosError = error as AxiosError<ApiResponse>;

      // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');
      toast("Sign up failed ")

      setIsSubmitting(false);
    }
  };

  return (
    <div  className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
                <Controller
                    control={form.control}
                    name="username"
                    render={({ field , fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel> Name </FieldLabel>
                            <Input placeholder="Enter your username" {...field} onChange={(e)=>{
                              field.onChange(e)
                              setUsername(e.target.value)
                            }} />
                             {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                            {
                                fieldState.invalid && (
                                <FieldError errors={[fieldState.error]}/>
                                )
                            }
                            
                        </Field>
                    )} />
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input {...field} id="email" type="email" placeholder="Enter your email" />
                            <p className=' text-gray-400 text-sm'>We will send you a verification code</p>

                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )} />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field ,fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel> Password </FieldLabel>
                            <Input placeholder="Enter your Password" {...field} />
                            {
                                fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]}/>
                                )
                            }
                        </Field>
                    )} />
               

            </FieldGroup>
           <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
        </div>
        </div>
  )

}

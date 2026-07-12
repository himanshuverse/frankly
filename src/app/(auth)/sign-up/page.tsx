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
import toast from "react-hot-toast";
import { Loader2, MessageSquare, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";




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
    <div className="min-h-screen flex flex-col justify-between bg-background bg-grid-pattern">
      {/* Header */}
      <header className="w-full border-b border-dashed border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-none bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              frankly<span className="text-primary">.</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 relative overflow-hidden">
        <div className="w-full max-w-md">
          <div className="blueprint-panel rounded-none p-6 md:p-8 shadow-sm relative overflow-hidden space-y-6 bg-card/40 backdrop-blur-sm">
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight uppercase text-foreground">
                Create your page 
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                Sign up to start your anonymous adventure
              </p>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup className="space-y-4">
                {/* Username */}
                <Controller
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1 block">
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Name
                      </FieldLabel>
                      <div className="relative flex items-center">
                        <Input
                          placeholder="Enter your username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                          className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                        />
                        {isCheckingUsername && (
                          <Loader2 className="absolute right-3 w-4.5 h-4.5 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      {!isCheckingUsername && usernameMessage && (
                        <p
                          className={`text-[10px] uppercase font-bold mt-1 ${
                            usernameMessage === 'Username is unique'
                              ? 'text-primary'
                              : 'text-red-500'
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-[10px] uppercase font-bold text-red-500 mt-1 block" />
                      )}
                    </Field>
                  )}
                />

                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1 block">
                      <FieldLabel htmlFor="email" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Email
                      </FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                      />
                      <p className="text-[10px] text-muted-foreground font-medium">
                        We will send you a verification code
                      </p>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-[10px] uppercase font-bold text-red-500 mt-1 block" />
                      )}
                    </Field>
                  )}
                />

                {/* Password */}
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="space-y-1 block">
                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Password
                      </FieldLabel>
                      <Input
                        placeholder="Enter your Password"
                        type="password"
                        {...field}
                        className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} className="text-[10px] uppercase font-bold text-red-500 mt-1 block" />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 mt-2 rounded-none bg-primary border border-primary text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
              >
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
              <p className="text-xs text-muted-foreground">
                Already a member?{' '}
                <Link href="/sign-in" className="text-primary font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 border-t border-dashed border-border/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Claiming a profile secures your custom URL. Standard terms apply.</span>
        </div>
      </footer>
    </div>
  );
}

  
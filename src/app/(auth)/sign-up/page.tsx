"use client";

import { z } from "zod";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceValue } from "usehooks-ts";
import toast from "react-hot-toast";
import {
  Loader2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";

import { ApiResponse } from "@/src/types/ApiResponse";
import { signUpSchema } from "@/src/schemas/signUpSchema";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";


function SignUpForm() {
  const router = useRouter();
    const searchParams = useSearchParams();
const handleFromUrl = searchParams.get("handle") || "";

  const [username, setUsername] = useState(handleFromUrl);
  const [debouncedUsername] = useDebounceValue(username, 300);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameUnique, setIsUsernameUnique] = useState<boolean | null>(
    null
  );
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",

    defaultValues: {
      username: handleFromUrl ,
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    // Reset everything if username is empty
    if (!debouncedUsername) {
      setUsernameMessage("");
      setIsUsernameUnique(null);
      return;
    }
    // Validate username locally before making API request
    const usernameValidation =
      signUpSchema.shape.username.safeParse(debouncedUsername);

    if (!usernameValidation.success) {
      setUsernameMessage("");
      setIsUsernameUnique(null);
      return;
    }

    // Abort previous request if username changes
    const controller = new AbortController();


    const checkUsernameUnique = async () => {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      setIsUsernameUnique(null);

      try {
        const response = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${encodeURIComponent(
            debouncedUsername
          )}`,
          {
            signal: controller.signal,
          }
        );


        setUsernameMessage(response.data.message);
        setIsUsernameUnique(response.data.success);

      } catch (error) {
        // Ignore cancelled requests
        if (axios.isCancel(error)) {
          return;
        }

        const axiosError = error as AxiosError<ApiResponse>;

        setUsernameMessage(
          axiosError.response?.data.message ??
            "Error checking username availability"
        );

        setIsUsernameUnique(false);

      } finally {
        if (!controller.signal.aborted) {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
    return () => {
      controller.abort();
    };

  }, [debouncedUsername]);


  // Handle form submission
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // Prevent submission while checking username
    if (isCheckingUsername) {
      toast.error("Please wait while we check your username");
      return;
    }


    // Prevent submission if username is unavailable
    if (isUsernameUnique === false) {
      toast.error("Please choose another username");
      return;
    }


    setIsSubmitting(true);


    try {
      await axios.post<ApiResponse>("/api/sign-up", data);


      toast.success("Account created successfully. Signing in...");

      // Auto sign-in
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.ok) {
        toast.success("Signed in successfully");
        router.replace("/dashboard");
        router.refresh();
      } else {
        toast.error("Account created, please sign in manually");
        router.replace("/sign-in");
      }

    } catch (error) {
      console.error("Error during sign-up:", error);


      const axiosError = error as AxiosError<ApiResponse>;


      const errorMessage =
        axiosError.response?.data.message ??
        "There was a problem with your sign-up. Please try again.";


      toast.error(errorMessage);

    } finally {
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


            {/* Heading */}
            <div className="text-center">

              <h1 className="text-2xl font-bold tracking-tight uppercase text-foreground">
                Create your page
              </h1>

              <p className="text-xs text-muted-foreground mt-1">
                Sign up to start your anonymous adventure
              </p>

            </div>


            {/* Form */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >

              <FieldGroup className="space-y-4">


                {/* Username */}
                <Controller
                  control={form.control}
                  name="username"
                  render={({ field, fieldState }) => (

                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1 block"
                    >

                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Username
                      </FieldLabel>


                      <div className="relative flex items-center">

                        <Input
                          {...field}
                          placeholder="Enter your username"

                          onChange={(event) => {
                            field.onChange(event);
                            setUsername(event.target.value);
                          }}

                          className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                        />


                        {isCheckingUsername && (
                          <Loader2 className="absolute right-3 w-4 h-4 animate-spin text-muted-foreground" />
                        )}

                      </div>


                      {/* Username availability message */}
                      {!isCheckingUsername &&
                        usernameMessage &&
                        !fieldState.invalid && (

                          <p
                            className={`text-[10px] uppercase font-bold mt-1 ${
                              isUsernameUnique
                                ? "text-primary"
                                : "text-red-500"
                            }`}
                          >
                            {usernameMessage}
                          </p>

                        )}


                      {/* Validation error */}
                      {fieldState.invalid && (

                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[10px] uppercase font-bold text-red-500 mt-1 block"
                        />

                      )}

                    </Field>

                  )}
                />


                {/* Email */}
                <Controller
                  control={form.control}
                  name="email"
                  render={({ field, fieldState }) => (

                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1 block"
                    >

                      <FieldLabel
                        htmlFor="email"
                        className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1"
                      >
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

                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[10px] uppercase font-bold text-red-500 mt-1 block"
                        />

                      )}

                    </Field>

                  )}
                />


                {/* Password */}
                <Controller
                  control={form.control}
                  name="password"
                  render={({ field, fieldState }) => (

                    <Field
                      data-invalid={fieldState.invalid}
                      className="space-y-1 block"
                    >

                      <FieldLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                        Password
                      </FieldLabel>


                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"

                        className="w-full rounded-none border border-dashed border-border bg-card/40 hover:bg-card/75 focus:bg-card focus:border-primary focus:outline-none transition-all px-3 py-2.5 text-sm"
                      />


                      {fieldState.invalid && (

                        <FieldError
                          errors={[fieldState.error]}
                          className="text-[10px] uppercase font-bold text-red-500 mt-1 block"
                        />

                      )}

                    </Field>

                  )}
                />

              </FieldGroup>


              {/* Submit Button */}
              <Button
                type="submit"

                disabled={
                  isSubmitting ||
                  isCheckingUsername ||
                  isUsernameUnique === false
                }

                className="w-full py-3 mt-2 rounded-none bg-primary border border-primary text-primary-foreground font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed active:scale-[0.99]"
              >

                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : isCheckingUsername ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking username...</span>
                  </>
                ) : (
                  <span>Sign Up</span>
                )}
              </Button>
            </form>
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground">
                Already a member?{" "}
                <Link
                  href="/sign-in"
                  className="text-primary font-bold hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 border-t border-dashed border-border/20 text-center text-xs text-muted-foreground">
        <div className="container mx-auto px-4 flex items-center justify-center gap-1 text-[10px] uppercase tracking-wider font-bold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>
            Claiming a profile secures your custom URL. Standard terms apply.
          </span>

        </div>

      </footer>

    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs uppercase tracking-wider font-bold text-muted-foreground">
          Loading sign up...
        </p>
      </div>
    }>
      <SignUpForm />
    </Suspense>
  );
}
'use client';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { ApiResponse } from "@/src/types/ApiResponse"
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
import { verifySchema } from '@/src/schemas/verifySchema';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });


      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <FieldGroup >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Controller
              name="code"
              control={form.control}
              render={({ field , fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Verification Code</FieldLabel>
                  <Input {...field} />
                                             {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                </Field>
              )}
            />
            
            <Button type="submit">Verify</Button>
          </form>
        </FieldGroup>
      </div>
    </div>
  );
}
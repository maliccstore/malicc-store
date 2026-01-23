"use client";

import { useForm } from "react-hook-form";
import { Button, TextField, Flex, Card, Heading, Text } from "@radix-ui/themes";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store";

interface SignupFormData {
  phoneNumber: string;
}

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupFormData>();

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  const onSubmit = async (data: SignupFormData) => {
    try {
      await dispatch(
        signupThunk({ phoneNumber: data.phoneNumber })
      ).unwrap();

      toast.success("Account created successfully!");
      router.push(
        `/auth/verify-otp?phone=${encodeURIComponent(data.phoneNumber)}`
      );
    } catch (err: unknown) {
      const error = err as {
        validationErrors?: Array<{ field: string; message: string }>;
        message?: string;
      };
      // Handle validation errors
      if (error?.validationErrors && Array.isArray(error.validationErrors)) {
        error.validationErrors.forEach((err_item: { field: string; message: string }) => {
          setError(err_item.field as keyof SignupFormData, { type: "server", message: err_item.message });
        });
        return;
      }

      // Handle general error message
      const errorMessage = error?.message || (typeof error === "string" ? error : "Signup failed");
      toast.error(errorMessage);
    }
  };

  return (
    <Card size="4" className="max-w-md w-full">
      <Flex direction="column" gap="4">
        <Heading size="6" align="center">
          Create Your Account
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">

            <TextField.Root
              size="3"
              placeholder="Phone Number"
              type="tel"
              {...register("phoneNumber", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Invalid phone number",
                },
              })}
            />
            {errors.phoneNumber && (
              <Text color="red" size="2">
                {errors.phoneNumber.message}
              </Text>
            )}

            <Button size="3" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </Flex>
        </form>

        <Text align="center" size="2">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </Text>
      </Flex>
    </Card>
  );
};

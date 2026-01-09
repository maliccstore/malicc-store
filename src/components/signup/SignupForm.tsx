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
  username?: string;
  email?: string;
  password?: string;
  phoneNumber: string;
}

export const SignupForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>();

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log("Form Data:", data);
      const payload = {
        ...data,
        username: data.username || undefined,
        email: data.email || undefined,
        password: data.password || undefined,
      };
      console.log("Sanitized Payload:", payload);

      await dispatch(
        signupThunk(payload)
      ).unwrap();

      toast.success("Account created successfully!");
      router.push(
        `/auth/verify-otp?phone=${encodeURIComponent(data.phoneNumber)}`
      );
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : (error instanceof Error ? error.message : "Signup failed");

      if (errorMessage.toLowerCase().includes("already exists")) {
        toast.error("Account already exists. Please Login.");
        // Optional: redirect to login after a delay or show a link
        setTimeout(() => router.push('/auth/login'), 2000);
      } else {
        toast.error(errorMessage);
      }
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
              placeholder="Username"
              {...register("username", {
                // required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
            />
            {errors.username && (
              <Text color="red" size="2">
                {errors.username.message}
              </Text>
            )}

            <TextField.Root
              size="3"
              placeholder="Email"
              type="email"
              {...register("email", {
                // required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <Text color="red" size="2">
                {errors.email.message}
              </Text>
            )}

            <TextField.Root
              size="3"
              placeholder="Password"
              type="password"
              {...register("password", {
                // required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            {errors.password && (
              <Text color="red" size="2">
                {errors.password.message}
              </Text>
            )}

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

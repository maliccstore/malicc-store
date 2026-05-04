"use client";

import { useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Flex,
  Card,
  Heading,
  Text,
} from "@radix-ui/themes";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  loadUserThunk,
  signupThunk,
  signupWithPasswordThunk,
} from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store";

interface SignupFormData {
  phoneNumber: string;
  password?: string;
}

export const SignupForm = () => {
  const [signupMode, setSignupMode] = useState<"OTP" | "PASSWORD">("OTP");

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
      if (signupMode === "OTP") {
        await dispatch(
          signupThunk({ phoneNumber: data.phoneNumber })
        ).unwrap();

        toast.success("OTP sent 📲");

        router.push(
          `/auth/verify-otp?phone=${encodeURIComponent(
            data.phoneNumber
          )}`
        );
      } else {
        if (!data.password) {
          toast.error("Password is required");
          return;
        }

        await dispatch(
          signupWithPasswordThunk({
            phoneNumber: data.phoneNumber,
            password: data.password,
          })
        ).unwrap();

        toast.success("Account created successfully 🔥");
        await dispatch(loadUserThunk());
        router.push("/profile");
      }
    } catch (err: unknown) {
      const error = err as {
        validationErrors?: Array<{ field: string; message: string }>;
        message?: string;
      };

      if (error?.validationErrors) {
        error.validationErrors.forEach((err_item) => {
          setError(err_item.field as keyof SignupFormData, {
            type: "server",
            message: err_item.message,
          });
        });
        return;
      }

      const errorMessage =
        error?.message ||
        (typeof error === "string" ? error : "Signup failed");

      if (errorMessage.includes("already exists")) {
        toast.error("User already exists. Try logging in.");
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

        {/* 🔥 Toggle */}
        <Flex justify="center" gap="3">
          <Button
            variant={signupMode === "OTP" ? "solid" : "soft"}
            onClick={() => setSignupMode("OTP")}
          >
            OTP
          </Button>

          <Button
            variant={signupMode === "PASSWORD" ? "solid" : "soft"}
            onClick={() => setSignupMode("PASSWORD")}
          >
            Password
          </Button>
        </Flex>

        <Text size="1" align="center" color="gray">
          {signupMode === "OTP"
            ? "We’ll verify your phone with OTP"
            : "Create account with password"}
        </Text>

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

            {/* 🔥 Password Field */}
            {signupMode === "PASSWORD" && (
              <>
                <TextField.Root
                  size="3"
                  placeholder="Password"
                  type="password"
                  {...register("password", {
                    required: signupMode === "PASSWORD",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                />

                {errors.password && (
                  <Text color="red" size="2">
                    {errors.password.message}
                  </Text>
                )}
              </>
            )}

            <Button size="3" type="submit" disabled={loading}>
              {loading
                ? "Creating account..."
                : signupMode === "OTP"
                ? "Send OTP"
                : "Sign Up"}
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
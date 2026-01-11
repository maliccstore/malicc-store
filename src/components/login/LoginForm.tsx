'use client';

import { useForm } from 'react-hook-form';
import { Button, TextField, Flex, Card, Heading, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LoginFormData {
  phoneNumber: string;
}

// Redux
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { loginStartThunk, resendOTPThunk } from "@/store/slices/authSlice";

export default function LoginForm() {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  // const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Login Start
      await dispatch(loginStartThunk(data.phoneNumber)).unwrap();
      // Redirect to OTP verification page with phone number
      router.push(
        `/auth/verify-otp?phone=${encodeURIComponent(data.phoneNumber)}`
      );
      toast.success('OTP sent to your phone number');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('User not found')) {
        toast.error('User not found. Please Sign Up first.');
      } else if (errorMessage.includes('User must verify their phone first')) {
        // Auto-handle unverified user: Resend OTP and redirect
        try {
          await dispatch(resendOTPThunk(data.phoneNumber)).unwrap();
          toast.success('Account exists. OTP resent!');
          router.push(
            `/auth/verify-otp?phone=${encodeURIComponent(data.phoneNumber)}`
          );
        } catch {
          toast.error('Failed to resend OTP for verification.');
        }
      } else {
        toast.error(`Failed to send OTP. Please try again : ${errorMessage}`);
      }
    }
  };

  // Handle Sign Up
  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <Card size="4" className="max-w-md w-full">
      <Flex direction="column" gap="4">
        <Heading size="6" align="center">
          Login with Phone Number
        </Heading>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4">
            <TextField.Root
              size="3"
              placeholder="Phone Number"
              type="tel"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: 'Invalid phone number',
                },
              })}
            />
            {errors.phoneNumber && (
              <Text color="red" size="2">
                {errors.phoneNumber.message}
              </Text>
            )}

            <Button size="3" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </Flex>
        </form>

        <Flex direction="column" gap="2" align="center">
          <Text align="center" size="2">
            Do not have an account?
          </Text>
          <Button
            variant="soft"
            size="2"
            onClick={handleSignUp}
            className="w-fit"
          >
            Sign Up
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}

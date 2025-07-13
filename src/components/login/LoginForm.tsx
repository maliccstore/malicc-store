'use client';

import { useForm } from 'react-hook-form';
import { Button, TextField, Flex, Card, Heading, Text } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface LoginFormData {
  phoneNumber: string;
}

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Here you would typically call your API to send OTP
      // For now, we'll simulate a successful request
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to OTP verification page with phone number
      router.push(
        `/auth/verify-otp?phone=${encodeURIComponent(data.phoneNumber)}`
      );
      toast.success('OTP sent to your phone number');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    }
  };

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
            Don't have an account?
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

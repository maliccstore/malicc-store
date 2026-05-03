'use client';

import { useForm } from 'react-hook-form';
import {
  Button,
  TextField,
  Flex,
  Card,
  Heading,
  Text,
} from '@radix-ui/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  loadUserThunk,
  loginStartThunk,
  loginWithPasswordThunk,
} from '@/store/slices/authSlice';
import { useState } from 'react';

interface LoginFormData {
  phoneNumber: string;
  password?: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/explore';

  const [loginMode, setLoginMode] = useState<'OTP' | 'PASSWORD'>('OTP');

  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      if (loginMode === 'OTP') {
        await dispatch(loginStartThunk(data.phoneNumber)).unwrap();

        router.push(
          `/auth/verify-otp?phone=${encodeURIComponent(
            data.phoneNumber
          )}&returnUrl=${encodeURIComponent(returnUrl)}`
        );

        toast.success('OTP sent to your phone number 📲');
      } else {
        if (!data.password) {
          toast.error('Password is required');
          return;
        }

        await dispatch(
          loginWithPasswordThunk({
            phoneNumber: data.phoneNumber,
            password: data.password,
          })
        ).unwrap();
        await dispatch(loadUserThunk());
        toast.success('Login successful 🔥');
        
        router.replace(returnUrl);
        router.refresh();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      // Smart UX handling
      if (errorMessage.includes('password not set')) {
        toast.error('Use OTP login for this account');
      } else if (errorMessage.includes('Invalid credentials')) {
        toast.error('Wrong password');
      } else if (errorMessage.includes('User not found')) {
        toast.error('User not found. Please sign up.');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleSignUp = () => {
    router.push('/auth/signup');
  };

  return (
    <Card size="4" className="max-w-md w-full">
      <Flex direction="column" gap="4">
        <Heading size="6" align="center">
          Login
        </Heading>

        {/* 🔥 Toggle FIRST (better UX) */}
        <Flex justify="center" gap="3">
          <Button
            variant={loginMode === 'OTP' ? 'solid' : 'soft'}
            onClick={() => setLoginMode('OTP')}
          >
            OTP
          </Button>

          <Button
            variant={loginMode === 'PASSWORD' ? 'solid' : 'soft'}
            onClick={() => setLoginMode('PASSWORD')}
          >
            Password
          </Button>
        </Flex>

        <Text size="1" align="center" color="gray">
          {loginMode === 'OTP'
            ? 'We’ll send you a one-time code'
            : 'Enter your password to continue'}
        </Text>

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

            {loginMode === 'PASSWORD' && (
              <>
                <TextField.Root
                  size="3"
                  placeholder="Password"
                  type="password"
                  {...register('password', {
                    required: loginMode === 'PASSWORD',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters',
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

            <Button size="3" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? loginMode === 'OTP'
                  ? 'Sending OTP...'
                  : 'Logging in...'
                : loginMode === 'OTP'
                ? 'Send OTP'
                : 'Login'}
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
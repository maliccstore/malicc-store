"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { AppDispatch, RootState } from "@/store";
import { updateUserThunk, setUser } from "@/store/slices/authSlice";
import {
  requestAdminPhoneChangeOTPAPI,
  verifyAdminPhoneChangeAPI,
} from "@/services/auth.service";
import {
  Container,
  Heading,
  Text,
  Card,
  Flex,
  Box,
  Grid,
  Button,
  TextField,
  Callout
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function SettingsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user)

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  const isUsernameChanged = username !== (user?.username || "");
  const isEmailChanged = email !== (user?.email || "");
  const isProfileChanged = isUsernameChanged || isEmailChanged;

  const isPhoneChanged = phoneNumber !== (user?.phoneNumber || "");

  const handleSaveProfile = async () => {
    if (!isProfileChanged) {
      toast.error("No profile changes to save");
      return;
    }

    try {
      setIsSavingProfile(true);
      const updatePayload: { username?: string; email?: string } = {};
      if (isUsernameChanged) updatePayload.username = username;
      if (isEmailChanged) updatePayload.email = email;

      await dispatch(updateUserThunk(updatePayload)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePhone = async () => {
    if (!isPhoneChanged) {
      toast.error("No phone number changes to save");
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setIsSavingPhone(true);
      await requestAdminPhoneChangeOTPAPI(phoneNumber);
      toast.success("OTP sent to your new phone number. Please verify.");
      setIsVerifyingPhone(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to request OTP for new phone");
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      setIsSavingPhone(true);
      const response = await verifyAdminPhoneChangeAPI(otp, phoneNumber);
      if (response?.data?.data?.verifyAdminPhoneChange) {
        dispatch(setUser(response.data.data.verifyAdminPhoneChange));
        toast.success("Phone number verified and updated successfully!");
        setIsVerifyingPhone(false);
        setOtp("");
      } else {
        throw new Error("Failed to verify OTP");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid OTP or verification failed");
    } finally {
      setIsSavingPhone(false);
    }
  };

  return (
    <Container size="3" p="4" className="py-8">
      <Box mb="6">
        <Heading size="6" weight="bold">Admin Settings</Heading>
        <Text color="gray" size="2">Manage your account and security preferences.</Text>
      </Box>

      <Card size="3" variant="surface">
        <Box mb="6" pb="4" className="border-b border-gray-200">
          <Heading size="4">Security & Account</Heading>
          <Text color="gray" size="2" mt="1" as="p">
            Update your credentials. Phone number changes require SMS verification.
          </Text>
        </Box>

        <Box className="space-y-8">
          {!isVerifyingPhone ? (
            <>
              {/* Profile Details Section */}
              <Box style={{ maxWidth: '32rem' }}>
                <Heading size="3" mb="4">Profile Information</Heading>
                <Grid columns="1" gap="4">
                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1" className="block">
                      Username
                    </Text>
                    <TextField.Root
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </Box>

                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1" className="block">
                      Email Address
                    </Text>
                    <TextField.Root
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                    />
                  </Box>
                </Grid>

                <Flex justify="end" mt="4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile || isSavingPhone || !isProfileChanged}
                  >
                    {isSavingProfile ? "Saving Profile..." : "Update Profile"}
                  </Button>
                </Flex>
              </Box>

              <hr className="border-gray-200 my-6" />

              {/* Phone Section */}
              <Box style={{ maxWidth: '32rem' }}>
                <Heading size="3" mb="4">Phone Number</Heading>
                <Grid columns="1" gap="4">
                  <Box>
                    <Text as="label" size="2" weight="medium" mb="1" className="block">
                      New Phone Number
                    </Text>
                    <TextField.Root
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1234567890"
                    />
                  </Box>
                </Grid>

                <Flex justify="end" mt="4">
                  <Button
                    onClick={handleUpdatePhone}
                    disabled={isSavingPhone || isSavingProfile || !isPhoneChanged}
                  >
                    {isSavingPhone ? "Sending OTP..." : "Update Phone"}
                  </Button>
                </Flex>
              </Box>
            </>
          ) : (
            <>
              {/* OTP Verification Flow */}
              <Box style={{ maxWidth: '32rem' }}>
                <Callout.Root color="amber" mb="6">
                  <Callout.Icon>
                    <InfoCircledIcon />
                  </Callout.Icon>
                  <Callout.Text>
                    We sent a verification code to <Text weight="bold">{phoneNumber}</Text>.
                  </Callout.Text>
                </Callout.Root>

                <Box mb="6">
                  <Text as="label" size="2" weight="medium" mb="1" className="block">
                    Enter OTP
                  </Text>
                  <TextField.Root
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    size="3"
                  />
                </Box>

                <Flex justify="end" gap="3">
                  <Button
                    variant="soft"
                    color="gray"
                    onClick={() => {
                      setIsVerifyingPhone(false);
                      setPhoneNumber(user?.phoneNumber || "");
                      setOtp("");
                    }}
                    disabled={isSavingPhone}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isSavingPhone || !otp}
                  >
                    {isSavingPhone ? "Verifying..." : "Verify & Save"}
                  </Button>
                </Flex>
              </Box>
            </>
          )}
        </Box>
      </Card>
    </Container>
  );
}

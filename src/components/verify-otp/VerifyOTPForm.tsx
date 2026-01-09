"use client";

import { useForm } from "react-hook-form";
import { Button, TextField, Flex, Card, Heading, Text } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { verifyOTPThunk } from "@/store/slices/authSlice";

interface VerifyOTPFormData {
    otp: string;
}

export default function VerifyOTPForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phoneNumber = searchParams.get("phone");

    // Redux
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyOTPFormData>();

    // Submit OTP
    const onSubmit = async (data: VerifyOTPFormData) => {
        if (!phoneNumber) {
            toast.error("Phone number missing");
            return;
        }
        // Verify OTP
        try {
            await dispatch(verifyOTPThunk({ phoneNumber, otp: data.otp })).unwrap();
            alert("Verified successfully!");
            toast.success("Verified successfully!");
            router.push("/");
        } catch (error) {
            toast.error(`Verification failed: ${error}`);
        }
    };

    return (
        <Card size="4" className="max-w-md w-full">
            <Flex direction="column" gap="4">
                <Heading size="6" align="center">
                    Enter OTP
                </Heading>
                <Text align="center" size="2" color="gray">
                    Sent to {phoneNumber}
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Flex direction="column" gap="4">
                        <TextField.Root
                            size="3"
                            placeholder="Enter 6-digit OTP"
                            {...register("otp", {
                                required: "OTP is required",
                                pattern: {
                                    value: /^[0-9]{4,6}$/,
                                    message: "Invalid OTP",
                                },
                            })}
                        />
                        {errors.otp && (
                            <Text color="red" size="2">
                                {errors.otp.message}
                            </Text>
                        )}

                        <Button size="3" type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Verify OTP"}
                        </Button>
                    </Flex>
                </form>
            </Flex>
        </Card>
    );
}

"use client";

import { RootState } from "@/store";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Container, Heading, Flex, Card, Box, Text, TextField, Button } from "@radix-ui/themes";
import { updateUserByPhoneAPI } from "@/services/auth.service";
import { setUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phoneNumber: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await updateUserByPhoneAPI({
                username: formData.username,
                email: formData.email,
            });

            if (response?.data?.data?.updateUserByPhone) {
                const updatedUser = response.data.data.updateUserByPhone;
                dispatch(setUser(updatedUser));
                toast.success("Profile updated successfully");
            }
        } catch (error) {
            const message = (error as { message?: string })?.message || "Failed to update profile";
            toast.error(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container size="1" p="4" className="py-8">
            <Heading size="6" mb="6">My Profile</Heading>

            <Flex direction="column" gap="4">
                <Card size="2">
                    <Heading size="4" mb="4" weight="medium">Personal Information</Heading>
                    <form onSubmit={handleSave}>
                        <Flex direction="column" gap="4">
                            <Box>
                                <Text as="label" size="2" mb="1" weight="bold">Phone Number</Text>
                                <TextField.Root
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    readOnly
                                    disabled
                                    variant="soft"
                                    color="gray"
                                />
                                <Text size="1" color="gray">Phone number cannot be changed.</Text>
                            </Box>

                            <Box>
                                <Text as="label" size="2" mb="1" weight="bold">Username</Text>
                                <TextField.Root
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Username"
                                />
                            </Box>
                            <Box>
                                <Text as="label" size="2" mb="1" weight="bold">Email</Text>
                                <TextField.Root
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    type="email"
                                />
                            </Box>

                            <Button
                                type="submit"
                                disabled={
                                    loading ||
                                    (formData.username === (user?.username || "") &&
                                        formData.email === (user?.email || ""))
                                }
                                size="3"
                                variant="solid"
                            >
                                {loading ? "Updating..." : "Save Changes"}
                            </Button>
                        </Flex>
                    </form>
                </Card>
            </Flex>
        </Container>
    );
}
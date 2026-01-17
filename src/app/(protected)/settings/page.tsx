"use client";

import { RootState } from "@/store";
import { logout } from "@/store/slices/authSlice";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { Container, Heading, Flex, Card, Box, Text, TextField, Button } from "@radix-ui/themes";

export default function SettingsPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

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

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Profile updated successfully (Simulated)");
        }, 1000);
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        router.push("/auth/login");
    };

    return (
        <Container size="1" p="4" className="py-8">
            <Heading size="6" mb="6">Settings</Heading>

            <Flex direction="column" gap="4">
                <Card size="2">
                    <Heading size="4" mb="4" weight="medium">Profile Information</Heading>
                    <form onSubmit={handleSave}>
                        <Flex direction="column" gap="4">
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
                            <Box>
                                <Text as="label" size="2" mb="1" weight="bold">Phone Number</Text>
                                <TextField.Root
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                />
                            </Box>

                            <Button type="submit" disabled={loading} size="3" variant="solid">
                                {loading ? "Updating..." : "Save Changes"}
                            </Button>
                        </Flex>
                    </form>
                </Card>

                <Card size="2">
                    <Button
                        onClick={handleLogout}
                        color="red"
                        variant="soft"
                        size="3"
                        style={{ width: '100%' }}
                    >
                        Logout
                    </Button>
                </Card>
            </Flex>
        </Container>
    );
}

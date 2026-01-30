"use client";

import { logout } from "@/store/slices/authSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Container, Heading, Flex, Card, Button } from "@radix-ui/themes";

export default function SettingsPage() {
    const dispatch = useDispatch();
    const router = useRouter();

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
                    <Heading size="4" mb="4" weight="medium">Account</Heading>
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

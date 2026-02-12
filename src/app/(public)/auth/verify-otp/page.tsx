import { Container, Flex } from "@radix-ui/themes";
import VerifyOTPForm from "@/components/verify-otp/VerifyOTPForm";
import { Suspense } from 'react';

export default function VerifyOTPPage() {
    return (
        <Container size="1" className="h-[calc(100vh-200px)]">
            <Flex align="center" justify="center" className="h-full">
                <Suspense fallback={<div>Loading...</div>}>
                    <VerifyOTPForm />
                </Suspense>
            </Flex>
        </Container>
    );
}

import { SignupForm } from '@/components/signup/SignupForm';
import { Flex } from '@radix-ui/themes';

export default function SignupPage() {
  return (
    <Flex justify="center" align="center" className="min-h-screen p-4">
      <SignupForm />
    </Flex>
  );
}

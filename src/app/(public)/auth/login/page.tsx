import { Flex } from '@radix-ui/themes';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <Flex justify="center" align="center" className="min-h-screen  p-4">
      <LoginForm />
    </Flex>
  );
}

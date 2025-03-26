'use client';
import { Box, Button, Container, Flex, TextField } from '@radix-ui/themes';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  password: string;
}

export default function LoginForm({
  handleSubmit,
  setEmail,
  setPassword,
  email,
  password,
}: LoginFormProps) {
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/auth/signup'); // Change this path if your signup page is different
  };
  return (
    <form onSubmit={handleSubmit}>
      <Box
        maxWidth="200px"
        height={'60vh'}
        style={{ border: '1px  solid white', borderRadius: '5px' }}
      >
        <Container style={{ margin: '15px' }}>
          <Flex direction="column" gap="7" align={'center'}>
            <TextField.Root
              size="3"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <TextField.Root
              type="password"
              size="3"
              id="current-password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-pasword"
            />
            <Flex direction={'column'} gap={'3'}>
              <Button type="submit" size="3">
                Login
              </Button>
              <Button
                variant="surface"
                onClick={handleSignUp}
                size="3"
                color="blue"
              >
                Sign Up
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </form>
  );
}

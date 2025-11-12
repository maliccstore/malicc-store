'use client';

import {
  Box,
  Container,
  Flex,
  Text,
  Heading,
  Button,
  Card,
} from '@radix-ui/themes';
import { useHealth } from '@/features/health/hooks/useHealth';

export default function HealthPage() {
  const {
    status,
    loading,
    error,
    lastChecked,
    checkServerHealth,
    ping,
    clearError,
  } = useHealth();

  const handleRefresh = () => {
    clearError();
    checkServerHealth();
  };

  const handlePing = () => {
    ping();
  };

  return (
    <Flex direction="column" gap="4" className="min-h-screen  py-8">
      <Container size="4">
        <Heading size="8" weight="bold">
          <Text>Server Health Status</Text>
        </Heading>

        <Card className="p-6 mb-6">
          <Flex justify="between" align="center" mb="4">
            <Heading size="6" weight="bold">
              Health Check
            </Heading>
            <Flex gap="3">
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="solid"
              >
                {loading ? 'Checking...' : 'Refresh'}
              </Button>
              <Button onClick={handlePing} variant="outline">
                Ping
              </Button>
            </Flex>
          </Flex>

          {lastChecked && (
            <Text size="2" mb="4">
              Last checked: {new Date(lastChecked).toLocaleString()}
            </Text>
          )}

          {error && (
            <Card
              variant="surface"
              className="bg-red-50 border-red-200 p-4 mb-4"
            >
              <Flex gap="3">
                <Text color="red">⚠️</Text>
                <Box>
                  <Heading size="3" weight="medium" color="red">
                    Error
                  </Heading>
                  <Text size="2" color="red" mt="1">
                    {error}
                  </Text>
                </Box>
              </Flex>
            </Card>
          )}

          {status && (
            <Flex direction="column" gap="4" className="md:grid md:grid-cols-2">
              <Card
                variant="surface"
                className="bg-green-50 border-green-200 p-4"
              >
                <Heading size="3" weight="medium" color="green">
                  Status
                </Heading>
                <Text size="8" weight="bold" color="green" mt="1">
                  {status.status}
                </Text>
              </Card>

              <Card
                variant="surface"
                className="bg-blue-50 border-blue-200 p-4"
              >
                <Heading size="3" weight="medium" color="blue">
                  Uptime
                </Heading>
                <Text size="6" color="blue" mt="1">
                  {Math.floor(status.uptime)} seconds
                </Text>
              </Card>

              <Card
                variant="surface"
                className="bg-gray-50 border-gray-200 p-4 md:col-span-2"
              >
                <Heading size="3" weight="medium" color="green">
                  Message
                </Heading>
                <Text mt="1" color="green">
                  {status.message}
                </Text>
              </Card>

              <Card
                variant="surface"
                className="bg-yellow-50 border-yellow-200 p-4"
              >
                <Heading size="3" weight="medium" color="yellow">
                  Timestamp
                </Heading>
                <Text size="2" color="yellow" mt="1">
                  {new Date(status.timestamp).toLocaleString()}
                </Text>
              </Card>

              <Card
                variant="surface"
                className="bg-yellow-50 border-yellow-200 p-4"
              >
                <Heading size="3" weight="medium" color="yellow">
                  Ping
                </Heading>
                <Text size="2" color="yellow" mt="1">
                  {lastChecked || 'No ping response'}
                </Text>
              </Card>
            </Flex>
          )}

          {!status && !error && !loading && (
            <Flex justify="center" py="8">
              <Text color="gray">
                No health data available. Click refresh to check.
              </Text>
            </Flex>
          )}
        </Card>

        <Card className="p-6">
          <Heading size="5" weight="bold" mb="4">
            API Information
          </Heading>
          <Flex direction="column" gap="4" className="md:grid md:grid-cols-2">
            <Box>
              <Text weight="medium">Endpoint:</Text>
              <Text color="gray" size="2">
                /graphql
              </Text>
            </Box>
            <Box>
              <Text weight="medium">Query:</Text>
              <Box className="bg-gray-100 p-1 rounded mt-1">
                <Text size="1" className="font-mono">
                  query HealthCheck &#123; healthCheck &#123; status timestamp
                  uptime message database &#125; &#125;
                </Text>
              </Box>
            </Box>
          </Flex>
        </Card>
      </Container>
    </Flex>
  );
}

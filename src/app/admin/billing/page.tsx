import { Flex, Container, Heading, Text, Box, Card, Button } from "@radix-ui/themes";
import {
  ActivityLogIcon,
  ArrowRightIcon,
  ArchiveIcon,
  ChatBubbleIcon,
  LightningBoltIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

const highlights = [
  {
    icon: <ArchiveIcon width={20} height={20} />,
    label: "Storage",
    description: "Track total upload storage consumed across all product and campaign assets.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: <ChatBubbleIcon width={20} height={20} />,
    label: "WhatsApp",
    description: "Count of successfully delivered WhatsApp marketing template messages.",
    color: "text-green-600 bg-green-50",
  },
  {
    icon: <ActivityLogIcon width={20} height={20} />,
    label: "Orders",
    description: "Total orders that transitioned to paid status in the current billing period.",
    color: "text-orange-600 bg-orange-50",
  },
  {
    icon: <LightningBoltIcon width={20} height={20} />,
    label: "Bandwidth",
    description: "Estimated outbound HTTP traffic served by your store's API.",
    color: "text-violet-600 bg-violet-50",
  },
];

export default function BillingPage() {
  return (
    <Container size="2" p="4">
      <Flex direction="column" gap="6">
        {/* Hero */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-8 text-white shadow-xl">
          <Flex direction="column" gap="3">
            <Text
              size="1"
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                opacity: 0.75,
              }}
            >
              Malicc Cloud
            </Text>
            <Heading size="8" style={{ color: "white" }}>
              Billing & Usage
            </Heading>
            <Text size="3" style={{ opacity: 0.85, maxWidth: 480 }}>
              Monitor your store's resource consumption. Usage is tracked
              automatically
            </Text>
            <Box mt="4">
              <Link href="/admin/billing/usage">
                <Button
                  id="billing-view-usage-btn"
                  size="3"
                  variant="solid"
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    backdropFilter: "blur(8px)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  View Usage Details <ArrowRightIcon />
                </Button>
              </Link>
            </Box>
          </Flex>
        </div>

        {/* What's tracked — Forced single column */}
        <Box>
          <Heading size="4" mb="4">
            What&apos;s Tracked
          </Heading>
          <div className="grid grid-cols-1 gap-4">
            {highlights.map((item) => (
              <Card key={item.label} size="3" id={`billing-highlight-${item.label.toLowerCase()}`}>
                <Flex gap="3" align="start">
                  <div className={`p-2 rounded-xl ${item.color}`}>
                    {item.icon}
                  </div>
                  <Flex direction="column" gap="1">
                    <Text size="2" weight="bold">
                      {item.label}
                    </Text>
                    <Text size="2" color="gray">
                      {item.description}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </div>
        </Box>

        {/* CTA */}
        <Card size="3" variant="surface" id="billing-cta-card">
          <Flex align="center" justify="between" wrap="wrap" gap="3">
            <Flex direction="column" gap="1">
              <Text size="3" weight="bold">
                Ready to review this month?
              </Text>
              <Text size="2" color="gray">
                Open the usage dashboard to see storage, bandwidth, and messaging consumption.
              </Text>
            </Flex>
            <Link href="/admin/billing/usage">
              <Button id="billing-open-dashboard-btn" variant="soft">
                Open Dashboard <ArrowRightIcon />
              </Button>
            </Link>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
}

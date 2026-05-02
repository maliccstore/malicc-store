"use client";

import React from "react";
import { Flex, Text, Card, Box, Badge } from "@radix-ui/themes";
import { FunnelStep } from "@/types/analytics";
import { ArrowDownIcon } from "@radix-ui/react-icons";

interface AnalyticsFunnelProps {
  data: FunnelStep[];
}

const STEP_LABELS: Record<string, string> = {
  PRODUCT_VIEW: "Discovery (Views)",
  ADD_TO_CART: "Intent (Add to Cart)",
  CHECKOUT_STARTED: "Commitment (Checkout)",
  PAYMENT_SUCCESS: "Conversion (Purchased)",
};

const STEP_COLORS: Record<string, string> = {
  PRODUCT_VIEW: "blue",
  ADD_TO_CART: "indigo",
  CHECKOUT_STARTED: "violet",
  PAYMENT_SUCCESS: "green",
};

export default function AnalyticsFunnel({ data }: AnalyticsFunnelProps) {
  // Ensure we have data for all steps even if backend misses some
  const steps = ["PRODUCT_VIEW", "ADD_TO_CART", "CHECKOUT_STARTED", "PAYMENT_SUCCESS"];
  const maxCount = data.find((d) => d.step === "PRODUCT_VIEW")?.count || 1;

  return (
    <Card size="3" className="w-full max-w-2xl mx-auto">
      <Flex direction="column" gap="4">
        <Box>
          <Text size="5" weight="bold">Store conversion journey</Text>
          <Text size="2" color="gray" className="block">Tracking unique sessions across key lifecycle stages</Text>
        </Box>

        <Flex direction="column" gap="0">
          {steps.map((stepName, index) => {
            const stepData = data.find((d) => d.step === stepName) || {
              step: stepName,
              count: 0,
              dropOff: 0,
              conversionRate: 0,
            };

            const percentage = (stepData.count / maxCount) * 100;
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={stepName}>
                {/* Step Bar */}
                <Box className="relative py-4 px-6 bg-gray-50 rounded-lg border border-gray-100 mb-2 overflow-hidden">
                  {/* Progress background for visualization */}
                  <div 
                    className="absolute inset-y-0 left-0 opacity-10" 
                    style={{ 
                      width: `${percentage}%`, 
                      backgroundColor: `var(--${STEP_COLORS[stepName]}-9)`,
                    }} 
                  />
                  
                  <Flex justify="between" align="center" className="relative z-10">
                    <Flex direction="column">
                      <Text size="1" weight="bold" color="gray" style={{ textTransform: 'uppercase' }}>
                        Stage {index + 1}
                      </Text>
                      <Text size="4" weight="bold">
                        {STEP_LABELS[stepName]}
                      </Text>
                    </Flex>
                    
                    <Flex direction="column" align="end">
                      <Text size="6" weight="bold">
                        {stepData.count.toLocaleString()}
                      </Text>
                      {index > 0 && (
                        <Text size="1" color="gray">
                          {stepData.conversionRate}% of views
                        </Text>
                      )}
                    </Flex>
                  </Flex>
                </Box>

                {/* Drop-off Indicator */}
                {!isLast && (
                  <Flex align="center" justify="center" p="2">
                    <Flex direction="column" align="center" gap="1">
                      <ArrowDownIcon color="gray" />
                      <Badge color="red" variant="soft" size="1">
                        -{stepData.dropOff.toLocaleString()} drop-off
                      </Badge>
                    </Flex>
                  </Flex>
                )}
              </React.Fragment>
            );
          })}
        </Flex>

        <Box pt="4" className="border-t border-gray-100">
          <Flex justify="between">
            <Text size="2" color="gray">Overall Conversion Rate</Text>
            <Badge color="green" size="2" variant="solid">
              {(data.find(d => d.step === "PAYMENT_SUCCESS")?.conversionRate || 0)}%
            </Badge>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
}

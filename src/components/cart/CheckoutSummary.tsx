import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { Box, Flex, Heading, Text, TextField, Button, Separator } from "@radix-ui/themes";
import { useState } from "react";

const CheckoutSummary = () => {
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // TODO: integrate GraphQL validateCoupon mutation later
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setErrorMessage("Please enter a coupon code");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // TODO: integrate GraphQL validateCoupon mutation later
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccessMessage("Coupon applied successfully!");
    } catch {
      setErrorMessage("Invalid coupon code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="rounded-lg shadow p-6" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <Heading as="h2" size="3">
        Order Summary
      </Heading>

      {/* Coupon Input */}
      <Flex direction="column" gap="2">
        <Flex gap="2">
          <TextField.Root
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            style={{ flex: 1 }}
          />

          <Button
            onClick={handleApplyCoupon}
            disabled={loading}
            color="gray"
            highContrast
          >
            {loading ? "Applying..." : "Apply"}
          </Button>
        </Flex>

        {successMessage && (
          <Text size="2" color="green">
            {successMessage}
          </Text>
        )}

        {errorMessage && (
          <Text size="2" color="red">
            {errorMessage}
          </Text>
        )}
      </Flex>

      {/* Order Details */}
      <Flex direction="column" gap="3" pt="2">
        <Flex justify="between">
          <Text>Items ({totalQuantity})</Text>
          <Text>${totalAmount.toFixed(2)}</Text>
        </Flex>

        <Flex justify="between">
          <Text>Shipping</Text>
          <Text color="green">Free</Text>
        </Flex>

        <Separator size="4" />

        <Flex justify="between">
          <Text weight="medium">Total</Text>
          <Text weight="medium">${totalAmount.toFixed(2)}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CheckoutSummary;
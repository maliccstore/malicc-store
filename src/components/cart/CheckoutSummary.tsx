import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  Box,
  Flex,
  Heading,
  Text,
  TextField,
  Button,
  Separator,
  Callout,
} from "@radix-ui/themes";
import { InfoCircledIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  applyCouponSuccess,
  clearCoupon,
} from "../../store/slices/checkoutSlice";
import { couponService } from "../../services/coupon.service";
import { formatCurrency } from "@/utils/format";

const CheckoutSummary = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  // Cart totals live in state.cart — always accurate
  const { totalQuantity, totalAmount } = useSelector(
    (state: RootState) => state.cart
  );

  // Only coupon state lives in state.checkout
  const {
    couponCode: appliedCouponCode,
    discountAmount,
  } = useSelector((state: RootState) => state.checkout);

  const [couponCode, setCouponCode] = useState<string>(appliedCouponCode || "");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const safeTotal = totalAmount ?? 0;
  const safeDiscount = discountAmount ?? 0;
  const finalTotal = safeTotal - safeDiscount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage("Please enter a coupon code");
      return;
    }

    let isAuthError = false;

    try {
      setLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Validate coupon against the current cart subtotal
      const response = await couponService.validateCoupon(couponCode.trim(), safeTotal);

      if (response.success) {
        dispatch(
          applyCouponSuccess({
            couponCode: couponCode.trim(),
            discountAmount: response.discount ?? 0,
          })
        );
        setSuccessMessage(`Coupon applied successfully! You saved ${formatCurrency(response.discount ?? 0)}`);
      } else {
        dispatch(clearCoupon());
        setErrorMessage(response.message || "Invalid coupon code");
      }
    } catch (error: unknown) {
      dispatch(clearCoupon());
      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("unauthorized") || msg.includes("access denied")) {
          isAuthError = true;
          setErrorMessage("Please log in to apply a coupon. Redirecting...");
          if (typeof window !== "undefined") {
            sessionStorage.setItem("pendingCoupon", couponCode.trim());
          }
          setTimeout(() => {
            router.push("/auth/login");
          }, 1500);
          return;
        }
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to apply coupon");
      }
    } finally {
      if (!isAuthError) {
        setCouponCode("");
      }
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

          <Button onClick={handleApplyCoupon} disabled={loading} color="gray" highContrast>
            {loading ? "Applying..." : "Apply"}
          </Button>
        </Flex>

        {successMessage && (
          <Callout.Root color="green" size="1">
            <Callout.Icon>
              <CheckCircledIcon />
            </Callout.Icon>
            <Callout.Text>{successMessage}</Callout.Text>
          </Callout.Root>
        )}
        {errorMessage && (
          <Callout.Root color="red" size="1">
            <Callout.Icon>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text>{errorMessage}</Callout.Text>
          </Callout.Root>
        )}
      </Flex>

      {/* Order Details */}
      <Flex direction="column" gap="3" pt="2">
        <Flex justify="between">
          <Text>Subtotal ({totalQuantity} items)</Text>
          <Text>{formatCurrency(safeTotal)}</Text>
        </Flex>

        {safeDiscount > 0 && (
          <Flex justify="between">
            <Text>Discount</Text>
            <Text color="green">-{formatCurrency(safeDiscount)}</Text>
          </Flex>
        )}

        <Flex justify="between">
          <Text>Shipping</Text>
          <Text color="green">Free</Text>
        </Flex>

        <Separator size="4" />

        <Flex justify="between">
          <Text weight="medium">Total</Text>
          <Text weight="medium">{formatCurrency(finalTotal)}</Text>
        </Flex>
      </Flex>
    </Box>
  );
};

export default CheckoutSummary;
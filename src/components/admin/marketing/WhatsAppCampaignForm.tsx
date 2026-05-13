"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAdminUsers } from "@/store/admin/users/userThunks";
import { fetchAdminProducts } from "@/store/admin/product/productThunks";
import {
  sendPromotionalWhatsApp,
  sendProductAnnouncement,
} from "@/store/admin/marketing/marketingThunks";
import {
  Box,
  Flex,
  Grid,
  Text,
  Heading,
  Button,
  TextField,
  Select,
  TextArea,
  Card,
  Badge,
  Spinner,
  Callout,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { marketingAdminAPI } from "@/services/admin/marketing.admin";
import { CampaignFilters } from "@/features/admin/marketing/marketing.types";
import Image from "next/image";

export default function WhatsAppCampaignForm() {
  const dispatch = useAppDispatch();
  const { list: users } = useAppSelector((state) => state.adminUsers);
  const { list: products } = useAppSelector((state) => state.adminProducts);
  const { sendStatus } = useAppSelector((state) => state.adminMarketing);

  const [campaignType, setCampaignType] = useState("PROMOTIONAL");
  const [title, setTitle] = useState("");
  const [templateName, setTemplateName] = useState("hello_world");

  // Promotional Fields
  const [headline, setHeadline] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [couponCode, setCouponCode] = useState("");

  // Product Fields
  const [selectedProduct, setSelectedProduct] = useState("");

  // Filtering State
  const [customerType, setCustomerType] = useState<string>("ALL");
  const [purchasedWithinDays, setPurchasedWithinDays] = useState<string>("0");
  const [minSpent, setMinSpent] = useState<string>("0");
  const [estimatedRecipients, setEstimatedRecipients] = useState<number | null>(
    null,
  );
  const [isEstimating, setIsEstimating] = useState(false);
  const [bannerImageUrl, setBannerImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Audience Estimation Logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsEstimating(true);
      try {
        const filters: CampaignFilters = {
          customerType: customerType as CampaignFilters["customerType"],
          purchasedWithinDays:
            purchasedWithinDays !== "0"
              ? parseInt(purchasedWithinDays)
              : undefined,
          minSpent: minSpent !== "0" ? parseInt(minSpent) : undefined,
        };
        const result = await marketingAdminAPI.estimateAudience(filters);
        setEstimatedRecipients(result.estimatedRecipients);
      } catch (error) {
        console.error("Estimation failed", error);
      } finally {
        setIsEstimating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customerType, purchasedWithinDays, minSpent, users]);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const response = await marketingAdminAPI.uploadCampaignBanner(file);
      if (response.success && response.data) {
        setBannerImageUrl(response.data.url);
      } else {
        alert(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filters: CampaignFilters = {
      customerType: customerType as CampaignFilters["customerType"],
      purchasedWithinDays:
        purchasedWithinDays !== "0" ? parseInt(purchasedWithinDays) : undefined,
      minSpent: minSpent !== "0" ? parseInt(minSpent) : undefined,
    };

    if (campaignType === "PROMOTIONAL") {
      dispatch(
        sendPromotionalWhatsApp({
          title,
          templateName,
          targetAll: false,
          customerIds: undefined,
          filters: filters,
          productId: selectedProduct || undefined,
          bannerImageUrl: bannerImageUrl || undefined,
          headline: headline || undefined,
          offerMessage: offerMessage || undefined,
          couponCode: couponCode || undefined,
        }),
      );
    } else {
      if (!selectedProduct) return alert("Please select a product");
      dispatch(
        sendProductAnnouncement({
          title,
          templateName,
          productId: selectedProduct,
          headline,
          targetAll: false,
          customerIds: undefined,
          filters: filters,
        }),
      );
    }
  };

  return (
    <Card className="bg-white">
      <form onSubmit={handleSubmit}>
        <Box mb="6">
          <Heading size="5">Create WhatsApp Campaign</Heading>
          <Text color="gray" size="2">
            Configure your bulk message targeting and content.
          </Text>
        </Box>

        <Grid columns={{ initial: "1", sm: "2" }} gap="4">
          <Box className="sm:col-span-2">
            <Text as="label" size="2" weight="bold" mb="1" className="block">
              Campaign Type
            </Text>
            <Select.Root value={campaignType} onValueChange={setCampaignType}>
              <Select.Trigger className="w-full" />
              <Select.Content>
                <Select.Item value="PROMOTIONAL">Promotional Offer</Select.Item>
                <Select.Item value="NEW_PRODUCT">
                  New Product Announcement
                </Select.Item>
              </Select.Content>
            </Select.Root>
          </Box>

          <Box>
            <Text as="label" size="2" weight="bold" mb="1" className="block">
              Campaign Title
            </Text>
            <TextField.Root
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Sale"
            />
          </Box>

          <Box>
            <Text as="label" size="2" weight="bold" mb="1" className="block">
              Meta Template Name
            </Text>
            <TextField.Root
              required
              value={"hello_world"} // For now, we can keep this fixed or auto-generated based on title
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="e.g. hello_world"
            />
          </Box>

          {/* Dynamic Fields */}
          {campaignType === "PROMOTIONAL" ? (
            <>
              <Box className="sm:col-span-2">
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Headline
                </Text>
                <TextField.Root
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Catchy headline here"
                />
              </Box>
              <Box className="sm:col-span-2">
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Offer Message
                </Text>
                <TextArea
                  rows={3}
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="Details of your promotion"
                />
              </Box>

              <Box className="sm:col-span-2">
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Coupon Code
                </Text>
                <TextField.Root
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. WELCOME100"
                />
              </Box>

              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Link to Product (Optional)
                </Text>
                <Select.Root
                  value={selectedProduct || "NONE"}
                  onValueChange={(val) =>
                    setSelectedProduct(val === "NONE" ? "" : val)
                  }
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="-- No Product --"
                  />
                  <Select.Content>
                    <Select.Item value="NONE">-- No Product --</Select.Item>
                    {products.map((p) => (
                      <Select.Item key={p.id} value={p.id}>
                        {p.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Banner Image
                </Text>
                <Flex gap="3" align="center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    style={{ display: "none" }}
                    id="banner-upload"
                  />
                  <label htmlFor="banner-upload">
                    <Button
                      asChild
                      variant="soft"
                      color="gray"
                      disabled={isUploading}
                    >
                      <span>
                        {isUploading ? "Uploading..." : "Select Image"}
                      </span>
                    </Button>
                  </label>
                  {bannerImageUrl && (
                    <Badge color="green">Image Selected</Badge>
                  )}
                </Flex>
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Select Product
                </Text>
                <Select.Root
                  value={selectedProduct || undefined}
                  onValueChange={setSelectedProduct}
                >
                  <Select.Trigger
                    className="w-full"
                    placeholder="-- Choose Product --"
                  />
                  <Select.Content>
                    {products.map((p) => (
                      <Select.Item key={p.id} value={p.id}>
                        {p.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Headline
                </Text>
                <TextField.Root
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Introducing our new product"
                />
              </Box>
            </>
          )}

          <Box
            className="sm:col-span-2"
            mt="4"
            pt="4"
            style={{ borderTop: "1px solid var(--gray-5)" }}
          >
            <Text as="label" size="2" weight="bold" mb="2" className="block">
              Target Audience
            </Text>

            <Grid columns={{ initial: "1", md: "3" }} gap="4" mt="4">
              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Customer Type
                </Text>
                <Select.Root
                  value={customerType}
                  onValueChange={setCustomerType}
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="ALL">All Customers</Select.Item>
                    <Select.Item value="NEW">New Customers</Select.Item>
                    <Select.Item value="REPEAT">Repeat Customers</Select.Item>
                    <Select.Item value="INACTIVE">
                      Inactive Customers
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Purchase Activity
                </Text>
                <Select.Root
                  value={purchasedWithinDays}
                  onValueChange={setPurchasedWithinDays}
                >
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="0">Any Time</Select.Item>
                    <Select.Item value="30">Last 30 Days</Select.Item>
                    <Select.Item value="60">Last 60 Days</Select.Item>
                    <Select.Item value="90">Last 90 Days</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box>
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Minimum Spend
                </Text>
                <Select.Root value={minSpent} onValueChange={setMinSpent}>
                  <Select.Trigger className="w-full" />
                  <Select.Content>
                    <Select.Item value="0">No Minimum</Select.Item>
                    <Select.Item value="500">₹500+</Select.Item>
                    <Select.Item value="1000">₹1000+</Select.Item>
                    <Select.Item value="5000">₹5000+</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Box>

              <Box className="col-span-3">
                <Card
                  variant="classic"
                  style={{ backgroundColor: "var(--gray-2)" }}
                >
                  <Flex justify="between" align="center" p="2">
                    <Flex align="center" gap="2">
                      <InfoCircledIcon color="var(--gray-9)" />
                      <Text size="2" weight="bold">
                        Estimated Audience
                      </Text>
                      {isEstimating && <Spinner size="1" />}
                    </Flex>
                    <Flex align="center" gap="2">
                      <Badge
                        color={estimatedRecipients === 0 ? "red" : "green"}
                        size="2"
                      >
                        {estimatedRecipients !== null
                          ? `${estimatedRecipients} recipients`
                          : "--"}
                      </Badge>
                    </Flex>
                  </Flex>
                </Card>

                {estimatedRecipients === 0 && !isEstimating && (
                  <Callout.Root color="red" size="1" mt="2">
                    <Callout.Icon>
                      <InfoCircledIcon />
                    </Callout.Icon>
                    <Callout.Text>
                      No customers match these filters. Try broadening your
                      criteria.
                    </Callout.Text>
                  </Callout.Root>
                )}
              </Box>

              <Box className="col-span-3">
                <Text
                  as="label"
                  size="2"
                  weight="bold"
                  mb="1"
                  className="block"
                >
                  Summary
                </Text>
                <Flex gap="2" wrap="wrap">
                  <Badge variant="soft">{customerType.replace("_", " ")}</Badge>
                  {purchasedWithinDays !== "0" && (
                    <Badge variant="soft">
                      Ordered in {purchasedWithinDays}d
                    </Badge>
                  )}
                  {minSpent !== "0" && (
                    <Badge variant="soft">Spent ₹{minSpent}+</Badge>
                  )}
                </Flex>
              </Box>
            </Grid>
          </Box>
        </Grid>

        {/* Campaign Preview Box */}
        <Box mt="6">
          <Text as="div" size="2" weight="bold" mb="2">
            Campaign Preview
          </Text>
          <Card variant="surface" className="bg-white">
            <Box p="3">
              <Box mb="3">
                {bannerImageUrl ? (
                  <Image
                    src={bannerImageUrl}
                    alt="Campaign Banner"
                    width={400}
                    height={120}
                  />
                ) : (
                  <Box
                    style={{
                      width: "100%",
                      height: "120px",
                      backgroundColor: "var(--gray-3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "4px",
                      border: "1px dashed var(--gray-6)",
                    }}
                  >
                    <Text size="1" color="gray">
                      [No Banner Image Selected]
                    </Text>
                  </Box>
                )}
              </Box>
              <Text
                size="2"
                style={{ whiteSpace: "pre-wrap", fontFamily: "sans-serif" }}
              >
                {campaignType === "PROMOTIONAL" ? (
                  <>
                    <strong>{title || "[Campaign Title]"}</strong>
                    <br />
                    <strong>{headline || "[Headline]"}</strong>
                    <br />
                    {offerMessage || "[Your offer message will appear here.]"}
                    <br />
                    <br />
                  </>
                ) : (
                  <>
                    <strong>{headline || "[New Product Headline]"}</strong>
                    <br />
                    <br />
                    Check out our new product:{" "}
                    <strong>
                      {products.find((p) => p.id === selectedProduct)?.name ||
                        "[Product Name]"}
                    </strong>
                    !<br />
                    <br />
                  </>
                )}
              </Text>
            </Box>
          </Card>
        </Box>

        <Flex justify="end" mt="5">
          <Button
            type="submit"
            disabled={sendStatus === "loading"}
            variant="solid"
            color="gray"
            highContrast
          >
            {sendStatus === "loading" ? "Sending..." : "Send Campaign"}
          </Button>
        </Flex>
      </form>
    </Card>
  );
}

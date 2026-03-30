'use client';

import * as Form from '@radix-ui/react-form';
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Text,
  TextArea,
  TextField,
} from '@radix-ui/themes';
import { ProductFormProps } from '@/features/admin/products/product.types';
import { Controller } from 'react-hook-form';
import { useRef, useState } from 'react';
import uploadService from '@/services/admin/upload.service';
import toast from 'react-hot-toast';
import { UploadIcon } from '@radix-ui/react-icons';
import Image from 'next/image';

export default function ProductForm({
  product,
  isEdit,
  categories,
  isLoadingCategories,
  control,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  handleDelete,
  imageUrls,
  onDiscard,
  setValue,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validation per file
        if (file.size > 5 * 1024 * 1024) throw new Error(`File ${file.name} is larger than 5MB`);
        if (!file.type.startsWith('image/')) throw new Error(`File ${file.name} is not an image`);

        return await uploadService.uploadProductImage(file);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setValue('imageUrls', [...(imageUrls || []), ...uploadedUrls], { shouldValidate: true, shouldDirty: true });
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
      setUploadError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <Box height="100%" width="100%" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
      <Box p="6">
        <Form.Root onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="4" maxWidth="800px" mx="auto">
            {/* Header */}
            <Flex justify="between" align="center" mb="4">
              <Box>
                <Heading size="6">{isEdit ? 'Edit Product' : 'New Product'}</Heading>
                <Text size="2" color="gray">
                  {isEdit ? `Update details for ${product?.name}` : 'Add a new product to your catalog'}
                </Text>
              </Box>
              <Flex gap="3">
                {isEdit && (
                  <Button
                    variant="soft"
                    color="red"
                    type="button"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
                <Button
                  variant="soft"
                  color="gray"
                  type="button"
                  onClick={onDiscard}
                >
                  Discard
                </Button>
                <Form.Submit asChild>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Product'}
                  </Button>
                </Form.Submit>
              </Flex>
            </Flex>

            {/* Single Column Layout */}
            <Card size="3">
              <Flex direction="column" gap="4">

                {/* Basic Info Block */}
                <Flex direction="column" gap="4">
                  <Heading size="4" mb="2">Basic Information</Heading>

                  {/* Title */}
                  <Form.Field name="title">
                    <Box>
                      <Flex align="baseline" justify="between" mb="1">
                        <Form.Label asChild>
                          <Text as="span" size="2" weight="bold">Title</Text>
                        </Form.Label>
                        {errors.title && <Text color="red" size="1">{errors.title.message}</Text>}
                      </Flex>
                      <Form.Control asChild>
                        <Controller
                          name="title"
                          control={control}
                          rules={{ required: 'Title is required' }}
                          render={({ field }) => (
                            <TextField.Root placeholder="Product Name" size="3" {...field} color={errors.title ? 'red' : undefined} />
                          )}
                        />
                      </Form.Control>
                    </Box>
                  </Form.Field>

                  {/* SKU and Category Row */}
                  <Flex gap="4">
                    <Box flexGrow="1">
                      <Form.Field name="sku">
                        <Box>
                          <Flex align="baseline" justify="between" mb="1">
                            <Form.Label asChild>
                              <Text as="span" size="2" weight="bold">SKU</Text>
                            </Form.Label>
                            {errors.sku && <Text color="red" size="1">{errors.sku.message}</Text>}
                          </Flex>
                          <Form.Control asChild>
                            <Controller
                              name="sku"
                              control={control}
                              rules={{ required: 'SKU is required' }}
                              render={({ field }) => (
                                <TextField.Root placeholder="SKU-123" size="2" {...field} color={errors.sku ? 'red' : undefined} />
                              )}
                            />
                          </Form.Control>
                        </Box>
                      </Form.Field>
                    </Box>

                    <Box flexGrow="1">
                      <Form.Field name="categoryId">
                        <Box>
                          <Form.Label asChild>
                            <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Category</Text>
                          </Form.Label>
                          <Form.Control asChild>
                            <Controller
                              name="categoryId"
                              control={control}
                              rules={{ required: 'Category is required' }}
                              render={({ field }) => (
                                isLoadingCategories ? (
                                  <Select.Root disabled>
                                    <Select.Trigger placeholder="Loading categories..." style={{ width: '100%' }} />
                                  </Select.Root>
                                ) : (
                                  <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isLoadingCategories}
                                  >
                                    <Select.Trigger placeholder="Select category" style={{ width: '100%' }} />
                                    <Select.Content>
                                      {categories.map((category) => (
                                        <Select.Item key={category.id} value={category.id}>
                                          {category.name}
                                        </Select.Item>
                                      ))}
                                    </Select.Content>
                                  </Select.Root>
                                )
                              )}
                            />
                          </Form.Control>
                          {errors.categoryId && <Text color="red" size="1" mt="1">{errors.categoryId.message}</Text>}
                        </Box>
                      </Form.Field>
                    </Box>
                  </Flex>

                  {/* Description */}
                  <Form.Field name="description">
                    <Box>
                      <Form.Label asChild>
                        <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Description</Text>
                      </Form.Label>
                      <Form.Control asChild>
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <TextArea placeholder="Product details..." size="3" rows={5} {...field} />
                          )}
                        />
                      </Form.Control>
                    </Box>
                  </Form.Field>
                </Flex>

                <Box mt="4">
                  <Heading size="4" mb="2">Media</Heading>
                  <Box>
                    <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Product Image</Text>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="2"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <UploadIcon />
                      {isUploading ? 'Uploading...' : 'Upload Product Images'}
                    </Button>
                    {uploadError && (
                      <Text color="red" size="1" mt="1" style={{ display: 'block' }}>
                        {uploadError}
                      </Text>
                    )}
                  </Box>
                  {imageUrls && imageUrls.length > 0 && (
                    <Box
                      mt="4"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: "12px",
                      }}
                    >
                      {imageUrls.map((url, index) => (
                        <Box
                          key={index}
                          style={{
                            border: "1px solid var(--gray-5)",
                            borderRadius: "8px",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            width={100}
                            height={100}
                            src={url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100px",
                              objectFit: "contain",
                              background: "var(--gray-2)",
                            }}
                          />

                          <Box
                            p="2"
                            style={{ borderTop: "1px solid var(--gray-5)" }}
                          >
                            <Flex justify="between" align="center">
                              <Text
                                size="1"
                                color="gray"
                                truncate
                                style={{ maxWidth: "120px" }}
                              >
                                {url}
                              </Text>

                              <Button
                                size="1"
                                color="red"
                                variant="soft"
                                type="button"
                                onClick={() =>
                                  setValue(
                                    "imageUrls",
                                    imageUrls.filter((_, i) => i !== index),
                                    { shouldValidate: true, shouldDirty: true }
                                  )
                                }
                              >
                                Remove
                              </Button>
                            </Flex>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>

                {/* Pricing & Status Block */}
                <Box mt="4">
                  <Heading size="4" mb="2">Pricing & Status</Heading>
                  <Flex gap="4">
                    <Box flexGrow="1">
                      <Form.Field name="price">
                        <Box>
                          <Form.Label asChild>
                            <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Price (₹)</Text>
                          </Form.Label>
                          <Form.Control asChild>
                            <Controller
                              name="price"
                              control={control}
                              rules={{ min: { value: 0, message: 'Price cannot be negative' } }}
                              render={({ field }) => (
                                <TextField.Root type="number" placeholder="0.00" size="2" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                              )}
                            />
                          </Form.Control>
                        </Box>
                      </Form.Field>
                    </Box>
                    <Box flexGrow="1">
                      <Form.Field name="status">
                        <Box>
                          <Form.Label asChild>
                            <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Status</Text>
                          </Form.Label>
                          <Form.Control asChild>
                            <Controller
                              name="status"
                              control={control}
                              render={({ field }) => (
                                <Select.Root value={field.value} onValueChange={field.onChange}>
                                  <Select.Trigger style={{ width: '100%' }} />
                                  <Select.Content>
                                    <Select.Item value="INACTIVE">Draft / Inactive</Select.Item>
                                    <Select.Item value="ACTIVE">Active</Select.Item>
                                  </Select.Content>
                                </Select.Root>
                              )}
                            />
                          </Form.Control>
                        </Box>
                      </Form.Field>
                    </Box>
                  </Flex>
                </Box>

                {/* Inventory Block */}
                <Box mt="4">
                  <Heading size="4" mb="2">Inventory</Heading>
                  <Flex gap="4">
                    <Box flexGrow="1">
                      <Form.Field name="inventoryQuantity">
                        <Box>
                          <Form.Label asChild>
                            <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Total Quantity</Text>
                          </Form.Label>
                          <Form.Control asChild>
                            <Controller
                              name="inventoryQuantity"
                              control={control}
                              rules={{ min: { value: 0, message: 'Quantity cannot be negative' } }}
                              render={({ field }) => (
                                <TextField.Root type="number" placeholder="0" size="2" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                              )}
                            />
                          </Form.Control>
                        </Box>
                      </Form.Field>
                    </Box>
                    <Box flexGrow="1">
                      <Form.Field name="inventoryAvailable">
                        <Box>
                          <Form.Label asChild>
                            <Text as="span" size="2" weight="bold" mb="1" style={{ display: 'block' }}>Available Quantity</Text>
                          </Form.Label>
                          <Form.Control asChild>
                            <Controller
                              name="inventoryAvailable"
                              control={control}
                              rules={{ min: { value: 0, message: 'Available cannot be negative' } }}
                              render={({ field }) => (
                                <TextField.Root type="number" placeholder="0" size="2" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                              )}
                            />
                          </Form.Control>
                        </Box>
                      </Form.Field>
                    </Box>
                  </Flex>
                </Box>

              </Flex>
            </Card>
          </Flex>
        </Form.Root>
      </Box>
    </Box>
  );
}

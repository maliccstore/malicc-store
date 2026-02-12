'use client';

import { useForm, Controller } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import {
    Button,
    TextField,
    TextArea,
    Flex,
    Text,
    Card,
    Switch,
    Select,
    Box
} from '@radix-ui/themes';
import { CategoryFormValues } from '@/features/admin/categories/category.types';
import { useEffect, useState } from 'react';
import { adminCategoryAPI } from '@/services/admin/category.admin';
import { AdminCategory } from '@/features/admin/categories/category.types';
import { CategoryFormProps } from '@/features/admin/categories/category.types';


export default function CategoryForm({
    initialValues,
    onSubmit,
    isSubmitting,
    isEditMode = false
}: CategoryFormProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        defaultValues: initialValues || {
            name: '',
            slug: '',
            description: '',
            isActive: true,
            parentId: undefined,
        },
    });

    const [categories, setCategories] = useState<AdminCategory[]>([]);
    const nameValue = watch('name');

    // Auto-generate slug from name if creating new
    useEffect(() => {
        if (!isEditMode && nameValue) {
            const slug = nameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setValue('slug', slug);
        }
    }, [nameValue, isEditMode, setValue]);

    // Fetch parent categories options
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await adminCategoryAPI.getAll();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <Form.Root onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="5">
                <Card>
                    <Flex direction="column" gap="4">
                        <Text size="5" weight="bold">
                            Basic Information
                        </Text>
                        {/* name */}
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="1" className="block">
                                Name
                            </Text>
                            <TextField.Root
                                placeholder="e.g. Electronics"
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && (
                                <Text color="red" size="1">
                                    {errors.name.message}
                                </Text>
                            )}
                        </Box>
                        {/* slug */}
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="1" className="block">
                                Slug
                            </Text>
                            <TextField.Root
                                placeholder="e.g. electronics"
                                {...register('slug', { required: 'Slug is required' })}
                            />
                            {errors.slug && (
                                <Text color="red" size="1">
                                    {errors.slug.message}
                                </Text>
                            )}
                        </Box>
                        {/* description */}
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="1" className="block">
                                Description
                            </Text>
                            <TextArea
                                placeholder="Category description..."
                                {...register('description')}
                            />
                        </Box>
                        {/* parent category */}
                        <Box>
                            <Text as="label" size="2" weight="bold" mb="1" className="block">
                                Parent Category (Optional)
                            </Text>
                            <Controller
                                name="parentId"
                                control={control}
                                render={({ field }) => (
                                    <Select.Root
                                        value={field.value || "none"}
                                        onValueChange={(val) => field.onChange(val === "none" ? null : val)}
                                    >
                                        <Select.Trigger placeholder="Select parent category..." />
                                        <Select.Content>
                                            <Select.Item value="none">None (Root Category)</Select.Item>
                                            {categories.map((cat) => (
                                                <Select.Item key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </Select.Item>
                                            ))}
                                        </Select.Content>
                                    </Select.Root>
                                )}
                            />
                        </Box>
                        {/* active status */}
                        <Flex align="center" gap="2">
                            <Text as="label" size="2" weight="bold">
                                Active Status
                            </Text>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </Flex>
                    </Flex>
                </Card>
                {/* submit button */}
                <Flex justify="end" gap="3">
                    <Button disabled={isSubmitting} type="submit" size="3">
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
                    </Button>
                </Flex>
            </Flex>
        </Form.Root>
    );
}

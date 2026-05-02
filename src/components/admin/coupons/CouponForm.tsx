'use client';

import { useForm, Controller } from 'react-hook-form';
import * as Form from '@radix-ui/react-form';
import {
    Button,
    TextField,
    Flex,
    Text,
    Card,
    Switch,
    Select,
    Box
} from '@radix-ui/themes';
import { CouponFormValues, CouponFormProps, DiscountType } from '@/features/admin/coupons/coupon.types';
import { useEffect } from 'react';

export default function CouponForm({
    initialValues,
    onSubmit,
    isSubmitting,
    isEditMode = false
}: CouponFormProps) {
    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CouponFormValues>({
        defaultValues: initialValues || {
            code: '',
            discountType: DiscountType.PERCENTAGE,
            discountValue: 0,
            validFrom: new Date().toISOString().slice(0, 16),
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
            isActive: true,
        },
    });

    const codeValue = watch('code');

    useEffect(() => {
        if (!isEditMode && codeValue) {
            setValue('code', codeValue.toUpperCase().replace(/\s+/g, ''));
        }
    }, [codeValue, isEditMode, setValue]);

    return (
        <Form.Root onSubmit={handleSubmit(onSubmit)}>
            <Flex direction="column" gap="5">
                <Card>
                    <Flex direction="column" gap="4">
                        <Text size="5" weight="bold">
                            Coupon Details
                        </Text>

                        <Flex gap="4" wrap="wrap">
                            {/* Code */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Coupon Code
                                </Text>
                                <TextField.Root
                                    placeholder="e.g. SUMMER50"
                                    {...register('code', { required: 'Code is required' })}
                                    disabled={isEditMode}
                                />
                                {errors.code && (
                                    <Text color="red" size="1">
                                        {errors.code.message}
                                    </Text>
                                )}
                            </Box>

                            {/* Discount Type */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Discount Type
                                </Text>
                                <Controller
                                    name="discountType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select.Root
                                            value={field.value}
                                            onValueChange={(val) => field.onChange(val as DiscountType)}
                                            disabled={isEditMode}
                                        >
                                            <Select.Trigger style={{ width: '100%' }} />
                                            <Select.Content>
                                                <Select.Item value={DiscountType.PERCENTAGE}>Percentage</Select.Item>
                                                <Select.Item value={DiscountType.FIXED}>Fixed Amount</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
                                    )}
                                />
                            </Box>
                        </Flex>

                        <Flex gap="4" wrap="wrap">
                            {/* Discount Value */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Discount Value
                                </Text>
                                <TextField.Root
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 10"
                                    {...register('discountValue', {
                                        required: 'Discount value is required',
                                        valueAsNumber: true
                                    })}
                                />
                                {errors.discountValue && (
                                    <Text color="red" size="1">
                                        {errors.discountValue.message}
                                    </Text>
                                )}
                            </Box>

                            {/* Max Discount */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Max Discount (Optional)
                                </Text>
                                <TextField.Root
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 100"
                                    {...register('maxDiscount', {
                                        setValueAs: v => v === '' ? null : parseFloat(v)
                                    })}
                                />
                            </Box>
                        </Flex>

                        <Flex gap="4" wrap="wrap">
                            {/* Min Order Value */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Minimum Order Value (Optional)
                                </Text>
                                <TextField.Root
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g. 500"
                                    {...register('minOrderValue', {
                                        setValueAs: v => v === '' ? null : parseFloat(v)
                                    })}
                                />
                            </Box>

                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                {/* Empty space for layout balance */}
                            </Box>
                        </Flex>

                        <Flex gap="4" wrap="wrap">
                            {/* Usage Limit */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Total Usage Limit (Optional)
                                </Text>
                                <TextField.Root
                                    type="number"
                                    placeholder="e.g. 1000"
                                    {...register('usageLimit', {
                                        setValueAs: v => v === '' ? null : parseInt(v, 10)
                                    })}
                                />
                            </Box>

                            {/* Per User Limit */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Per User Limit (Optional)
                                </Text>
                                <TextField.Root
                                    type="number"
                                    placeholder="e.g. 1"
                                    {...register('perUserLimit', {
                                        setValueAs: v => v === '' ? null : parseInt(v, 10)
                                    })}
                                />
                            </Box>
                        </Flex>

                        <Flex gap="4" wrap="wrap">
                            {/* Valid From */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Valid From
                                </Text>
                                <TextField.Root
                                    type="datetime-local"
                                    {...register('validFrom', { required: 'Start date is required' })}
                                />
                            </Box>

                            {/* Valid Until */}
                            <Box style={{ flex: '1 1 calc(50% - 16px)' }}>
                                <Text as="label" size="2" weight="bold" mb="1" className="block">
                                    Valid Until
                                </Text>
                                <TextField.Root
                                    type="datetime-local"
                                    {...register('validUntil', { required: 'End date is required' })}
                                />
                            </Box>
                        </Flex>

                        {/* Active Status */}
                        {isEditMode && (
                            <Flex align="center" gap="2" mt="2">
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
                        )}
                    </Flex>
                </Card>

                <Flex justify="end" gap="3">
                    <Button disabled={isSubmitting} type="submit" size="3">
                        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Coupon' : 'Create Coupon'}
                    </Button>
                </Flex>
            </Flex>
        </Form.Root>
    );
}

"use client";

import { Button, Card, Flex, Heading, Text, TextField, Grid, IconButton, Box, Separator, Checkbox } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@radix-ui/react-icons";
import { addressAPI } from "../../../services/address.service";
import { Address, CreateAddressInput, AddressFormData } from "../../../types/address";

export default function AddressPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<AddressFormData>();

    // Fetch addresses from API
    const fetchAddresses = async () => {
        try {
            setLoading(true);
            const data = await addressAPI.getUserAddresses();
            setAddresses(data);
        } catch {
            toast.error("Failed to fetch addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Add new address
    const onAdd = () => {
        setEditingId(null);
        reset({
            fullName: "",
            phoneNumber: "",
            addressLine1: "",
            addressLine2: "",
            city: "",
            state: "",
            postalCode: "",
            country: "IN",
            isDefault: false
        });
        setIsEditing(true);
    };
    // Edit existing address
    const onEdit = (address: Address) => {
        setEditingId(address.id);
        setValue("fullName", address.fullName);
        setValue("phoneNumber", address.phoneNumber);
        setValue("addressLine1", address.addressLine1);
        setValue("addressLine2", address.addressLine2);
        setValue("city", address.city);
        setValue("state", address.state);
        setValue("postalCode", address.postalCode);
        setValue("country", address.country);
        setValue("isDefault", address.isDefault);
        setIsEditing(true);
    };

    // Set default address
    const onSetDefault = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await addressAPI.setDefaultAddress(id);

            // Update local state: Set selected to true, others to false
            setAddresses(prev => prev.map(addr => ({
                ...addr,
                isDefault: addr.id === id
            })));

            toast.success("Default address updated");
        } catch {
            toast.error("Failed to set default address");
        }
    };

    // Delete address
    const onDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await addressAPI.deleteAddress(id);
            setAddresses(prev => prev.filter(addr => addr.id !== id));
            toast.success("Address deleted successfully");
        } catch {
            toast.error("Failed to delete address");
        }
    };

    // Submit form data
    const onSubmit = async (data: AddressFormData) => {
        try {
            if (editingId) {
                await addressAPI.updateAddress(editingId, data);
                setAddresses(prev => prev.map(addr =>
                    addr.id === editingId ? { ...addr, ...data } : addr
                ));
                toast.success("Address updated successfully");
            } else {
                // CreateAddressInput expects fullName, phoneNumber etc.
                const input: CreateAddressInput = {
                    fullName: data.fullName,
                    phoneNumber: data.phoneNumber,
                    addressLine1: data.addressLine1,
                    addressLine2: data.addressLine2,
                    city: data.city,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country,
                    isDefault: data.isDefault
                };
                const newAddress = await addressAPI.createAddress(input);
                setAddresses(prev => [newAddress, ...prev]);
                toast.success("Address added successfully");
            }
            setIsEditing(false);
            setEditingId(null);
            fetchAddresses(); // Refresh to ensure default sorting etc.
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to save address");
        }
    };

    // Cancel form
    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
    };

    // Loading addresses
    if (loading && !isEditing) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl flex justify-center">
                <Text>Loading addresses...</Text>
            </div>
        )
    }

    // Editing form
    if (isEditing) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <Heading size="6" mb="6" className="font-light">
                    {editingId ? "EDIT ADDRESS" : "ADD NEW ADDRESS"}
                </Heading>
                <Card size="4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Flex direction="column" gap="4">
                            <Grid columns="2" gap="4">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">Full Name</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="Full Name"
                                        {...register("fullName", { required: "Name is required" })}
                                    />
                                    {errors.fullName && <Text color="red" size="2">{errors.fullName.message}</Text>}
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">Phone Number</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="Phone Number"
                                        {...register("phoneNumber", { required: "Phone Number is required" })}
                                    />
                                    {errors.phoneNumber && <Text color="red" size="2">{errors.phoneNumber.message}</Text>}
                                </label>
                            </Grid>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">Address Line 1</Text>
                                <TextField.Root
                                    size="3"
                                    placeholder="House No, Street, Area"
                                    {...register("addressLine1", { required: "Address is required" })}
                                />
                                {errors.addressLine1 && <Text color="red" size="2">{errors.addressLine1.message}</Text>}
                            </label>

                            <label>
                                <Text as="div" size="2" mb="1" weight="bold">Address Line 2 (Optional)</Text>
                                <TextField.Root
                                    size="3"
                                    placeholder="Landmark, etc."
                                    {...register("addressLine2")}
                                />
                            </label>


                            <Grid columns="2" gap="4">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">City</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="City"
                                        {...register("city", { required: "City is required" })}
                                    />
                                    {errors.city && <Text color="red" size="2">{errors.city.message}</Text>}
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">State</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="State"
                                        {...register("state", { required: "State is required" })}
                                    />
                                    {errors.state && <Text color="red" size="2">{errors.state.message}</Text>}
                                </label>
                            </Grid>

                            <Grid columns="2" gap="4">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">Pincode</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="Pincode"
                                        {...register("postalCode", { required: "Zip code is required" })}
                                    />
                                    {errors.postalCode && <Text color="red" size="2">{errors.postalCode.message}</Text>}
                                </label>
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">Country</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="Country"
                                        {...register("country", { required: "Country is required" })}
                                    />
                                    {errors.country && <Text color="red" size="2">{errors.country.message}</Text>}
                                </label>
                            </Grid>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <Checkbox
                                    {...register("isDefault")}
                                    defaultChecked={false}
                                />
                                <Text size="2">Set as default address</Text>
                            </label>

                            <Flex gap="3" justify="end" mt="4">
                                <Button variant="soft" color="gray" type="button" onClick={handleCancel}>
                                    CANCEL
                                </Button>
                                <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
                                    SAVE ADDRESS
                                </Button>
                            </Flex>
                        </Flex>
                    </form>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Flex justify="between" align="center" mb="6">
                <Heading size="4" weight="bold">ADDRESS</Heading>
                <Text
                    className="cursor-pointer font-bold text-xs hover:opacity-75"
                    onClick={onAdd}
                >
                    ADD
                </Text>
            </Flex>

            <Heading size="3" mb="4" weight="bold" align="center">Manage Addresses</Heading>

            <Flex direction="column" gap="4">
                {addresses.map((address) => (
                    <Box key={address.id} className="relative p-0 group">
                        <Flex justify="between" align="start">
                            <Box>
                                <Flex align="center" gap="2" mb="1">
                                    <Text as="div" weight="medium" size="3">{address.fullName}</Text>
                                    {address.isDefault ? (
                                        <Text size="1" className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">DEFAULT</Text>
                                    ) : (
                                        <Text
                                            size="1"
                                            className="text-gray-500 hover:text-black cursor-pointer px-2 py-0.5 border border-gray-300 rounded text-[10px] font-bold transition-colors"
                                            onClick={(e) => onSetDefault(address.id!, e)}
                                        >
                                            SET AS DEFAULT
                                        </Text>
                                    )}
                                </Flex>
                                <Text as="div" size="2" color="gray" className="mb-1">
                                    {address.addressLine1} {address.addressLine2 ? `, ${address.addressLine2}` : ""}, {address.city}, {address.state} - {address.postalCode}
                                </Text>
                                <Text as="div" size="2" color="gray" mb="2">
                                    Phone Number - {address.phoneNumber}
                                </Text>
                                <Text
                                    className="cursor-pointer font-bold text-xs mt-2 hover:opacity-75"
                                    onClick={() => onEdit(address)}
                                >
                                    EDIT
                                </Text>
                            </Box>
                            <IconButton
                                variant="ghost"
                                color="gray"
                                onClick={() => onDelete(address.id)}
                                className="cursor-pointer hover:bg-gray-100"
                            >
                                <TrashIcon width="18" height="18" />
                            </IconButton>
                        </Flex>
                        <Separator size="4" className="my-4 w-full" />
                    </Box>
                ))}

                {addresses.length === 0 && (
                    <Text align="center" color="gray">No saved addresses found.</Text>
                )}
            </Flex>
        </div>
    );
}

"use client";

import { Button, Card, Flex, Heading, Text, TextField, Grid, IconButton, Box, Separator } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { TrashIcon } from "@radix-ui/react-icons";

// TODO: Integrate with backend AddAddress Mutation
// TODO: Integrate with backend UpdateAddress Mutation
// TODO: Integrate with backend DeleteAddress Mutation
// TODO: Fetch addresses from backend

interface AddressFormData {
    id: string;
    name: string;
    phoneNumber: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function AddressPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Mock initial state with multiple addresses
    const [addresses, setAddresses] = useState<AddressFormData[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<Omit<AddressFormData, "id">>();

    // Add new address
    const onAdd = () => {
        setEditingId(null);
        reset({
            name: "",
            phoneNumber: "",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: ""
        });
        setIsEditing(true);
    };
    // Edit existing address
    const onEdit = (address: AddressFormData) => {
        setEditingId(address.id);
        setValue("name", address.name);
        setValue("phoneNumber", address.phoneNumber);
        setValue("street", address.street);
        setValue("city", address.city);
        setValue("state", address.state);
        setValue("zipCode", address.zipCode);
        setValue("country", address.country);
        setIsEditing(true);
    };
    // Delete existing address
    const onDelete = async (id: string) => {
        // TODO: Call DeleteAddress Mutation here
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        toast.success("Address deleted successfully");
    };
    // Submit new or updated address
    const onSubmit = async (data: Omit<AddressFormData, "id">) => {
        // Mock API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (editingId) {
            // TODO: Call UpdateAddress Mutation here
            setAddresses(prev => prev.map(addr =>
                addr.id === editingId ? { ...data, id: editingId } : addr
            ));
            toast.success("Address updated successfully");
        } else {
            // TODO: Call AddAddress Mutation here
            const newAddress = { ...data, id: Math.random().toString(36).substr(2, 9) };
            setAddresses(prev => [...prev, newAddress]);
            toast.success("Address added successfully");
        }
        setIsEditing(false);
        setEditingId(null);
    };
    // Cancel editing
    const handleCancel = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
    };

    // TODO: Fetch addresses from backend
    useEffect(() => {
        // TODO: Call GetAddresses Query here
    }, []);

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
                                    <Text as="div" size="2" mb="1" weight="bold">Name</Text>
                                    <TextField.Root
                                        size="3"
                                        placeholder="Name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && <Text color="red" size="2">{errors.name.message}</Text>}
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
                                <Text as="div" size="2" mb="1" weight="bold">Address (Area and Street)</Text>
                                <TextField.Root
                                    size="3"
                                    placeholder="Address"
                                    {...register("street", { required: "Street address is required" })}
                                />
                                {errors.street && <Text color="red" size="2">{errors.street.message}</Text>}
                            </label>

                            <Grid columns="2" gap="4">
                                <label>
                                    <Text as="div" size="2" mb="1" weight="bold">City / District / Town</Text>
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
                                        {...register("zipCode", { required: "Zip code is required" })}
                                    />
                                    {errors.zipCode && <Text color="red" size="2">{errors.zipCode.message}</Text>}
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
                    <Box key={address.id} className="relative p-0">
                        <Flex justify="between" align="start">
                            <Box>
                                <Text as="div" weight="medium" size="3" mb="1">{address.name}</Text>
                                <Text as="div" size="2" color="gray" className="mb-1">
                                    {address.street}, {address.city}, {address.state} - {address.zipCode}
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

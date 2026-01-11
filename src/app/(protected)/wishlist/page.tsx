"use client";

import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// Dummy data
const INITIAL_WISHLIST = [
    {
        id: 1,
        name: "Classic White T-Shirt",
        price: "$29.00",
        details: "100% Cotton, Size M",
        inStock: true,
    },
    {
        id: 2,
        name: "Denim Jacket",
        price: "$89.00",
        details: "Light Wash, Vintage Fit",
        inStock: true,
    },
    {
        id: 3,
        name: "Canvas Sneakers",
        price: "$59.00",
        details: "Black/White, Size 10",
        inStock: false,
    },
    {
        id: 4,
        name: "Leather Wallet",
        price: "$45.00",
        details: "Genuine Leather, Brown",
        inStock: true,
    },
];

export default function WishlistPage() {
    const [items, setItems] = useState(INITIAL_WISHLIST);
    // TODO: Get Wishlist from API

    // TODO: Delete Wishlist from API
    const handleDelete = (id: number) => {
        setItems(items.filter((item) => item.id !== id));
    };

    // TODO: Move to Bag from API
    const moveToBag = (id: number) => {
        // Placeholder for move to bag logic
        console.log("Move to bag", id);
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
                <Flex direction="column" align="center" gap="4">
                    <ShoppingBag size={48} className="text-gray-300" strokeWidth={1} />
                    <Heading size="6" weight="light">
                        Your wishlist is empty
                    </Heading>
                    <Text color="gray" mb="4">
                        Looks like you haven&apos;t added anything to your wishlist yet.
                    </Text>
                    <Link href="/explore">
                        <Button size="3" variant="soft">
                            Start Exploring
                        </Button>
                    </Link>
                </Flex>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <Heading size="8" weight="light" mb="6">
                Wishlist List
            </Heading>

            <Flex direction="column" gap="4">
                {items.map((item) => (
                    <Card key={item.id} size="2">
                        <Flex align="start" gap="4">
                            {/* Image */}
                            <div className="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0" />

                            {/* Content */}
                            <Flex direction="column" gap="1" flexGrow="1">
                                <Heading size="4" weight="medium">
                                    {item.name}
                                </Heading>

                                <Text size="2" color="gray">
                                    {item.details}
                                </Text>

                                <Button
                                    variant="ghost"
                                    size="2"
                                    className="p-0 w-fit text-blue-600 hover:underline"
                                    onClick={() => moveToBag(item.id)}
                                    disabled={!item.inStock}
                                >
                                    Move to Bag
                                </Button>
                            </Flex>

                            {/* Delete */}
                            <Button
                                variant="ghost"
                                color="gray"
                                onClick={() => handleDelete(item.id)}
                                className="hover:bg-red-50 hover:text-red-600"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </Flex>
                    </Card>
                ))}
            </Flex>
        </div>
    );

}

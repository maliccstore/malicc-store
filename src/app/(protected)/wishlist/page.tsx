"use client";


import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { removeFromWishlist } from "@/store/slices/wishlistSlice";
import { addToCart } from "@/store/slices/cartSlice";
import { Product } from "@/types/product";
import Image from "next/image";

export default function WishlistPage() {
    const dispatch = useDispatch();
    const items = useSelector((state: RootState) => state.wishlist.items);

    const handleDelete = (id: string) => {
        dispatch(removeFromWishlist(id));
    };

    const moveToBag = (product: Product) => {
        dispatch(addToCart(product));
        dispatch(removeFromWishlist(product.id));
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
                Wishlist
            </Heading>

            <Flex direction="column" gap="4">
                {items.map((item) => (
                    <Card key={item.id} size="2">
                        <Flex align="start" gap="4">
                            {/* Image */}
                            <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Content */}
                            <Flex direction="column" gap="1" flexGrow="1">
                                <Heading size="4" weight="medium">
                                    {item.name}
                                </Heading>

                                <Text size="2" color="gray">
                                    {item.description}
                                </Text>

                                <Text size="2" weight="bold" mt="1">
                                    ${item.price}
                                </Text>

                                <Button
                                    variant="ghost"
                                    size="2"
                                    className="p-0 w-fit text-blue-600 hover:underline mt-2"
                                    onClick={() => moveToBag(item)}
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


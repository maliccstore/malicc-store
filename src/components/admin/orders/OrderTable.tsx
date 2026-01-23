import { Badge, Table, Button, DropdownMenu } from "@radix-ui/themes";
import { updateAdminOrderStatus } from "@/store/admin/order/orderThunks";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ORDER_STATUS, OrderStatus } from "@/services/admin/order.admin";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";

interface Order {
    id: string;
    shippingAddress: {
        fullName: string;
    };
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface OrderTableProps {
    orders: Order[];
}

const statusColors: Record<string, "gray" | "blue" | "green" | "red" | "orange"> = {
    [ORDER_STATUS.CREATED]: "gray",
    [ORDER_STATUS.PROCESSING]: "blue",
    [ORDER_STATUS.SHIPPED]: "orange",
    [ORDER_STATUS.DELIVERED]: "green",
    [ORDER_STATUS.CANCELLED]: "red",
    [ORDER_STATUS.REFUNDED]: "red",
};

export default function OrderTable({ orders }: OrderTableProps) {
    const dispatch = useDispatch<AppDispatch>();

    const handleStatusUpdate = (id: string, status: OrderStatus) => {
        dispatch(updateAdminOrderStatus({ id, status }));
    };

    return (
        <Table.Root variant="surface">
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeaderCell>Order ID</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {orders.map((order) => (
                    <Table.Row key={order.id}>
                        <Table.RowHeaderCell>
                            <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                                {order.id.slice(0, 8)}...
                            </Link>
                        </Table.RowHeaderCell>
                        <Table.Cell>{order.shippingAddress?.fullName || "N/A"}</Table.Cell>
                        <Table.Cell>{formatCurrency(order.totalAmount)}</Table.Cell>
                        <Table.Cell>
                            <Badge color={statusColors[order.status]}>{order.status}</Badge>
                        </Table.Cell>
                        <Table.Cell>{new Date(order.createdAt).toLocaleDateString()}</Table.Cell>
                        <Table.Cell>
                            <DropdownMenu.Root>
                                <DropdownMenu.Trigger>
                                    <Button variant="ghost" size="1">
                                        <DotsHorizontalIcon />
                                    </Button>
                                </DropdownMenu.Trigger>
                                <DropdownMenu.Content>
                                    <DropdownMenu.Label>Update Status</DropdownMenu.Label>
                                    {Object.values(ORDER_STATUS).map((status) => (
                                        <DropdownMenu.Item
                                            key={status}
                                            onClick={() => handleStatusUpdate(order.id, status)}
                                            disabled={order.status === status}
                                        >
                                            {status}
                                        </DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator />
                                    <DropdownMenu.Item>
                                        <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                    </DropdownMenu.Item>
                                </DropdownMenu.Content>
                            </DropdownMenu.Root>
                        </Table.Cell>
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}

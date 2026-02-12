import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { deleteAdminProduct, fetchAdminProducts } from '@/store/admin/product/productThunks';
import { DropdownMenu, IconButton } from '@radix-ui/themes';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function ProductRowActions({
  productId,
}: {
  productId: string;
}) {
  const dispatch = useDispatch<AppDispatch>();

  // delete product
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteAdminProduct(productId));
      dispatch(fetchAdminProducts());
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="ghost" color="gray">
          <DotsHorizontalIcon />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item asChild>
          <Link href={`/admin/catalog/products/${productId}`}>Edit</Link>
        </DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={handleDelete}>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

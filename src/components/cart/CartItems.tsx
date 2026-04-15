import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  updateCartItemThunk,
  CartItem,
} from "../../store/slices/cartSlice";
import { RootState } from "../../store";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

const CartItems = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state: RootState) => state.cart);

  const handleUpdateQuantity = async (item: CartItem, newQuantity: number) => {
    dispatch(
      updateCartItemThunk({
        productId: String(item.id),
        newQuantity,
      }),
    );
  };

  return (
    <div className="rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Items in your cart</h2>

      <ul className="divide-y">
        {items.map((item) => (
          <li key={item.id} className="py-4 flex">
            <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="text-gray-400" size={32} />
              )}
            </div>

            <div className="ml-4 flex-1 flex flex-col">
              <div className="flex justify-between">
                <h3 className="text-sm font-medium">{item.name}</h3>
                <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
              </div>

              <div className="flex-1 flex items-end justify-between">
                {/* Quantity controls */}
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity - 1)
                    }
                    className="px-3 py-1"
                  >
                    -
                  </button>

                  <span className="px-3">{item.quantity}</span>

                  <button
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity + 1)
                    }
                    disabled={
                      item.availableQuantity !== undefined &&
                      item.availableQuantity !== null &&
                      item.quantity >= item.availableQuantity
                    }
                    className="px-3 py-1 disabled:opacity-50"
                  >
                    +
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() =>
                    dispatch(
                      updateCartItemThunk({
                        productId: String(item.id),
                        newQuantity: 0,
                      }),
                    )
                  }
                  className="text-gray-500 border border-gray-300 px-3 py-1 rounded hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartItems;

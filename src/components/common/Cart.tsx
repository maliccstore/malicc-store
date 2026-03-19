import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  removeFromCart,
  removeItemCompletely,
  clearCart,
  setCartOpen,
  addToCart,
} from '../../store/slices/cartSlice';
import { Button } from '../ui/Button';
import Image from 'next/image';
import { useAuth } from '@/features/auth/hooks/useAuthActions';
import { cartAPI } from '@/services/cart.service';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount, isCartOpen } = useSelector(
    (state: RootState) => state.cart
  );
  const { isAuthenticated } = useAuth();

  return (
    <Dialog.Root
      open={isCartOpen}
      onOpenChange={(open) => dispatch(setCartOpen(open))}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-xl font-bold">
              Your Cart ({totalQuantity})
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <Cross2Icon className="h-6 w-6" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 border-b pb-4"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={async () => {
                            dispatch(removeFromCart(item.id));
                            if (isAuthenticated) {
                              try {
                                await cartAPI.updateCartItem(String(item.id), item.quantity - 1);
                              } catch (err) {
                                console.error("Failed to sync decrease", err);
                              }
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center border rounded"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={async () => {
                            dispatch(addToCart(item));
                            if (isAuthenticated) {
                              try {
                                await cartAPI.addToCart(String(item.id), 1);
                              } catch (err) {
                                console.error("Failed to sync increase", err);
                              }
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center border rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        dispatch(removeItemCompletely(item.id));
                        if (isAuthenticated) {
                          try {
                            await cartAPI.removeFromCart(String(item.id));
                          } catch (err) {
                            console.error("Failed to sync remove", err);
                          }
                        }
                      }}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Cross2Icon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t p-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Subtotal</span>
                <span className="font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  // Navigate to checkout
                  dispatch(setCartOpen(false));
                }}
              >
                Proceed to Checkout
              </Button>
              <button
                onClick={async () => {
                  dispatch(clearCart());
                  if (isAuthenticated) {
                    try {
                      await cartAPI.clearCart();
                    } catch (err) {
                      console.error("Failed to sync clear", err);
                    }
                  }
                }}
                className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Cart
              </button>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Cart;

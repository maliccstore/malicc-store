import { useDispatch } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  removeItemCompletely,
} from '../../store/slices/cartSlice';
import { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { Image as ImageIcon } from 'lucide-react';

const CartItems = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);

  return (
    <div className=" rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Items in your cart</h2>

      <ul className="divide-y ">
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
                <div className="flex items-center border rounded-md overflow-hidden">
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="px-3 py-1 "
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="px-3 py-1"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => dispatch(removeItemCompletely(item.id))}
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

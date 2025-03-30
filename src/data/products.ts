type Product = {
  id: string;
  name: string;
  image: string;
  price: string;
};

const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    image: 'https://picsum.photos/id/1084/200/300',
    price: '$199.99',
  },
  {
    id: '2',
    name: 'Smart Fitness Tracker Watch',
    image: 'https://picsum.photos/id/367/200/300',
    price: '$149.95',
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV',
    image: 'https://picsum.photos/id/160/200/300',
    price: '$899.00',
  },
  {
    id: '4',
    name: 'Stainless Steel Electric Kettle',
    image: 'https://picsum.photos/id/431/200/300',
    price: '$49.99',
  },
  {
    id: '5',
    name: 'Wireless Ergonomic Mouse',
    image: 'https://picsum.photos/id/219/200/300',
    price: '$79.50',
  },
];

export default products;

import { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children || 'Add to Cart'}
    </button>
  );
}

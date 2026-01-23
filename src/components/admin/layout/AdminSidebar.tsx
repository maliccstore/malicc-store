// src/app/admin/components/MobileSidebar.tsx
'use client';

import { useState } from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  ChevronRightIcon,
  DashboardIcon,
  PersonIcon as UsersIcon,
  FileTextIcon,
  GearIcon,
  HamburgerMenuIcon,
  Cross1Icon,
} from '@radix-ui/react-icons';
import Link from 'next/link';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(['dashboard']);

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />,
      link: '/admin/dashboard',
    },
    {
      id: 'users',
      label: 'Users',
      icon: <UsersIcon />,
      items: [
        { id: 'all-users', label: 'All Users', link: '/admin/users' },
        { id: 'customers', label: 'Customers', link: '/admin/users/customers' },
      ],
      link: '/admin/users',
    },
    {
      id: 'Orders',
      label: 'Orders',
      icon: <UsersIcon />,

      link: '/admin/orders',
    },
    {
      id: 'products',
      label: 'Products',
      icon: <FileTextIcon />,
      items: [
        { id: 'all-products', label: 'All Products', link: '/admin/catalog/products' },
        { id: 'new', label: 'New Product', link: '/admin/catalog/products/new' },
        { id: 'Edit Product', label: 'Edit Product', link: '/admin/catalog/products/editproduct' },
      ],
      link: '/admin/catalog/products',
    },
    {
      id: 'category',
      label: 'Categories',
      icon: <FileTextIcon />,
      items: [
        { id: 'all-categories', label: 'All Categories', link: '/admin/catalog/categories' },
        { id: 'new-category', label: 'New Category', link: '/admin/catalog/categories/new' },
      ],
      link: '/admin/catalog/categories',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <GearIcon />,
      link: '/admin/settings',
    },
  ];

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-md"
      >
        <HamburgerMenuIcon className="w-6 h-6" />
      </button>
      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-lg">Admin Panel</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Cross1Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          {menuItems.map((item) => (
            <div key={item.id} className="mb-1">
              {item.items ? (
                <Collapsible.Root
                  open={openSections.includes(item.id)}
                  onOpenChange={() => toggleSection(item.id)}
                >
                  <Collapsible.Trigger className="w-full flex items-center justify-between p-3 hover:bg-gray-100 rounded">
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <ChevronRightIcon
                      className={`transition-transform ${openSections.includes(item.id) ? 'rotate-90' : ''}`}
                    />
                  </Collapsible.Trigger>

                  <Collapsible.Content className="ml-8">
                    {item.items.map((subItem) => (
                      <Link key={subItem.id} href={subItem.link}>
                        <button className="w-full text-left p-2 hover:bg-gray-100 rounded">
                          {subItem.label}
                        </button>
                      </Link>
                    ))}
                  </Collapsible.Content>
                </Collapsible.Root>
              ) : (
                <Link href={item.link} passHref={true}>
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded">
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
}

"use client";

import { RootState } from "@/store";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function AccountPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  // console.log(user)

  const menuItems = [
    { label: "Profile", href: "/profile" },
    { label: "Orders", href: "/orders" },
    { label: "Address", href: "/address" },
    { label: "Wish-list", href: "/wishlist" },
    { label: "Settings", href: "/settings" },
    { label: "Help", href: "/help" },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-3xl font-light mb-8">
        Welcome {user?.username || "User"}
      </h1>

      <div className="flex flex-col space-y-0 text-lg">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center justify-between py-3 px-2 border-b border-gray-200 
              hover:text-gray-600 transition-colors group
              ${item.label === "Profile" ? "border text-black border-black/80" : ""}
            `}
          >
            <span className="font-light">{item.label}</span>
            <ChevronRight
              className="w-5 h-5 stroke-[1.5] text-gray-800 group-hover:translate-x-1 transition-transform"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

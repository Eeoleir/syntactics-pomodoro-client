"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { Menu } from "lucide-react";
import Logo from "@/components/subcomponents/Logo";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/home", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/app", label: "Our App" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="fixed left-1/2 z-50 mt-4 sm:mt-8 w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] -translate-x-1/2 rounded-2xl sm:rounded-[2.5em] bg-black px-4 sm:px-6 md:px-8 py-3 sm:py-4 text-white">
      <div className="flex items-center justify-between">
        {/* Logo Section */}
        <Logo />

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="flex gap-2 lg:gap-4 font-semibold text-sm lg:text-md">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink className="text-white px-2 lg:px-3 py-2 hover:text-[#84CC16] transition-colors">
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Button Section */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink className="text-white font-semibold px-3 py-2 hover:text-[#84CC16] transition-colors">
                    Login
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Link href="/login">
            <Button className="text-white bg-[#84CC16] rounded-full hover:bg-[#6BB013] text-sm lg:text-base">
              Try PomoSync - Free
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/login" className="text-white font-semibold text-sm mr-1 hover:text-[#84CC16] transition-colors">
            Login
          </Link>
          <Link href="/login">
            <Button size="sm" className="text-white bg-[#84CC16] hover:bg-[#6BB013] text-xs sm:text-sm">
              Try Free
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-1 text-white hover:text-[#84CC16] transition-colors">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-black text-white border-l border-gray-800">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white font-semibold text-lg py-2 hover:text-[#84CC16] transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <Link href="/login">
                    <Button className="w-full text-white bg-[#84CC16] hover:bg-[#6BB013]">
                      Try PomoSync - Free
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
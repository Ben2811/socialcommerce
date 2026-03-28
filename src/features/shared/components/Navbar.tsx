import { Bell, Menu, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { TopBar } from "./navbar/TopBar";
import { SearchBar } from "./navbar/SearchBar";
import { categoriesService } from "@/features/categories";
import { CategoryButton } from "@/features/categories/componets/CategoryButton";

export async function Navbar() {
  // const categoryResponse = await categoriesService.getCategories();
  // TODO: remove mock when API is ready
  const categoryResponse = { data: [] };
  
  const categories = Array.isArray(categoryResponse.data) ? categoryResponse.data : [];
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopBar />

      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:gap-8">
        <Link
          href="/"
          className="flex-shrink-0 text-2xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          S-COMMERCE
        </Link>

        <div className="hidden lg:flex items-center gap-4 max-w-3xl flex-1">
          <SearchBar className="flex-1" categories={categories} />
        </div>


        <div className="flex items-center space-x-2 md:space-x-4">
          <Link
            href="/cart"
            className="group relative p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-background">
              0
            </span>
          </Link>

          <Link
            href="/notifications"
            className="group p-2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-6 w-6 transition-transform group-hover:scale-110" />
          </Link>

          <button
            className="inline-flex p-2 text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            aria-label="Toggle Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-3 lg:hidden">
        <CategoryButton categories={categories} />
        <SearchBar className="w-full" categories={categories} />
      </div>
    </header>
  );
}

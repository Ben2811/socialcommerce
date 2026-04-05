import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbEntry {
  label: string;
  href: string;
}

interface ProductBreadcrumbProps {
  items: BreadcrumbEntry[];
}

export function ProductBreadcrumb({ items }: ProductBreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.flatMap((item, index) => [
          <BreadcrumbItem key={`item-${item.href}`}>
            {index < items.length - 1 ? (
              <BreadcrumbLink render={<Link href={item.href} />}>
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>,
          ...(index < items.length - 1
            ? [<BreadcrumbSeparator key={`sep-${item.href}`} />]
            : []),
        ])}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
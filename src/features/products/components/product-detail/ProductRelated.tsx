import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedProduct {
  name: string;
  price: string;
}

interface ProductRelatedProps {
  products: RelatedProduct[];
}

export function ProductRelated({ products }: ProductRelatedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm liên quan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((item) => (
            <article
              key={item.name}
              className="group cursor-pointer rounded-xl border p-3 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="aspect-square rounded-lg bg-muted transition group-hover:bg-muted/70" />
              <h3 className="mt-3 text-sm font-semibold">{item.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{item.price}</p>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
import { CheckCircle2Icon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductDescriptionProps {
  description?: string;
  features?: string[];
}

export function ProductDescription({
  description,
  features,
}: ProductDescriptionProps) {
  return (
    <Card className="border-0 w-1/2">
      <CardHeader>
        <CardTitle>Thông tin sản phẩm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}

        {features && features.length > 0 ? (
          <ul className="space-y-2">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckCircle2Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
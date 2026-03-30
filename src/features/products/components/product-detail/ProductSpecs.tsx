import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface Spec {
  label: string;
  value: string;
}

interface ProductSpecsProps {
  specs: Spec[];
}

export function ProductSpecs({ specs }: ProductSpecsProps) {
  return (
    <Card className="border-0 w-1/2">
      <CardHeader>
        <CardTitle>Thông số kỹ thuật</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="rounded-lg border text-sm overflow-hidden">
          {specs.map((spec, index) => (
            <React.Fragment key={spec.label}>
              <div
                key={spec.label}
                className="grid grid-cols-2 gap-4 px-4 py-2.5 even:bg-muted/40"
              >
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd className="font-medium">{spec.value}</dd>
              </div>
              {index < specs.length - 1 && (
                <Separator key={`sep-${spec.label}`} />
              )}
            </React.Fragment>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

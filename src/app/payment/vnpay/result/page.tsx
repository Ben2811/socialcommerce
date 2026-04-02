import { Suspense } from "react";
import { VnpayResultContent } from "./VnpayResultContent";

export default function VnpayResultPage() {
  return (
    <Suspense fallback={<VnpayResultSkeleton />}>
      <VnpayResultContent />
    </Suspense>
  );
}

function VnpayResultSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

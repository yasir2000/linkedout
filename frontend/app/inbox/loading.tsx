import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="px-4 sm:container mx-auto py-4 sm:py-6">
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-8 w-56 mb-4" />
        <div className="border rounded-lg divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 flex items-start gap-4">
              <Skeleton className="h-7 w-7 rounded-full flex-shrink-0" />
              <div className="flex-grow flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-6 w-20 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

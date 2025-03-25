import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function NotFound() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <Alert variant="destructive" className="w-[350px] pointer-events-all">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Not Found</AlertTitle>
        <AlertDescription>
          The board you are looking for does not exist.
        </AlertDescription>
      </Alert>
    </div>
  );
}

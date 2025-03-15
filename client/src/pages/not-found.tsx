
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">Page Not Found</h1>
          </div>
          <p className="mt-4 text-muted-foreground">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/">
            <a className="mt-4 inline-block text-primary hover:underline">
              Return to Dashboard
            </a>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

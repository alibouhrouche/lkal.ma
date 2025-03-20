import { Link } from "react-router";
import { buttonVariants } from "./ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <title>404 Not Found - Lkal.ma</title>
      <h1 className="text-4xl font-bold">404 Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
      <Link
        className={buttonVariants({
          variant: "link",
        })}
        to="/"
        replace
      >
        <ArrowLeft className="size-6" />
        Go home
      </Link>
    </div>
  );
}

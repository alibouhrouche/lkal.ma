import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Cta({ className }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "group relative flex flex-col gap-2 rounded-lg border p-4 text-sm",
                className
            )}
        >
            <div className="text-balance text-lg font-semibold leading-tight group-hover:underline">
                Launch your next SaaS with IEV Digital
            </div>
            <div>Trusted by startups and enterprises to build powerful digital products.</div>
            <div>
                IEV Digital helps you ship faster with modern design, AI integration, and scalable architecture.
            </div>
            <Button size="sm" className="mt-2 w-fit">
                Get Started
            </Button>
            <Link
                href="https://iev.digital?utm_source=lkalma_site&utm_medium=web&utm_campaign=docs_cta"
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0"
            >
                <span className="sr-only">Visit IEV Digital</span>
            </Link>
        </div>
    )
}

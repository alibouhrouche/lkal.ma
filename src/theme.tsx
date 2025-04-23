import { ChevronRight, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Balancer from 'react-wrap-balancer'
import type { FrontMatter, MdxFile, Meta, NextraThemeLayoutProps } from 'nextra'
import Navbar from './components/navbar/navbar'
import { cn } from './lib/utils'
import { badgeVariants } from './components/ui/badge'
import { DocsNav } from './components/docs-nav'
import { useMemo } from 'react'
import { SidebarNavItem } from './types/nav'
import Head from 'next/head'
import Cta from './components/docs-cta'

export default function Layout({ children, pageOpts }: NextraThemeLayoutProps) {
    const { pageMap, title, frontMatter } = pageOpts
    const items = useMemo(() => {
        const docs = pageMap.find(
            (item) => 'name' in item && item.name === "docs" && 'children' in item
        )
        if (!docs || !('children' in docs)) {
            return null;
        }
        const meta = docs.children.find(
            (item) => 'data' in item
        ) as {data: Meta}
        if (!meta) {
            return null;
        }
        return Object.values(meta.data) as SidebarNavItem[];
    }, [pageMap])
    //     const docs = pageMap.find(
    //         (item) => 'name' in item && item.name === "docs" && 'children' in item
    //     )
    //     if (!docs || !('children' in docs)) {
    //         return []
    //     }
    //     let meta: Meta;
    //     const items: SidebarNavItem[] = [{
    //         title: 'Docs',
    //         items: []
    //     }];
    //     for (const item of docs.children) {
    //         if ('data' in item) {
    //             meta = item.data as Meta
    //         }
    //         if ('children' in item) {
    //             items.push({
    //                 title: item.name,
    //                 items: item.children.filter((item): item is MdxFile<FrontMatter> => {
    //                     return 'route' in item && 'frontMatter' in item && item.frontMatter?.sidebarTitle
    //                 }).map((child) => {
    //                     return {
    //                         title: child.name,
    //                         href: child.route,
    //                         items: [],
    //                     }
    //                 }),
    //             })
    //         } else {
    //             if ('frontMatter' in item && item.frontMatter)
    //                 items[0].items.push({
    //                     title: item.frontMatter?.sidebarTitle ?? meta,
    //                     href: item.route,
    //                     items: [],
    //                 })
    //         }
    //     }
    //     return items
    // }, [pageMap]);
    const doc = {
        links: {
            doc: undefined,
            api: undefined,
        },
    }
    return (
        <div data-wrapper="" className="border-grid flex flex-1 flex-col">
            <Head>
                <title>{`${title} | Lkal.ma`}</title>
                {frontMatter?.description && (
                    <meta name="description" content={frontMatter.description} />
                )}
            </Head>
            <Navbar className='sticky top-0 z-10' />
            <main className="flex flex-1 flex-col">
                <div className="container-wrapper">
                    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                        <aside className="border-grid fixed ml-2 top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 border-r md:sticky md:block">
                            <div className="no-scrollbar h-full overflow-auto py-6 pr-4 lg:py-8">
                                {items && <DocsNav items={items} />}
                            </div>
                        </aside>
                        <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
                            <div className="mx-auto w-full min-w-0 max-w-2xl">
                                <div className="mb-4 flex items-center space-x-1 text-sm leading-none text-muted-foreground">
                                    <Link href="/docs" className="truncate">
                                        Docs
                                    </Link>
                                    <ChevronRight className="h-3.5 w-3.5" />
                                    <div className="text-foreground">{title}</div>
                                </div>
                                <div className="space-y-2">
                                    <h1 className={cn("scroll-m-20 text-3xl font-bold tracking-tight")}>
                                        {title}
                                    </h1>
                                    {frontMatter?.description && (
                                        <p className="text-base text-muted-foreground">
                                            <Balancer>{frontMatter?.description}</Balancer>
                                        </p>
                                    )}
                                </div>
                                {doc.links ? (
                                    <div className="flex items-center space-x-2 pt-4">
                                        {doc.links?.doc && (
                                            <Link
                                                href={doc.links.doc}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
                                            >
                                                Docs
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        )}
                                        {doc.links?.api && (
                                            <Link
                                                href={doc.links.api}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={cn(badgeVariants({ variant: "secondary" }), "gap-1")}
                                            >
                                                API Reference
                                                <ExternalLink className="h-3 w-3" />
                                            </Link>
                                        )}
                                    </div>
                                ) : null}
                                <div className="pb-12 pt-8 prose dark:prose-invert">
                                    {children}
                                </div>
                                {/* <DocsPager doc={doc} /> */}
                            </div>
                            <div className="hidden text-sm xl:block">
                                <div className="sticky top-20 -mt-6 h-[calc(100vh-3.5rem)] pt-4">
                                    <div className="no-scrollbar h-full overflow-auto pb-10">
                                        {/* {doc.toc && <DashboardTableOfContents toc={toc} />} */}
                                        <Cta className="mt-6 max-w-[80%]" />
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </main>
        </div>
    )
}
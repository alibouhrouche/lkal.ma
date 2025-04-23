import { SidebarNavItem } from "@/types/nav";

export default {
    "index": {
        "title": "Welcome to My Documentation",
        "items": [
            {
                "title": "Introduction",
                "href": "/docs",
                "items": [],
            },
        ]
    },
    "components": {
        "title": "Components",
        "items": [
            {
                "title": "Text",
                "href": "/docs/components/text",
                "items": [],
            },
            {
                "title": "Button",
                "href": "/docs/components/button",
                "items": [],
            },
            {
                "title": "Image",
                "href": "/docs/components/image",
                "items": [],
            },
            {
                "title": "Instructions",
                "href": "/docs/components/instructions",
                "items": [],
            },
            {
                "title": "Data",
                "href": "/docs/components/data",
                "items": [],
            }
        ]
    }
} satisfies Record<string, SidebarNavItem>
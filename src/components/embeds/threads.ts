import {CustomEmbedDefinition} from "tldraw";

const instagram: CustomEmbedDefinition = {
    type: 'threads',
    title: 'Threads',
    hostnames: ['threads.net'],
    minWidth: 326,
    minHeight: 460,
    width: 326,
    height: 460,
    doesResize: true,
    toEmbedUrl: (url) => {
        const urlObj = new URL(url)
        const matches = urlObj.pathname.match(/^\/(@[^/]+)\/post\/([^/]+)/)
        if (matches) {
            return `https://www.threads.net/${matches[1]}/post/${matches[2]}/embed/`
        }
        return
    },
    fromEmbedUrl: (url) => {
        const urlObj = new URL(url)
        const matches = urlObj.pathname.match(/^\/(@[^/]+)\/post\/([^/]+)/)
        if (matches) {
            return `https://www.threads.net/${matches[1]}/post/${matches[2]}`
        }
        return
    },
    icon: '/embed-icons/threads.png',
}

export default instagram

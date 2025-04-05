import {CustomEmbedDefinition} from "tldraw";

const instagram: CustomEmbedDefinition = {
    type: 'instagram',
    title: 'Instagram',
    hostnames: ['instagram.com'],
    minWidth: 326,
    minHeight: 460,
    width: 326,
    height: 460,
    doesResize: true,
    toEmbedUrl: (url) => {
        const urlObj = new URL(url)
        const matches = urlObj.pathname.match(/^\/?[^\/]*\/(p|reel)\/([^\/]+)|^(\/[^\/]+)\/?$/)
        if (matches) {
            if (matches[3]) {
                return `https://www.instagram.com/${matches[3]}/embed`
            }
            return `https://www.instagram.com/${matches[1]}/${matches[2]}/embed/captioned`
        }
        return
    },
    fromEmbedUrl: (url) => {
        const urlObj = new URL(url)
        const matches = urlObj.pathname.match(/\/?[^\/]*\/(p|reel)\/([^\/]+)|(\/[^\/]+)/)
        if (matches) {
            if (matches[3]) {
                return `https://www.instagram.com/${matches[3]}/`
            }
            return `https://www.instagram.com/${matches[1]}/${matches[2]}`
        }
        return
    },
    icon: '/embed-icons/instagram.png',
}

export default instagram

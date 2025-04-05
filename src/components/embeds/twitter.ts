import {CustomEmbedDefinition} from "tldraw";

const twitter: CustomEmbedDefinition = {
    type: 'twitter',
    title: 'Twitter',
    hostnames: ['twitter.com', 'x.com'],
    minWidth: 326,
    minHeight: 280,
    width: 326,
    height: 400,
    doesResize: true,
    toEmbedUrl: (url) => {
        const urlObj = new URL(url)
        const matches = urlObj.pathname.match(/^\/([^/]+)\/status\/([^/]+)|\/([^/]+)$/)
        if (matches) {
            if (matches[3]) {
                return `https://syndication.twitter.com/srv/timeline-profile/screen-name/${matches[3]}?dnt=true`
            }
            return `https://platform.twitter.com/embed/Tweet.html?dnt=true&id=${matches[2]}&screen_name=${matches[1]}&maxWidth=300px`
        }
        return
    },
    fromEmbedUrl: (url) => {
        const urlObj = new URL(url)
        if (urlObj.host === 'syndication.twitter.com') {
            const matches = urlObj.pathname.match(/\/screen-name\/([^/]+)$/)
            if (matches) {
                return `https://x.com/${matches[1]}`
            }
        }
        if (urlObj.host === 'platform.twitter.com') {
            const id = urlObj.searchParams.get('id')
            const screenName = urlObj.searchParams.get('screen_name')
            if (id && screenName) {
                return `https://x.com/${screenName}/status/${id}`
            }
        }
        return
    },
    icon: '/embed-icons/twitter.png',
}

export default twitter

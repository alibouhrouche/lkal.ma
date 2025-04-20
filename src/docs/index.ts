import dynamic from 'next/dynamic';

const AllMaps = {
    'text': dynamic(() => import('@/docs/text.mdx')),
    'instructions': dynamic(() => import('@/docs/instructions.mdx')),
    'button': dynamic(() => import('@/docs/button.mdx')),
    'image': dynamic(() => import('@/docs/image.mdx')),
    'data': dynamic(() => import('@/docs/data.mdx')),
    // 'index': dynamic(() => import('@/docs/index.mdx')),
}

export default AllMaps;

import { Buffer } from 'buffer';

export const decodeToken = (token: string) => {
    try {
        const payload = token.split('.')[1];

        const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());

        return decoded;
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

export function truncateString(str:string, maxlenght:number) {
    if (str.length > maxlenght) {
        return str.slice(0, maxlenght) + '...';
    } else {
        return str;
    }
}

interface Category {
    icon: string;
    id: number;
    name: string;
    parentId: null | { icon: string; id: number; name: string; parentId: null };
}

export const filterCategoriesWithoutParent = (categories: Category[]): Category[] => {
    return categories.filter(category => category.parentId === null);
};

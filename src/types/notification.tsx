export interface Notification{
    postId: number;
    announceId?: number;
    notiId: number;
    category: string;
    title: string;
    content: string;
    date: string;
    checked: boolean;
}
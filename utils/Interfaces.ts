export enum Role {
    Bot = 1,
    User = 0,
}

export interface Message {
    imageUrl?: string;
    content: string;
    role: Role;
    prompt?: string;
}

export interface Chat {
    id: number;
    title: string;
}
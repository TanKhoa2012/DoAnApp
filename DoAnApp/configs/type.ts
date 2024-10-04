export enum ROLES {
    ADMIN = 'Admin',
    OWNER = 'Owner',
    USER = 'User',
}

export type TRole = 'Admin' | 'Owner' | 'User' 
enum ACCOUNT_TYPE {
    LOCAL = 'Local',
    GOOGLE = 'Google',
}

export interface IProfile {
    _id: string| number;
    displayName?: string;
    username?: string;
    email?: string;
    phone?: string;
    address?: string;
    avatar?: string;
    backgroundImage?: string;
    role?: ROLES;
    accountType?: ACCOUNT_TYPE;
    isActive?: boolean;
}


//Chat
export interface User {
    _id: string;
    displayName: string;
    email?: string;
    avatar?: string;
  }
  
  export interface Message {
    _id: string;
    sender: User;
    content: string;
    conversationId: string;
    createdAt: string;
    updatedAt: string;
    messageType:'text'|'image'|'file'
  }
  
  export interface Conversation {
    conversationId?:string,
    _id: string;
    name?: string;
    participants?: User[];
    lastMessage?: Message;
    isGroup?: boolean;
    groupAvatar?:string
  }
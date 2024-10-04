export type InfoState = {
    id: number | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    role: string | null;
    email: string | null;
    avatar: string | null;
};

export type LoginState = {
    username: string | null;
    password: string | null;
};

export type SignUpState = {
    username: string;
    email: string;
    password: string;
    name: string;
    confirm: string;
    avatar?: {
        uri: string;
        fileName: string;
        type: string;
    };
}

export interface Action {
    type: string;
    data: InfoState;
    username: string;
}

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;

export interface ROLES {
    description:string,
    name:string,
    permissions?:string[]
}

export type TRole = 'Admin' | 'Owner' | 'User' 
enum ACCOUNT_TYPE {
    LOCAL = 'Local',
    GOOGLE = 'Google',
}

export interface IProfile {
    id: string;
    name?: string;
    username?: string;
    email?: string;
    numberPhone?: string;
    location?: string;
    avatar?: string;
    background?: string;
    role: ROLES;
    isActive?: boolean;
    createdDate?: Date;
    longitude: number;
    latitude: number;
}

export interface Prediction {
    description: string;
    matched_substrings: MatchedSubstring[]; // Cần thêm thông tin chi tiết cho loại này
    place_id: string;
    reference: string;
    structured_formatting: StructuredFormatting; // Cần thêm thông tin chi tiết cho loại này
    terms: Term[]; // Cần thêm thông tin chi tiết cho loại này
    types: string[]; // Giả sử types là mảng các chuỗi
}
  
interface MatchedSubstring {
    length: number;
    offset: number;
}
  
interface StructuredFormatting {
    main_text: string;
    main_text_matched_substrings: MatchedSubstring[];
    secondary_text: string;
}
  
interface Term {
    offset: number;
    value: string;
}
  
interface PlaceAutocompleteResponse {
    predictions: Prediction[];
    status: string;
}


//Chat
interface User {
    id: number;
    username: string;
    name: string;
    avatar: string;
    background: string | null;
    numberPhone: string | null;
    email: string;
    location: string | null;
    description: string | null;
    role: {
        name: string;
        description: string;
        permissions: any[]; // Bạn có thể thay đổi `any[]` thành kiểu cụ thể hơn nếu cần
    };
    createdDate: string; // ISO 8601 date string
}

export interface ItemImage {
    id: number;
    url: string;
    active: boolean;
}

export interface CategoryState {
    id: number;
    name: string;
    icon: string;
    parentId: Category | null; 
}

export interface LikeItems {
    menuItems: Item,
    user: User
}

export interface Item {
    id: number;
    name: string;
    price: number;
    quantity: number;
    categoriesId: CategoryState;
    stores: Store;
    itemimagesSet: ItemImage[];
    active: boolean;
    createdDate: string; // ISO 8601 format
}

export interface OrderDate {
    startDate: Date;
    endDate: Date;
}

export interface Order {
    id: number;
    totalPrice: number;
    deliveryFee: number;
    paymentMethod: string;
    status: string;
    users: User;
    stores: Store;
    menuItemsId:Item;
    startDate: Date;
    endDate: Date;
    createdDate: Date
}

export interface IMeState {
    error: string | null;
    profile?: IProfile;
}

export interface Store {
    id: number;
    name: string;
    businessType: string;
    numberPhone: string;
    email: string;
    code: string;
    description: string;
    avatar: string;
    background: string;
    location: string;
    users: User;
    latitude: number;
    longitude: number
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

  interface IImage {
    uri: string;
    fileName: string | null | undefined;
    type: "image" | "video" | undefined;
}
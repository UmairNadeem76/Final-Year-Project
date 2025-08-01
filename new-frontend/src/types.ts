export interface User {
    _id: string;
    email: string;
    name: string;
    role: string;
    history: any[];
    createdAt: string;
    updatedAt: string;
}

export interface PdfHistoryItem {
    _id: string;
    filename: string;
    date: string;
    category: string;
    scanResult: string;
    userId: string;
}

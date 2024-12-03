export interface WatchRecord {
    id?: number;
    modelId?: number;
    imageUrl?: string;
    description?: string;
    material?: string;
    dateOfPurchase?: Date;
    referenceNumber?: string;
    serialNumber?: string;
    location?: string;
    box?: boolean;
    papers?: boolean;
    cost?: number;
    remarks?: string
    isSold?: boolean;
}
export interface WatchRecord {
    id?: number;
    modelId?: number;
    imageUrl?: string;
    description?: string;
    material?: string;
    datePurchased?: Date;
    dateReceived?: Date;
    dateSold?: Date;
    dateBorrowed?: Date;
    dateReturned?: Date;
    datePickedUp?: Date;
    referenceNumber?: string;
    serialNumber?: string;
    location?: string;
    hasBox?: boolean;
    hasPapers?: boolean;
    cost?: number;
    remarks?: string
    createdAt?: Date;
}
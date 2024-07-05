

export interface Student {
    id?: number;
    fname?: string;
    lname?: string;
    email?: string;
    password?: string;
    dob?: string;
    address?: string;
    gender?: string;
    bloodGroup?: string;
    dietaryPreference?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    emergencyContactRelation?: string;
}
export interface CulturalEvent {
    id: number;
    eventName: string;
    date: string;
    description: string;
    signedUp: boolean;
    userId: number;
}

export interface Accomodation {
    id :number;     
    roomNumber:number;
    buildingName:String;
    floor:String;
    isSingleOccupancy:Boolean;
    numberOfRoommates:number;
    roommateNames:String;
    userId:number;
}
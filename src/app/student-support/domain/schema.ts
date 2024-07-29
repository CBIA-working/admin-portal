

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
    imageUrl?:string;
}
export interface CulturalEvent {
    id: number;
    eventName: string;
    date: string;  // Temporarily handle as string when dealing with forms
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
    hostfamily:String;
    roommateNumber:String;
    agreement1:Boolean;               
    agreement2:Boolean;               
    agreement3:Boolean;
    userId:number;
}

export interface Courses {
    id: number;
    title: string;
    description: string;
    startDate: Date | string;
    endDate: Date | string;
    keyDates: string;
    events: string;
    agreements: string;
}
// In your domain/schema.ts file
export interface KeyProgramDate {
    id: number;
    name: string;
    date: Date  | string;
    time:string; // Allow date to be either Date or string
    description: string;
  }
  
export interface Faq {
    id:number;
    name:String;
    description:String;
  }

  export interface Program {
    id:number;
    name:String;
    batch:String;
  }
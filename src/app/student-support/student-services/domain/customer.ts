// customer.ts
export interface Customer {
  id: number;
  fname: string;
  lname: string;
  events?: CulturalEvent[];
  accommodations?: Accommodation[]; // Add this line
  expanded?: boolean;
}

  
  export interface CulturalEvent {
    eventName: string;
    date: Date;
    description: string;
    signedUp: boolean;
    userId: number
  }
  export interface Accommodation {
    roomNumber: number;
    buildingName: string;
    floor: string;
    isSingleOccupancy: boolean;
    numberOfRoommates: number;
    roommateNames: string;
    userId: number
  }
  
  
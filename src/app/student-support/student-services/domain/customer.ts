// customer.ts
export interface Customer {
    id: number;
    fname: string;
    lname: string;
    events?: CulturalEvent[]; // Change this line
    expanded?: boolean; // This property will track if row is expanded
  }
  
  export interface CulturalEvent {
    eventName: string;
    date: Date;
    description: string;
    signedUp: boolean;
    userId: number
  }

  

export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}
// customer.ts
export interface Customer {
    id: number;
    fname: string;
    lname: string;
    eventName?: string;
    eventDate?: Date;
    eventDescription?: string;
    signedUp?: boolean;
    expanded?: boolean; // This property will track if row is expanded
  }
  
  
  

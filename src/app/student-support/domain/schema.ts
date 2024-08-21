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

  export interface KeyProgramDate {
    id: number;
    name: string;
    date: Date  | string;
    time:string; 
    description: string;
  }

  export interface Trip {
    id:number;
    TripName:String;
    Location:String;
    DepartureDate:Date;
    ReturnDate:Date;
    FullName:String;
    StudentId:String;
    PhoneNumber:String;
    Purpose:String;
    GoingFormFilled:Boolean;
  }

  export interface Faq {
    id:number;
    name:String;
    description:String;
  }

  export interface Program {
    id:number;
    name:String;
    fullForm:string;
    batch:String;
  }

  export interface Marker {
    id: number;
    position: {
      lat: number;
      lng: number;
    };
    label: string;
    info: string;
  }

  export interface OrientationFile {
    id:number;
    Name:String;
    Description:String;
    OrientationPdf:String;
  }

  export interface Library {
    id:number;
    Name:String;
    Description:String;
    Status:String;
    LibraryPdf:String;
  }

  export interface Tasks{
    id:number;
    name:String;
    date:Date;
    status:Boolean;
    FullName:String;
    StudentId:number;
  }

  export interface Permission {
    id: number;
    type: string;  // e.g., 'read', 'write', 'admin'
    pageName:string;
  }
  
  export interface Role {
    id: number;
    roleName: string;  // Name of the role, e.g., 'Admin', 'User'
    permissions: Permission[];  // List of permissions associated with the role
  }
  
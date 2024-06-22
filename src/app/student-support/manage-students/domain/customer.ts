
export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

export interface Customer {
    id: number;
    fname: string;
    lname: string;
    email: string;
    password: string;
    dob: string;
    address: string;
    gender: string;
    bloodGroup: string;
    dietaryPreference: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    emergencyContactRelation: string;
}
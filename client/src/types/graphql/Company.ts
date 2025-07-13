export interface Company{
  id:string,
  name:string
}


export interface CompanyDTO {
  id: string;
  name: string;
  zipCode: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string; 
  establishmentDate: Date;
  remarks?: string;
  images: string[];
  users?: CompanyUserDTO[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyUserDTO {
  id: string;
  createdAt: Date;
  companyId: string;
  userId: string;
}
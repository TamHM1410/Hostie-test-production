export interface User {
    id: number
    createdAt: string
    updatedAt: string
    email: string
    username: string
    firstName: string
    middleName: string
    lastName: string
    password: string
    isMember: boolean
    referenceBy: string
    reference_code: string
    point: number
    isActive: boolean
    memberExpire: string
    status: number
    emailVerified: boolean
    roles: Pick<Role,"name"|"description">[]
    socials: Social[],
    phones:string[],
    bankAccounts:BankAccount[],
    urlAvatar:string
    
}

export type UserManagement=Pick<User,"username"|"email"|"roles"|"status"|"urlAvatar"|"isActive"|"id">  

export type  UserInfor=Pick<User,"firstName"|"middleName"|"lastName"| "email" | "phones"|'bankAccounts'>

export type SignIn=Pick<User,'username'|'password'>

export type SignUp=Pick<User,'username'|'email'|'password'|'reference_code'> &  {
    retype_password: string;
    social_urls:social_urls[]
  }
export type social_urls={
    url:string,
    social_name:string
}
export interface Role {
    id: number
    createdAt: number
    updatedAt: number
    name: string
    status: number,
    description:string
  }
  
  export interface Social {
    id: number
    createdAt: string
    updatedAt: string
    user: string
    url: string
    socialName: string
    note: string
    status: number
  }


  export interface BankAccount {
    accountNo: number
    bank: string
    accountHolder: string
  }


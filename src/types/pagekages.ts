export type PackageType ={
    id:number,
    createdAt:string,
    updatedAt:string,
    name:string,
    price:number,
    status:number,
    description:string
}

export type PackageFormCreateType=Pick<PackageType,'name'|'description'|'price'>

export type PackageFormType=Pick<PackageType,'name'|'description'|'price'|'id'|'status'>
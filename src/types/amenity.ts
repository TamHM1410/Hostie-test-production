export type AmenityType={
    id:number,
    createdAt:string,
    updatedAt:string,
    name:string,
    iconPath:string,
    iconType:string,
    iconSize:string,
    status:number
}
export type AmenityFormType=Pick<AmenityType,'name'|'iconPath'|'iconSize'|'iconType'|'status'>
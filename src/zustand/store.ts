import { create } from 'zustand';
import { Role, UserManagement } from 'src/types/users';
import { AmenityFormType } from 'src/types/amenity';
import { PackageFormType } from 'src/types/pagekages';

export const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state: any) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));

//  User management
const userSelecteDefaultValue: UserManagement | any = {
  id: 0,
  username: '',
  email: '',
  roles: [
    {
      name: '',
      description: '',
    },
  ],
  status: 0,
  isActive: false,
  urlAvatar: '',
  socials: [],
  firstName: '',
  lastName: '',
  middleName: '',
  phones: [],
};

export const useCurrentUser = create<any>((set) => ({
  currenUserSelected: userSelecteDefaultValue,

  updateUserSelected: (payload: UserManagement | any) => {
    console.log('payload', payload);
    set(() => ({ currenUserSelected: payload }));
  },
}));

//   role management

const roleDefaultValue: Pick<Role, 'id' | 'name' | 'description'> = {
  id: 0,
  name: '',
  description: '',
};

export const useCurrentRole = create<any>((set) => ({
  currentRole: roleDefaultValue,
  updateRoleZustand: (payload: Pick<Role, 'id' | 'name' | 'description'> | any) =>
    set(() => ({ currentRole: payload })),
}));


/// package

type CurrentPackageState = {
  currentPackage: PackageFormType | any;
  updatePackageZustand: (payload: PackageFormType | any) => void;
};

const packageDefaultValue: PackageFormType | any = {
  id: 0,
  name: '',
  description: '',
  status: 0,
  price: 0,
};

export const useCurrentPackage = create<CurrentPackageState>((set) => ({
  currentPackage: packageDefaultValue,
  updatePackageZustand: (payload: PackageFormType) => set(() => ({ currentPackage: payload })),
}));

///  Amenity management

const amenityDefaultValue: AmenityFormType | any = {
  id: 0,
  name: '',
  status: '',
  iconPath: 'string',
  iconSize: 'string',
  iconType: '',
};

export const useCurrentAmenity = create<any>((set) => ({
  currentAmenity: amenityDefaultValue,
  updateAmenityZustand: (payload: AmenityFormType | any) =>
    set(() => ({ currentAmenity: payload })),
}));
//  residencetype
const residenceTypeDefaultValue: any = {
  id: 0,
  name: 'name',
  desciption: '',
};
export const useCurrentResidenceType = create<any>((set) => ({
  currentResidenceType: residenceTypeDefaultValue,
  updateResidenceTypeZustand: (payload: any) => set(() => ({  currentResidenceType: payload })),
}));


const  butlerBookingDefaultValue:any={
  id: 0,
  seller_id: 0,
  residence_id: 0,
  residence_name: "",
  host_id: 0,
  total_amount: 0,
  paid_amount: 0,
  checkin: "",
  checkout: "",
  total_night: 0,
  total_day: 0,
  guest_name: "",
  guest_phone: "",
  host_phone: null,
  residence_address: null,
  is_host_accept: true,
  is_seller_transfer: true,
  is_host_receive: true,
  is_customer_checkin: false,
  is_customer_checkout: false,
  status: 2,
  expire: "",
  created_at: "",
  updated_at: ""
}

export const useButlerBooking = create<any>((set) => ({
 butler:butlerBookingDefaultValue,
  updateButlerBookingZustand: (payload: any) => set(() => ({ butler: payload })),
}));



const javaUrl = process.env.NEXT_PUBLIC_LOCAL_API;

const goApi=process.env.NEXT_PUBLIC_GOLANG_API

const endPoint = {
  user: {
    updateUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    getUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    signUp: `/v1/api/users/sign-up`,
    signIn: `/v1/api/auth/sign-in`,
    info: `/v1/api/users/my-info`,
    update: `/v1/api/users/update`,
    refresh:`/v1/api/auth/refresh-token`,
    forgot:`/v1/api/password/forgot`,
    reset:`/v1/api/password/reset`,
    avatar:`/v1/api/files/upload-avatar`
  },
  butler:{
    residence:'/v1/api/housekeepers/my-residences',
    signUp:'/v1/api/housekeepers/sign-up'
    

  },
  host:{
     housekeeperRequest:'/v1/api/housekeepers/housekeeper-requests',
     acceptButler:'/v1/api/housekeepers/accept-housekeeper',
     rejectButler:'/v1/api/housekeepers/reject-housekeeper'
  },
  bank:'/v1/api/banks',

  admin: {
    /// user mangament
    getAllUser: `/v1/api/users`,

    /// role management
    createNewRole: `/v1/api/roles`,
    deleteRole: (id: any) => `/v1/api/roles/${id}`,

    /// packages
    package: {
      root: `/v1/api/package`,
      byId: (id: any) => `/v1/api/package/${id}`,
    },
    residence_types:{ 
     root:`/v1/api/residences-types`,
     byId: (id: any) => `/v1/api/residences-types/${id}`,

    },
    updateActiveById :(id:any,isActive:any)=> `/v1/api/users/update-active-status/${id}?isActive=${isActive}`,

    /// amenity
    amenity:{
      root:`/v1/api/amenities`,
      byId: (id: any) => `/v1/api/amenities/${id}`,

    },
  
  },


  register_package:{
    post:'/v1/api/registers',
    get:(id:any)=>`/v1/api/registers/${id}/payment`,
    getDiscount:'/v1/api/registers/discount-percentage',
    currentPackage:'/v1/api/registers/my-register',
    suggestPackage:'/v1/api/registers/upgradable-packages'
  }
};

const goEndPoint={
  /// get all butler's residence
  butler_residence:'/residences/housekeeper',
  butler_booking:`/booking/housekeeper`,
  update_checkin:`/booking/checkin`,
  update_checkout:`/booking/checkout`,
  all_residence:'/residences',
  butler_add_residence:'/v1/api/housekeepers/add-residence',

  chat:{
    getListConversion:'/chats/groups',
    listMessage:(id:any)=>`/chats/groups/${id}/messages`,
    sendMessage:'/chats/messages'

  }


}

export { endPoint, javaUrl ,goApi,goEndPoint};

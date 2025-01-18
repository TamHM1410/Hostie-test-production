const javaUrl = process.env.NEXT_PUBLIC_LOCAL_API;

const goApi = process.env.NEXT_PUBLIC_GOLANG_API;

const endPoint = {
  user: {
    updateUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    getUserById: (userId: any) => `/v1/api/users/update/${userId}`,
    signUp: `/v1/api/users/sign-up`,
    signIn: `/v1/api/auth/sign-in`,
    info: `/v1/api/users/my-info`,
    update: `/v1/api/users/update`,
    refresh: `/v1/api/auth/refresh-token`,
    forgot: `/v1/api/password/forgot`,
    reset: `/v1/api/password/reset`,
    avatar: `/v1/api/files/upload-avatar`,
    role: '/v1/api/users/my-roles',
    confirmVerification: '/v1/api/email/confirm-verification',
    getReferredAccounts: `/v1/api/users/referred-accounts`,
    totalCommissionPackage: `/v1/api/users/total-commission-for-package`,

  },
  butler: {
    residence: '/v1/api/housekeepers/my-residences',
    signUp: '/v1/api/housekeepers/sign-up',
  },
  host: {
    housekeeperRequest: '/v1/api/housekeepers/housekeeper-requests',
    acceptButler: '/v1/api/housekeepers/accept-housekeeper',
    rejectButler: '/v1/api/housekeepers/reject-housekeeper',
  },
  bank: '/v1/api/banks',

  admin: {
    /// user mangament
    getAllUser: `/v1/api/users`,

    /// role management
    createNewRole: `/v1/api/roles`,
    deleteRole: (id: any) => `/v1/api/roles/${id}`,

    /// packages
    package: {
      root: `/v1/api/package`,
      adminById: (id: any) => `/v1/api/package/${id}`,
      byId: (id: any, type: any) =>
        type === 'normal' ? `/v1/api/package/${id}` : `/v1/api/package/${id}/upgrade-cost`,
    },
    residence_types: {
      root: `/v1/api/residences-types`,
      byId: (id: any) => `/v1/api/residences-types/${id}`,
    },

    residence: {
      root: `/v1/api/residences`,
      byId: (id: any) => `/v1/api/residences/${id}/update-status`,
    },

    updateActiveById: (id: any, isActive: any) =>
      `/v1/api/users/update-active-status/${id}?isActive=${isActive}`,

    /// amenity
    amenity: {
      root: `/v1/api/amenities`,
      byId: (id: any) => `/v1/api/amenities/${id}`,
    },
    ///analys
    analytic: '/v1/api/statistics/dashboard',

    ///report
    report: {
      get: '/v1/api/reports',
      put: (id: any) => `/v1/api/reports/${id}`,
      accept: (id: any) => `/v1/api/reports/accept/${id}`,
      warning: (id: any) => `/v1/api/reports/warning/${id}`,
      reject: (id: any) => `/v1/api/reports/reject/${id}`,
    },
  },

  register_package: {
    post: '/v1/api/registers',
    get: (id: any) => `/v1/api/registers/${id}/payment`,
    getDiscount: '/v1/api/registers/discount-percentage',
    currentPackage: '/v1/api/registers/my-register',
    extendPackage: '/v1/api/registers/extend',

    suggestPackage: '/v1/api/registers/upgradable-packages',
    upgrade_package: (id: any) => `/v1/api/registers/upgrade?packageId=${id}`,
    userGetPackageHistory: '/v1/api/registers/history',
    allTransactionPackage: '/v1/api/registers/history/all',
  },
};

const goEndPoint = {
  /// get all butler's residence
  butler_residence: '/residences/housekeeper',
  butler_booking: `/booking/housekeeper`,
  update_checkin: `/booking/checkin`,
  update_checkout: `/booking/checkout`,
  all_residence: '/residences',
  butler_add_residence: '/v1/api/housekeepers/add-residence',
  addCharge: '/booking/additional_charge',
  uploadFileCheckIn: '/booking/housekeeper_transaction',

  chat: {
    getListConversion: '/chats/groups',
    listMessage: (id: any) => `/chats/groups/${id}/messages`,
    sendMessage: '/chats/messages',
  },

  analytic: {
    host: '/booking/statistics/host',
    host_top_residence: '/residences/top_residence',
    host_sold_residence: '/booking/sold_residences',
    top_seller: '/residences/top_seller',
    seller: '/booking/statistics',
  },
};

export { endPoint, javaUrl, goApi, goEndPoint };

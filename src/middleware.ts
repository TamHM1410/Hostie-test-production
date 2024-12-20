import { withAuth } from "next-auth/middleware";


export default withAuth({
    pages: {
      signIn: "/auth/jwt/login", 
    },
  });

  export const config = {
    matcher: ["/dashboard/booking-service","/dashboard","/dashboard/analytics"
      ,"/logout","/dashboard/user/account","/pricing","/pricing/checkout",
      "/dashboard/booking-list","/dashboard/hold-residences-list","/dashboard/manage-customer",
    "/dashboard/report-list","/dashboard/chat","/dashboard/user/account/","/dashboard/yourpackage","/dashboard/housekeepers"], // Protect the /protected route
  };
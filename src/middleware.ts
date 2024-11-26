import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
      signIn: "/auth/jwt/login", // Redirect to your custom sign-in page
    },
  });

  export const config = {
    matcher: ["/dashboard","/logout","/dashboard/user/account","/pricing","/pricing/checkout"], // Protect the /protected route
  };
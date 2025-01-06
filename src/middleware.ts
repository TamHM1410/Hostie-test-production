import { withAuth } from "next-auth/middleware";


export default withAuth({
    pages: {
      signIn: "/auth/jwt/login", 
    },
  });

  export const config = {
      matcher: ["/dashboard(.*)"]
  };
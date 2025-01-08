import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

interface CustomCredentials {
  username: string;
  password: string;
  id?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
  token?: string;
  status?: string;
  urlAvatar?: string;
}

interface JWTToken {
  username: string;
  password: string;
  id?: string;
  email?: string;
  isActive?: boolean;
  roles?: string[];
  token?: string;
  status?: string;
  urlAvatar?: string;
}
var flg = 0;
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Custom API',
      credentials: {
        username: {
          label: 'username',
          type: 'text',
          placeholder: 'Enter your username',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const creds = credentials as CustomCredentials;

          const user = {
            username: creds.username,
            id: creds.id,
            email: creds.email,
            isActive: creds.isActive,
            roles: creds.roles,
            token: creds.token,
            status: creds.status,
            urlAvatar: creds.urlAvatar,
          };

          if (user) {
            return user; // Any object returned will be saved in `user` property of the JWT
          } else {
            return null; // Return null to display an error message
          }
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Type the token to JWTToken

      const jwtToken: JWTToken | any = { ...token, ...user };
      return jwtToken;
    },
    async session({ session, token }) {
      const jwtToken = token as JWTToken | any;

      // Type the token as JWTToken

      if (jwtToken) {
        session.user = {
          ...session.user,
          id: jwtToken.id,
          isActive: jwtToken.isActive,
          roles: jwtToken.roles,
          token: jwtToken.token,
          status: jwtToken.status,
          urlAvatar: jwtToken.urlAvatar,
          name: jwtToken.username,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/jwt/login',
  },
  session: {
    maxAge: 24 * 60 * 60, // Phiên có hiệu lực trong 24 giờ
    updateAge: 12 * 60 * 60, // Làm mới token mỗi 12 giờ
  },
};

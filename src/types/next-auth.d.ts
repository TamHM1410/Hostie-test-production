// next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string |undefined |null;
      email?: string | null;
      name?: string | null;
      urlAvatar?: string | null | undefined;
      isActive?: boolean;
      roles?: string[];
      token?: string;
      status?: string;
    };
  }

  interface User {
    id?: string |undefined |null;
    email?: string | null;
    name?: string | null;
    urlAvatar?: string | null | undefined;
    isActive?: boolean;
    roles?: string[];
    token?: string;
    status?: string;
  }
}

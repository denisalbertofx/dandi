import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSupabaseClient } from './supabase/server';

interface User {
  id: string;
  apiKey: string;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    apiKey: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "API Key",
      credentials: {
        apiKey: { label: "API Key", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.apiKey) {
          return null;
        }

        try {
          // Obtener el cliente Supabase centralizado
          const supabase = getServerSupabaseClient();

          const { data, error } = await supabase
            .from('api_keys')
            .select('id, key')
            .eq('key', credentials.apiKey)
            .eq('is_active', true)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error validando API key:', error);
            return null;
          }

          if (data) {
            return {
              id: data.id.toString(),
              apiKey: data.key
            } as User;
          }

          return null;
        } catch (error) {
          console.error('Error en authorize:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.apiKey = user.apiKey;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.apiKey = token.apiKey;
      }
      return session;
    }
  }
}; 
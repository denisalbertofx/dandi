import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zknrpqrxiqmgsxfhjjtx.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprbnJwcXJ4aXFtZ3N4ZmhqanR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI0NDgyMzMsImV4cCI6MjAyODAyNDIzM30.YL4NuCzs5D-DTOhT-9N4yQbXxkEQFIvWMTe5PMwEMWQ';

// Cliente de Supabase optimizado para el servidor
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
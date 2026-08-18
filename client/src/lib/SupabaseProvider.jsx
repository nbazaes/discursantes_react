import React, { createContext, useContext, useMemo } from 'react';
import { useSession } from '@clerk/react';
import { createClerkSupabaseClient } from './supabaseClient';

const SupabaseContext = createContext(null);

const DEV_ORIGINS = import.meta.env.DEV ? ['http://localhost:3000'] : [];
const AUTHORIZED_PARTIES = ['https://discursantes.nbazaes.app', ...DEV_ORIGINS];

export function SupabaseProvider({ children }) {
  const { session } = useSession();
  const supabase = useMemo(
    () => createClerkSupabaseClient(() => session?.getToken({ authorizedParties: AUTHORIZED_PARTIES })),
    [session]
  );

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const supabase = useContext(SupabaseContext);
  if (!supabase) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return supabase;
}

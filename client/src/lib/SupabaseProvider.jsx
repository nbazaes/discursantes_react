import React, { createContext, useContext, useMemo } from 'react';
import { useSession } from '@clerk/react';
import { createClerkSupabaseClient } from './supabaseClient';

const SupabaseContext = createContext(null);

export function SupabaseProvider({ children }) {
  const { session } = useSession();
  const supabase = useMemo(
    () => createClerkSupabaseClient(() => session?.getToken({ authorizedParties: ['https://discursantes.nbazaes.app', 'http://localhost:5173'] })),
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

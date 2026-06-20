import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';

export function useAuth() {
  const activeAccount = useActiveAccount();
  const [ncbUser, setNcbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flokiBalance, setFlokiBalance] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    
    async function syncSession() {
      try {
        // 1. Get NCB session (Web2)
        const sessionRes = await fetch("/api/auth/get-session", { credentials: "include" });
        const sessionData = await sessionRes.json();
        
        let hasNcbUser = false;
        if (sessionData?.user) {
          if (isMounted) setNcbUser(sessionData.user);
          hasNcbUser = true;
        }

        // 2. Sync with database if logged in via Web2 or Web3
        if (hasNcbUser || activeAccount) {
          const syncRes = await fetch("/api/sync-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              wallet_address: activeAccount?.address || null 
            })
          });
          
          if (syncRes.ok) {
            const syncData = await syncRes.json();
            if (isMounted && syncData.floki !== undefined) {
              setFlokiBalance(syncData.floki);
            }
          }
        }
      } catch (error) {
        console.error("Failed to sync session", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncSession();

    return () => { isMounted = false; };
  }, [activeAccount?.address]); // re-run if wallet address changes

  return { 
    activeAccount, 
    ncbUser, 
    loading, 
    isOffChain: ncbUser && !activeAccount,
    flokiBalance
  };
}

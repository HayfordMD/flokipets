import { useEffect, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useAppState } from '@/lib/globalState';

export function useAuth() {
  const activeAccount = useActiveAccount();
  const [ncbUser, setNcbUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [flokiBalance, setFlokiBalance] = useState<number>(0);
  const { shouldRefreshAuth } = useAppState();

  useEffect(() => {
    let isMounted = true;
    
    async function syncSession() {
      try {
        // 1. Get NCB session (Web2)
        const sessionRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/auth/get-session`, { credentials: "include" });
        let sessionData = null;
        
        const contentType = sessionRes.headers.get("content-type");
        if (sessionRes.ok && contentType && contentType.includes("application/json")) {
          sessionData = await sessionRes.json();
        } else if (!sessionRes.ok) {
          console.warn("Session fetch failed with status:", sessionRes.status);
        }

        let hasNcbUser = false;
        if (sessionData?.user) {
          if (isMounted) setNcbUser(sessionData.user);
          hasNcbUser = true;
        } else {
          if (isMounted) setNcbUser(null);
        }

        // 2. Sync with database if logged in via Web2 or Web3
        if (hasNcbUser || activeAccount) {
          const syncRes = await fetch(`${process.env.EXPO_PUBLIC_API_URL || ''}/api/sync-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              wallet_address: activeAccount?.address || null 
            })
          });
          
          if (syncRes.ok) {
            const syncContentType = syncRes.headers.get("content-type");
            if (syncContentType && syncContentType.includes("application/json")) {
              const syncData = await syncRes.json();
              if (isMounted && syncData.floki !== undefined) {
                setFlokiBalance(syncData.floki);
              }
            }
          }
        }
      } catch (error) {
        console.error("Failed to sync session:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncSession();

    return () => { isMounted = false; };
  }, [activeAccount, activeAccount?.address, shouldRefreshAuth]); // re-run if wallet address changes or auth refresh triggered

  const isAdmin = 
    ncbUser?.is_admin === true ||
    ncbUser?.is_admin === 1 ||
    ncbUser?.email === 'mdhayford@gmail.com' ||
    ncbUser?.name === 'Mark Hayford' ||
    ncbUser?.id === '1D1vc6GsXTpQEUO6vYgqryoCcdOnLcln' ||
    (activeAccount?.address && activeAccount.address.toLowerCase() === 'bc1q54rhehxtwsalrwfc3qldtprved5cj5nvqdtwc4'.toLowerCase()) ||
    (activeAccount?.address && activeAccount.address.toLowerCase() === '0x036512B25B7b0ac0D7DDdcAEA74ADF55e9A91365'.toLowerCase());

  return { 
    activeAccount, 
    ncbUser, 
    loading, 
    isOffChain: ncbUser && !activeAccount,
    flokiBalance,
    isAdmin
  };
}

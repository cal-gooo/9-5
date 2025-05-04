import { create } from "zustand";
import { NDKNWCWallet } from "@nostr-dev-kit/ndk-wallet";
import { ndk } from "../../ndk";

interface WalletStore {
  wallet: NDKNWCWallet | null; // The current wallet instance
  transactions: any[]; // The list of transactions
  setWallet: (wallet: NDKNWCWallet) => void; // Function to set the wallet
  restoreWallet: (pairingCode: string) => NDKNWCWallet; // Function to restore the wallet
  setTransactions: (transactions: any[]) => void;
}
export const useWalletStore = create<WalletStore>((set) => ({
  wallet: null,
  transactions: [],
  setWallet: (wallet: NDKNWCWallet) => set({ wallet }),
  setTransactions: (transactions) => set({ transactions }),
  restoreWallet: (pairingCode: string) => {
    const wallet = new NDKNWCWallet(ndk, {
      pairingCode,
      timeout: 30000,
    });
    set({ wallet });
    return wallet;
  },
}));

import { create } from "zustand";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";

// Define the type for the Zustand store
interface SignerStore {
  signer: NDKPrivateKeySigner | null; // The current signer (can be null if not set)
  privateKey: string | null; // The decrypted private key (optional)
  setSigner: (signer: NDKPrivateKeySigner) => void; // Function to set the signer
}

export const useCurrentSigner = create<SignerStore>((set) => ({
  signer: null,
  privateKey: null,

  // Set the signer in the store
  setSigner: (signer: NDKPrivateKeySigner) => set({ signer }),
}));

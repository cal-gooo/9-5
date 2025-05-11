import {
  useNDKSessionLogin,
  NDKSessionLocalStorage,
  useNDKCurrentUser,
} from "@nostr-dev-kit/ndk-hooks";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { useCallback } from "preact/hooks";
import React, { Suspense } from "preact/compat";
import { useSignal } from "@preact/signals";
const Lime = React.lazy(
  () => import("../../assets/illustrations/lime.svg?react"),
);
type GeneratedKey = {
  privateKey: string;
  publicKey: string;
  nsec: string;
  npub: string;
};

export function Login() {
  const login = useNDKSessionLogin();
  const generatedKey = useSignal<GeneratedKey | null>(null);
  const localStorage = new NDKSessionLocalStorage();
  const currentUser = useNDKCurrentUser();

  const handleLogin = useCallback(async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      if (!clipboardText) {
        alert("Clipboard is empty. Please copy your private key first.");
        return;
      }

      const signer = new NDKPrivateKeySigner(clipboardText);
      await login(signer);
      alert("Logged in successfully!");
      // Serialize the signer
      const payloadString = signer.toPayload();

      // Store the payload string (e.g., in localStorage)
      localStorage.setItem("currentUserSigner", payloadString);
    } catch (error) {
      console.error("Failed to log in:", error);
      alert("Failed to log in. Please check if your private key is correct.");
    }
  }, [login]);

  const handleGenerateKey = useCallback(async () => {
    try {
      const signer = NDKPrivateKeySigner.generate();
      const privateKey = signer.privateKey!;
      const publicKey = signer.pubkey;
      const nsec = signer.nsec;
      const npub = signer.userSync.npub;

      generatedKey.value = { privateKey, publicKey, nsec, npub };

      // Automatically copy the private key to the clipboard
      await navigator.clipboard.writeText(nsec);

      // Notify the user
      alert(
        `New key pair generated!\n\nYour private key has been copied to the clipboard. Please paste it somewhere safe.`,
      );

      // Log in with the new signer
      await login(signer);
      alert("Logged in successfully!");
      // Serialize the signer
      const payloadString = signer.toPayload();

      // Store the payload string (e.g., in localStorage)
      localStorage.setItem("currentUserSigner", payloadString);
    } catch (error) {
      console.error("Failed to generate key pair:", error);
      alert("Failed to generate key pair.");
    }
  }, [login]);
  if (!currentUser) {
    return (
      <div className="flex flex-col justify-center items-center text-center py-30 bg-sky-800">
        <Suspense
          fallback={<div className="text-center text-gray-500">Loading...</div>}
        >
          <Lime className="w-50 h-50 mb-20" />
        </Suspense>

        <h2 className="text-4xl mb-20 font-serif text-lime-500">9 - 5</h2>

        {!generatedKey.value && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => handleLogin()}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-serif"
              >
                Paste Nostr Private Key
              </button>
            </div>
            <div>
              <button
                onClick={() => handleGenerateKey()}
                className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600 font-serif"
              >
                Create New Nostr Key
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

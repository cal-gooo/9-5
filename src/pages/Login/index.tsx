import CryptoJS from "crypto-js";
import {
  useNDKSessionLogin,
  useNDKCurrentUser,
  NDKSessionLocalStorage,
} from "@nostr-dev-kit/ndk-hooks";
import { NDKPrivateKeySigner } from "@nostr-dev-kit/ndk";
import { useCallback, useEffect, useState } from "preact/hooks";
import { useCurrentSigner } from "../../store/signer";
import React, { Suspense } from "preact/compat";
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
  const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);
  const currentUser = useNDKCurrentUser();
  const [loading, setLoading] = useState(true);
  const setSigner = useCurrentSigner((state) => state.setSigner);
  const localStorage = new NDKSessionLocalStorage();

  // Encrypt the private key
  const encryptPrivateKey = (privateKey: string, password: string): string => {
    return CryptoJS.AES.encrypt(privateKey, password).toString();
  };

  // Save the signer to localStorage
  const saveSignerToLocalStorage = (
    signer: NDKPrivateKeySigner,
    password: string,
  ) => {
    const encryptedKey = encryptPrivateKey(signer.nsec!, password);
    localStorage.setItem("encryptedPrivateKey", encryptedKey);
  };

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
      setSigner(signer);

      // Save the signer to localStorage
      const password = prompt("Enter a password to secure your private key:");
      if (password) {
        saveSignerToLocalStorage(signer, password);
        alert("Private key saved securely.");
      }
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

      setGeneratedKey({ privateKey, publicKey, nsec, npub });

      // Automatically copy the private key to the clipboard
      await navigator.clipboard.writeText(nsec);

      // Notify the user
      alert(
        `New key pair generated!\n\nYour private key has been copied to the clipboard. Please paste it somewhere safe.`,
      );

      // Log in with the new signer
      await login(signer);
      alert("Logged in successfully!");
      setSigner(signer);

      // Save the signer to localStorage
      const password = prompt("Enter a password to secure your private key:");
      if (password) {
        saveSignerToLocalStorage(signer, password);
        alert("Private key saved securely.");
      }
    } catch (error) {
      console.error("Failed to generate key pair:", error);
      alert("Failed to generate key pair.");
    }
  }, [login]);

  useEffect(() => {
    if (currentUser !== null) {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading && currentUser !== null) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen text-center overflow-hidden">
      <Suspense
        fallback={<div className="text-center text-gray-500">Loading...</div>}
      >
        <Lime className="w-50 h-50 mb-20" />
      </Suspense>

      <h2 className="text-4xl mb-20 font-serif text-lime-500">9 - 5</h2>

      {!generatedKey && (
        <div>
          <div className="mb-6">
            <button
              onClick={() => handleLogin()}
              className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 font-serif"
            >
              Login with Nostr Key
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

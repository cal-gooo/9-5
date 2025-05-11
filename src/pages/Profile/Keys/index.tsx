import {
  NDKPrivateKeySigner,
  ndkSignerFromPayload,
  useNDKCurrentUser,
} from "@nostr-dev-kit/ndk-hooks";
import { ndk } from "../../../ndk";

export default function Keys() {
  const pubkey = useNDKCurrentUser()?.npub;
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getSigner = async () => {
    // Retrieve the stored payload string
    const storedPayload = localStorage.getItem("currentUserSigner");
    if (storedPayload) {
      try {
        // Deserialize the signer
        // Note: Pass 'ndk' if the signer might be NIP-46 or another type requiring it
        const restoredSigner = await ndkSignerFromPayload(storedPayload, ndk);

        // Successfully restored - use the signer
        ndk.signer = restoredSigner;
        console.log("Signer restored successfully!");
        const user = await restoredSigner?.user();
        console.log("Restored user pubkey:", user?.pubkey);
        return {
          npub: user?.pubkey,
          nsec: (restoredSigner as NDKPrivateKeySigner).nsec,
        };
      } catch (error) {
        console.error("Error during signer deserialization:", error);
      }
    } else {
      alert("No stored signer found.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-black">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Your Keys</h2>

        {/* Public Key */}
        <div className="mb-4">
          <label className="block text-gray-700">Public Key:</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={pubkey}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={() => copyToClipboard(pubkey!)}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Private Key */}
        <div>
          <label className="block text-gray-700">Private Key:</label>
          <div className="flex items-center space-x-2 ">
            <input
              type="password"
              value={"Private Key"}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            <button
              onClick={async () => {
                const result = await getSigner();
                if (result?.nsec) {
                  copyToClipboard(result.nsec);
                } else {
                  alert("Private key not found.");
                }
              }}
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

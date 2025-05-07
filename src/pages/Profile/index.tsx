import { useNDKSessionLogout } from "@nostr-dev-kit/ndk-hooks";
import CryptoJS from "crypto-js";

export default function Profile() {
  const logout = useNDKSessionLogout();

  // Method to load the private key from localStorage
  const loadPrivateKeyFromLocalStorage = (password: string): string | null => {
    const encryptedKey = localStorage.getItem("encryptedPrivateKey");
    if (!encryptedKey) {
      console.warn("No encrypted private key found in localStorage.");
      return null;
    }

    try {
      // Decrypt the private key using the provided password
      const privateKey = CryptoJS.AES.decrypt(encryptedKey, password);

      if (!privateKey) {
        throw new Error(
          "Decryption failed. Invalid password or corrupted data.",
        );
      }

      console.log("Private key loaded successfully.");
      return privateKey.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Failed to decrypt private key:", error);
      alert("Failed to decrypt private key. Please check your password.");
      return null;
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.clear();
    console.log("User logged out successfully");
  };

  const settings = [
    { id: 1, name: "Edit Profile", action: () => console.log("Edit Profile") },
    {
      id: 2,
      name: "See private key",
      action: () => {
        const password = prompt(
          "Enter your password to decrypt the private key:",
        );
        if (password) {
          const privateKey = loadPrivateKeyFromLocalStorage(password);
          if (privateKey) {
            alert(`Your private key is: ${privateKey}`);
          }
        }
      },
    },
    {
      id: 3,
      name: "Privacy Settings",
      action: () => console.log("Privacy Settings"),
    },
    { id: 4, name: "Logout", action: () => handleLogout() },
  ];

  return (
    <div className="min-h-screen bg-sky-800 p-4">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="https://t3.ftcdn.net/jpg/07/24/59/76/360_F_724597608_pmo5BsVumFcFyHJKlASG2Y2KpkkfiYUU.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full shadow-md"
        />
        <h1 className="text-xl font-bold mt-4 text-gray-800">John Doe</h1>
      </div>

      {/* Settings List */}
      <ul className="space-y-4">
        {settings.map((setting) => (
          <li
            key={setting.id}
            onClick={setting.action}
            className="bg-white p-4 rounded-md shadow hover:bg-gray-50 cursor-pointer transition"
          >
            <p className="text-gray-800 font-medium">{setting.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

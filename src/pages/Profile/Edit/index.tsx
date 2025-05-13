import NDKBlossom from "@nostr-dev-kit/ndk-blossom";
import { ndk } from "../../../ndk";
import {
  useNDKCurrentPubkey,
  useProfileValue,
  useSetProfile,
} from "@nostr-dev-kit/ndk-hooks";

export default function EditProfile() {
  // Create NDKBlossom instance
  const blossom = new NDKBlossom(ndk as any);
  const pubKey = useNDKCurrentPubkey();
  console.log("pubKey", pubKey);
  // Get the current profile
  const profile = useProfileValue(pubKey);
  console.log("picture", profile);
  // Get the updater function
  const setProfile = useSetProfile();

  async function uploadFile() {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const fileToUpload = fileInput.files?.[0];
    if (fileToUpload) {
      // Handle upload failures
      blossom.onUploadFailed = (error) => console.error(error);
      // Upload the file
      const imeta = await blossom.upload(fileToUpload, { maxRetries: 3 });
      console.log("File uploaded:", imeta);
      // Track upload progress (especially useful for large files)
      blossom.onUploadProgress = (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        console.log(`Upload progress: ${percentage}%`);
        return "continue";
      };

      // console.log(await blossom.getServerList());

      await handleUpdateProfilePicture(imeta.url!);

      // Convert the imeta object to a proper tag for nostr events
      // const imetaTag = imetaTagToTag(imeta);

      // Use the URL in a nostr note
      // const note = await ndk.publish({
      // 	kind: 1,
      // 	content: `Check out this file: ${imeta.url}`,
      // 	tags: [imetaTag], // Use the properly formatted imeta tag
      // });
    }
  }

  // Save the updated profile
  const handleUpdateProfilePicture = async (url: string) => {
    await setProfile({ ...profile, picture: url, image: url });
    console.log("Profile updated:", { ...profile, picture: url });
  };

  return (
    <div className="bg-sky-800">
      <div className="p-4 pt-20 pb-20">
        <h1 className="text-2xl font-bold text-white">Edit Profile</h1>
        {/* // Profile Picture, user can upload a new one */}
        <div className="flex items-center mt-4">
          <img
            src={profile?.picture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full shadow-md"
          />
          <input
            type="file"
            accept="image/*"
            className="ml-4 p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-500"
            id={"fileInput"}
          />
        </div>
        {/* Upload button */}
        <div className="mt-4">
          <button
            onClick={uploadFile}
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-500"
          >
            Upload
          </button>
        </div>
        <form className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-sky-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-300"
            >
              Bio
            </label>
            <textarea
              id="bio"
              rows={4}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-sky-500"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 focus:outline-none focus:ring focus:ring-sky-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

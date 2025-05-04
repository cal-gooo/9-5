import { useState } from "preact/hooks";
import BackButton from "../../components/Back";

export default function Post() {
  const [postContent, setPostContent] = useState("");

  const handlePostSubmit = () => {
    if (postContent.trim() === "") {
      alert("Post content cannot be empty!");
      return;
    }
    console.log("Post submitted:", postContent);
    // Add logic to save the post (e.g., API call)
    setPostContent(""); // Clear the textarea after submission
  };
  return (
    <div className="h-screen bg-gray-100 p-4 flex flex-col items-center">
      {/* Back Button */}
      <BackButton />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Write a Post</h1>
      <textarea
        value={postContent}
        onChange={(e) =>
          setPostContent((e.target as HTMLTextAreaElement)?.value || "")
        }
        placeholder="What's on your mind?"
        className="w-full max-w-2xl h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 resize-none"
      ></textarea>
      <button
        onClick={handlePostSubmit}
        className="mt-4 px-6 py-3 bg-lime-500 text-white font-bold rounded-md shadow-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2"
      >
        Post
      </button>
    </div>
  );
}

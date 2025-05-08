import { Reaction } from "../Reaction";
import { reactions } from "../../mock/mockReactions";
interface HomeGridProps {
  title: string;
  content: string;
  profilePic: string; // URL for the user's profile picture
}

export default function HomeGrid({
  title,
  content,
  profilePic,
}: HomeGridProps) {
  const truncatedContent =
    content.length > 150 ? `${content.slice(0, 150)}...` : content;
  return (
    <div className="relative bg-sky-800 rounded-xl flex flex-col justify-between h-full px-4 pt-4 pb-2">
      {/* User Profile Picture */}
      <img
        src={profilePic}
        alt="User Profile"
        className="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-gray-300"
      />

      {/* Title */}
      <h2 className="text-lg font-semibold mb-2 text-white">{title}</h2>

      {/* Content */}
      <p className="text-sm mb-2">{truncatedContent}</p>

      {/* Reaction Icons */}
      <div className="grid grid-cols-2 mt-auto pt-2 gap-2">
        {reactions.map((reaction: any) => (
          <Reaction
            Reaction={reaction}
            key={reaction.id}
            onClick={() => {
              // handle reaction click here
              console.log(`Reaction clicked: ${reaction.name}`);
            }}
          />
        ))}
      </div>
    </div>
  );
}

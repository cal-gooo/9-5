type ReactionProps = {
  Reaction: {
    id: string;
    emoji: string;
    name: string;
  };
  onClick: () => void;
};

export function Reaction({ Reaction, onClick }: ReactionProps) {
  return (
    <button
      className="inline-flex items-center space-x-1 text-gray-500 hover:text-lime-500 bg-sky-800 px-3 py-1 rounded-full border-1 hover:bg-gray-300 transition text-xs"
      onClick={onClick}
    >
      <span>{Reaction.emoji}</span>
    </button>
  );
}

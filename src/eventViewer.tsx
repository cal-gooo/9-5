// src/components/EventViewer.tsx
import { useSubscribe, useProfileValue } from "@nostr-dev-kit/ndk-hooks";

const cleanImageUrl = (url: string): string => {
  return url.replace(/^url\s*/i, "").trim();
};

function EventViewer() {
  // Fetch follower counts using `useSubscribe`
  const { events: followerEvents } = useSubscribe([{ kinds: [3] }]); // Kind 3 = contacts/followers

  // Calculate the highest follower public key
  const highestFollowerPubkey = (() => {
    const followerCounts: Record<string, number> = {};

    followerEvents.forEach((event) => {
      event.tags.forEach((tag) => {
        if (tag[0] === "p") {
          const pubkey = tag[1];
          followerCounts[pubkey] = (followerCounts[pubkey] || 0) + 1;
        }
      });
    });

    // Find the public key with the highest followers
    const sorted = Object.entries(followerCounts).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? sorted[0][0] : null;
  })();

  // Fetch profile for the highest follower public key
  const profile = useProfileValue(highestFollowerPubkey || "");

  return (
    <div>
      <h3>Highest Follower Profile</h3>
      {highestFollowerPubkey ? (
        <div>
          <img
            src={cleanImageUrl(profile?.picture || "/default-avatar.png")}
            alt={profile?.name || "Anonymous"}
            width={50}
            height={50}
            style={{ borderRadius: "50%" }}
          />
          <h4>{profile?.name || "Anonymous"}</h4>
          <p>Public Key: {highestFollowerPubkey}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default EventViewer;

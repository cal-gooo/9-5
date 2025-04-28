// src/components/UserCard.tsx
import { useProfileValue } from '@nostr-dev-kit/ndk-hooks';
import { useEffect, useState } from 'react';
import { useNDK } from '@nostr-dev-kit/ndk-hooks';

interface UserCardProps {
    pubkey: string;
}

export default function UserCard({ pubkey }: UserCardProps) {
    const profile = useProfileValue(pubkey, {
        refresh: false,
        subOpts: {},
    });

    const [userPosts, setUserPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { ndk } = useNDK();

    useEffect(() => {
        if (!ndk) {
            console.error('NDK is not initialized');
            setLoading(false);
            return;
        }

        const fetchPosts = async () => {
            try {
                setLoading(true);
                const postFilter = { authors: [pubkey], kinds: [1] };
                const deletionFilter = { authors: [pubkey], kinds: [5] };

                const postSubscription = ndk.subscribe(postFilter);
                const deletionSubscription = ndk.subscribe(deletionFilter);

                const posts: any[] = [];
                const deleted: Set<string> = new Set();

                postSubscription.on('event', (event) => {
                    posts.push(event);
                });

                deletionSubscription.on('event', (event) => {
                    event.tags
                        .filter((tag) => tag[0] === 'e')
                        .forEach((tag) => deleted.add(tag[1]));
                });

                postSubscription.on('eose', () => {
                    setUserPosts(posts.filter((post) => !deleted.has(post.id)));
                    setLoading(false);
                });

                deletionSubscription.on('eose', () => {
                    console.log('Fetched deleted event IDs:', Array.from(deleted));
                });

                return () => {
                    postSubscription.stop();
                    deletionSubscription.stop();
                };
            } catch (error) {
                console.error('Failed to fetch posts or deletions:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [ndk, pubkey]);

    return (
        <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
            {loading ? (
                <div className="text-center text-theme">Loading...</div>
            ) : (
                <>
                    <img
                        src={profile?.picture || '/default-avatar.png'}
                        alt={profile?.name || 'User Avatar'}
                        className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-theme"
                    />
                    <h2 className="text-xl font-bold text-center text-theme">
                        {profile?.displayName || profile?.name || 'Anonymous'}
                    </h2>
                    <p className="text-gray-600 text-center">{profile?.about}</p>

                    {profile?.nip05 && (
                        <p className="text-gray-500 text-center mt-2">NIP-05: {profile.nip05}</p>
                    )}

                    <h3 className="text-lg font-semibold mt-6 text-theme">User Posts</h3>
                    {userPosts.length > 0 ? (
                        <ul className="mt-4 space-y-4">
                            {userPosts.map((post) => (
                                <li
                                    key={post.id}
                                    className="p-4 rounded-md shadow-sm border-l-4 hover:bg-sky-800 transition duration-200 font-serif text-white"
                                >
                                    <p className="">{post.content}</p>
                                    <small className=" block mt-2">
                                        Posted at:{' '}
                                        {new Date(post.created_at! * 1000).toLocaleString()}
                                    </small>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">No posts found.</p>
                    )}
                </>
            )}
        </div>
    );
}

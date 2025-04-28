import {
    useNDKSessionLogin,
    useNDKCurrentUser,
} from '@nostr-dev-kit/ndk-hooks';
import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useCallback, useEffect, useState } from 'preact/hooks';

type GeneratedKey = {
    privateKey: string;
    publicKey: string;
    nsec: string;
    npub: string;
};

export function Signin() {
    const login = useNDKSessionLogin();
    const [input, setInput] = useState('');
    const [generatedKey, setGeneratedKey] = useState<GeneratedKey | null>(null);
    const currentUser = useNDKCurrentUser();
    const [loading, setLoading] = useState(true);

    const handleLogin = useCallback(async () => {
        try {
            if (!input) {
                alert('Please enter a private key.');
                return;
            }
            const signer = new NDKPrivateKeySigner(input);
            await login(signer);
            alert('Logged in successfully!');
        } catch (error) {
            console.error('Failed to log in:', error);
            alert('Failed to log in. Please check your private key.');
        }
    }, [input, login]);

    const handleGenerateKey = useCallback(() => {
        try {
            const signer = NDKPrivateKeySigner.generate();
            const privateKey = signer.privateKey!;
            const publicKey = signer.pubkey;
            const nsec = signer.nsec;
            const npub = signer.userSync.npub;

            setGeneratedKey({ privateKey, publicKey, nsec, npub });

            alert('New key pair generated! Please save your private key securely.');
        } catch (error) {
            console.error('Failed to generate key pair:', error);
            alert('Failed to generate key pair.');
        }
    }, []);

    const handleInput = (e) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        if (currentUser !== null) {
            setLoading(false);
        }
    }, [currentUser]);

    if (loading) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto text-center">
            {!currentUser ? (
                <>
                    <h2 className="text-2xl font-bold mb-4">Welcome to 9-5 App</h2>
                    <p className="text-gray-600 mb-6">
                        Login with your Nostr private key or create a new one.
                    </p>
                    <div className="mb-6">
                        <input
                            onChange={(e) => handleInput(e)}
                            type="password"
                            placeholder="Enter your private key"
                            className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => handleLogin()}
                            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Login with Nostr Key
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => handleGenerateKey()}
                            className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        >
                            Generate New Nostr Key
                        </button>
                    </div>
                    {generatedKey && (
                        <div className="mt-6 text-left">
                            <h4 className="text-lg font-bold mb-2">Generated Key Pair:</h4>
                            <p className="mb-2">
                                <strong>Public Key (npub):</strong> {generatedKey.npub}
                            </p>
                            <p className="mb-2">
                                <strong>Private Key (nsec):</strong> {generatedKey.nsec}
                            </p>
                            <p className="text-red-500 mb-4">
                                Save your private key securely. It will not be shown again.
                            </p>
                            <button
                                onClick={() => navigator.clipboard.writeText(generatedKey.nsec)}
                                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2"
                            >
                                Copy Private Key
                            </button>
                            <button
                                onClick={async () => {
                                    const signer = new NDKPrivateKeySigner(generatedKey.nsec);
                                    await login(signer);
                                    alert('Logged in successfully with the generated key!');
                                }}
                                className="w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                            >
                                Log in with Generated Key
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Welcome Back!</h2>
                    <p className="text-gray-600 mb-2">Logged in as:</p>
                    <p className="text-gray-800 font-mono">
                        <strong>Public Key:</strong> {currentUser.pubkey}
                    </p>
                </div>
            )}
        </div>
    );
}

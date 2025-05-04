import {
	useNDKSessionLogin,
	useNDKCurrentUser,
} from '@nostr-dev-kit/ndk-hooks';
import { NDKPrivateKeySigner } from '@nostr-dev-kit/ndk';
import { useCallback, useEffect, useState } from 'preact/hooks';
import Lime from '../../assets/illustrations/lime.svg?react';

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

	const handleLogin = useCallback(async () => {
		try {
			const clipboardText = await navigator.clipboard.readText();
			if (!clipboardText) {
				alert('Clipboard is empty. Please copy your private key first.');
				return;
			}

			const signer = new NDKPrivateKeySigner(clipboardText);
			await login(signer);
			alert('Logged in successfully!');
		} catch (error) {
			console.error('Failed to log in:', error);
			alert('Failed to log in. Please check your private key.');
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
				`New key pair generated!\n\nYour private key has been copied to the clipboard. Please paste it somewhere safe.`
			);
		} catch (error) {
			console.error('Failed to generate key pair:', error);
			alert('Failed to generate key pair.');
		}
	}, []);

	useEffect(() => {
		if (currentUser !== null) {
			setLoading(false);
		}
	}, [currentUser]);

	if (loading && currentUser !== null) {
		return <div className='text-center text-gray-500'>Loading...</div>;
	}

	return (
		<div className='relative flex flex-col justify-center items-center h-screen text-center overflow-hidden'>
			<Lime className='w-50 h-50 mb-20' />
			<h2 className='text-4xl mb-20 font-serif text-lime-500'>9 - 5</h2>

			{!generatedKey && (
				<div>
					<div className='mb-6'>
						<button
							onClick={() => handleLogin()}
							className='w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
						>
							Login with Nostr Key
						</button>
					</div>
					<div>
						<button
							onClick={() => handleGenerateKey()}
							className='w-full p-2 bg-green-500 text-white rounded-md hover:bg-green-600'
						>
							Generate New Nostr Key
						</button>
					</div>
				</div>
			)}
			{generatedKey && (
				<div className='w-full max-w-sm mt-6 text-center'>
					<h4 className='text-lg font-bold mb-2'>Generated Key Pair:</h4>
					<p className='mb-2'>
						<strong>Public Key (npub):</strong> {generatedKey.npub}
					</p>
					<p className='text-red-500 mb-4'>
						Save your private key securely. It has been copied to your
						clipboard.
					</p>
					<div className='mb-6'>
						<button
							onClick={() => handleLogin()}
							className='w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
						>
							Login with Nostr Key
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

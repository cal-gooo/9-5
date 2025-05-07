import { useEffect, useState } from "preact/hooks";
import CryptoJS from "crypto-js";
import { NDKNWCWallet, NDKWalletStatus } from "@nostr-dev-kit/ndk-wallet";
import { ndk } from "../../ndk";
import { NDKSessionLocalStorage, useNDKWallet } from "@nostr-dev-kit/ndk-hooks";
import { useWalletStore } from "../../store/wallet";

export default function Wallet() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setActiveWallet, setBalance, activeWallet } = useNDKWallet();
  const { wallet, setWallet, transactions, setTransactions } = useWalletStore();
  const localStorage = new NDKSessionLocalStorage();
  const encryptedPrivateKey = localStorage.getItem("encryptedPrivateKey")!;
  // use random string as encryption key
  const encryptionKey = encryptedPrivateKey;
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) {
      return `${(num / 1_000_000_000).toFixed(1)}b`; // Convert to billions with one decimal place
    } else if (num >= 1_000_000) {
      return `${(num / 1_000_000).toFixed(1)}m`; // Convert to millions with one decimal place
    } else if (num >= 1_000) {
      return `${(num / 1_000).toFixed(1)}k`; // Convert to thousands with one decimal place
    }
    return num.toString(); // Return the number as is if it's less than 1,000
  };
  const encryptPairingCode = (
    pairingCode: string,
    encryptionKey: string,
  ): string => {
    return CryptoJS.AES.encrypt(pairingCode, encryptionKey).toString();
  };
  const decryptPairingCode = (
    encryptedCode: string,
    encryptionKey: string,
  ): string | null => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedCode, encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error("Failed to decrypt pairing code:", error);
      return null;
    }
  };

	// Decoupled wallet connection logic
	const connectWallet = async (pairingCode: string) => {
		try {
			// Initialize NWC wallet with the pairing code
			const wallet = new NDKNWCWallet(ndk, {
				pairingCode,
				timeout: 30000, // Optional timeout for operations
			});

			// Set up event listeners
			wallet.on('ready', () => {
				console.log('NWC wallet is ready for zapping');
			});

			wallet.on('balance_updated', (balance) => {
				console.log('Balance updated:', balance?.amount || 0, 'sats');
				setBalance(balance?.amount || 0);
			});

			// Assign wallet to NDK instance for zapping
			ndk.wallet = wallet;
			setActiveWallet(wallet);

			// Save wallet to Zustand store
			setWallet(wallet);
			const encryptedPairingCode = encryptPairingCode(
				pairingCode,
				encryptionKey
			);
			// Save pairing code to localStorage
			localStorage.setItem('ndkWalletPairingCode', encryptedPairingCode);

			// Wait for wallet to be ready
			if (wallet.status !== NDKWalletStatus.READY) {
				await new Promise<void>((resolve) => {
					wallet.once('ready', () => resolve());
				});
			}

			console.log('NWC wallet connected successfully');

			// Fetch and set transactions
			const fetchedTransactions = await wallet.listTransactions();
			setTransactions(fetchedTransactions.transactions);
		} catch (err) {
			console.error('Failed to connect wallet:', err);
			throw err;
		}
	};

	// Handle "Connect Wallet" button click
	const handleConnectWallet = async () => {
		setConnecting(true);
		setError(null);

		try {
			// Read the pairing code from the clipboard
			const pairingCode = await navigator.clipboard.readText();
			if (!pairingCode) {
				throw new Error(
					'Clipboard is empty. Please copy the pairing code first.'
				);
			}

			// Use the decoupled connectWallet function
			await connectWallet(pairingCode);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			} else {
				setError('Failed to connect wallet.');
			}
		} finally {
			setConnecting(false);
		}
	};
	const encryptedPairingCode = localStorage.getItem('ndkWalletPairingCode');
	// Reconnect wallet on page refresh
	useEffect(() => {
		if (wallet) {
			// Wallet already exists in Zustand store
			setActiveWallet(wallet);

			// Fetch and set transactions if not already loaded
			if (transactions.length === 0) {
				wallet
					.listTransactions()
					.then((result) => setTransactions(result.transactions));
			}
			return;
		} else {
			// Try to load wallet from localStorage

			if (encryptedPairingCode) {
				// Reconnect the wallet
				try {
					const pairingCode = decryptPairingCode(
						encryptedPairingCode,
						encryptionKey
					);
					if (!pairingCode) {
						throw new Error('Failed to decrypt pairing code.');
					}

					const restoredWallet = new NDKNWCWallet(ndk, {
						pairingCode: pairingCode,
						timeout: 30000,
					});

					// Set up event listeners for the restored wallet
					restoredWallet.on('ready', () => {
						console.log('Restored wallet is ready for zapping');
					});

					restoredWallet.on('balance_updated', (balance) => {
						setBalance(balance?.amount || 0);
					});

					ndk.wallet = restoredWallet;
					setActiveWallet(restoredWallet);
					setWallet(restoredWallet);

					// Fetch and set transactions
					restoredWallet
						.listTransactions()
						.then((result) => setTransactions(result.transactions));
					setConnecting(false);
				} catch (err) {
					console.error('Failed to reconnect wallet:', err);
				}
			}
		}
	}, []);

  if (activeWallet?.status === NDKWalletStatus.READY) {
    return (
      <div className="flex flex-col items-center bg-sky-800 pb-10 min-h-screen">
        <p className="mt-20 text-white">
          <span className="font-bold text-lime-500 text-8xl flex flex-col items-center">
            {formatNumber(Math.round(activeWallet?.balance?.amount || 0))}
            <span className="text-lg font-normal font-serif">sats</span>
          </span>
        </p>

        {/* Transactions List */}
        <div className="mt-8 w-full max-w-4xl px-4 pb-10">
          <h2 className="text-2xl font-bold font-serif text-white text-left">
            Transactions
          </h2>

          <div className={"mt-4"}>
            <ul className="mt-4 text-sky-800">
              {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                  <li
                    key={index}
                    className="mb-4 p-4 bg-gradient-to-r from-lime-500 to-green-500 rounded-xl shadow-lg"
                  >
                    <p>
                      <strong>Amount:</strong> {tx.amount} sats
                    </p>
                    <p>
                      <strong>Created at:</strong>{" "}
                      {new Date(tx.created_at * 1000).toLocaleString()}
                    </p>
                    <p>
                      <strong>Description:</strong> {tx.description || "N/A"}
                    </p>
                  </li>
                ))
              ) : (
                <p>No transactions found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

	if (!encryptedPairingCode) {
		return (
			<div className='flex flex-col items-center justify-center bg-sky-800 h-dvh'>
				<button
					className='px-8 py-4 bg-lime-500 text-white text-lg font-bold rounded-md shadow-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2'
					onClick={handleConnectWallet}
					disabled={connecting}
				>
					{connecting ? 'Connecting...' : 'Connect Wallet'}
				</button>
				<p className='mt-4 text-white'>
					Wallet needs to support Nostr Wallet Connect (NWC)
				</p>
				{error && <p className='mt-4 text-red-500'>{error}</p>}
			</div>
		);
	}

	return (
		<div
			className={
				'h-screen flex items-center justify-center text-5xl text-lime-500 font-serif'
			}
		>
			Loading wallet...
		</div>
	);
}

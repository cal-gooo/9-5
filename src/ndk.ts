// components/ndk.tsx
'use client';

// Here we will initialize NDK and configure it to be available throughout the application
import NDK from '@nostr-dev-kit/ndk';

// An optional in-browser cache adapter
import NDKCacheAdapterDexie from '@nostr-dev-kit/ndk-cache-dexie';
import {
	NDKSessionLocalStorage,
	useNDKInit,
	useNDKSessionMonitor,
} from '@nostr-dev-kit/ndk-hooks';
import { useEffect } from 'react';

// Define explicit relays or use defaults
const explicitRelayUrls = [
	'wss://relay.primal.net',
	'wss://nos.lol',
	'wss://purplepag.es',
];

// Setup Dexie cache adapter (Client-side only)
let cacheAdapter: NDKCacheAdapterDexie | undefined;
if (typeof window !== 'undefined') {
	cacheAdapter = new NDKCacheAdapterDexie({ dbName: '9-5' });
}

// Create the singleton NDK instance
const ndk = new NDK({ explicitRelayUrls, cacheAdapter });

// Connect to relays on initialization (client-side)
if (typeof window !== 'undefined') ndk.connect();

// Use the browser's localStorage for session storage
const sessionStorage = new NDKSessionLocalStorage();

/**
 * Use an NDKHeadless component to initialize NDK in order to prevent application-rerenders
 * when there are changes to the NDK or session state.
 *
 * Include this headless component in your app layout to initialize NDK correctly.
 * @returns
 */
export function NDKHeadless() {
	const initNDK = useNDKInit();

	useNDKSessionMonitor(sessionStorage, {
		profile: true, // automatically fetch profile information for the active user
		follows: true, // automatically fetch follows of the active user
	});

	useEffect(() => {
		if (ndk) initNDK(ndk);
	}, [initNDK]);

	return null;
}

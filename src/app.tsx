import { NDKEvent } from '@nostr-dev-kit/ndk';
import {
	useNDK,
	useNDKCurrentPubkey,
	useNDKSessionLogout,
	useNDKCurrentUser,
} from '@nostr-dev-kit/ndk-hooks';
import { useState } from 'preact/hooks';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';

function LogoutButton() {
	const logout = useNDKSessionLogout();
	const currentUser = useNDKCurrentUser();

	if (!currentUser) {
		return null; // No user is logged in
	}

	const handleLogout = () => {
		logout();
		console.log('User logged out successfully');
	};

	return (
		<button
			onClick={handleLogout}
			style={{
				marginTop: '20px',
				padding: '10px',
				backgroundColor: '#dc3545',
				color: '#fff',
				border: 'none',
				borderRadius: '5px',
				cursor: 'pointer',
			}}
		>
			Log Out
		</button>
	);
}

function App() {
	const { ndk } = useNDK();
	const [eventId, setEventId] = useState('');
	const pubkey = useNDKCurrentPubkey(); // Check if the user is signed in

	const onPublish = async () => {
		if (!ndk) {
			console.error('NDK is not initialized');
			return;
		}
		try {
			const event = new NDKEvent(ndk, { kind: 1, content: 'Blocking event' });
			const publishedToRelays = await event.publish();
			setEventId(event.id);
			if (publishedToRelays.size === 0) {
				console.warn('Event not published to any relays');
			} else {
				console.log('Published to relays:', publishedToRelays.values);
			}
		} catch (error) {
			console.error('Failed to publish event:', error);
		}
	};

	const onDeletePosts = async () => {
		if (!ndk || !pubkey) {
			console.error('NDK is not initialized or pubkey is not available');
			return;
		}
		try {
			const filter = { authors: [pubkey], kinds: [1] };
			const events = await ndk.fetchEvents(filter);
			const postsToDelete = Array.from(events).filter(
				(event) => event.content === 'Blocking event'
			);

			for (const post of postsToDelete) {
				const deleteEvent = new NDKEvent(ndk, {
					kind: 5,
					tags: [
						['e', post.id],
						['deleted', 'true'],
					],
					content: 'Deleted by user',
				});
				await deleteEvent.publish();
			}

			if (postsToDelete.length === 0) {
				console.log('No posts with content "Blocking event" found.');
			}

			const updatedEvents = await ndk.fetchEvents(filter);
			console.log('Updated posts:', updatedEvents);
		} catch (error) {
			console.error('Failed to delete posts:', error);
		}
	};

	// Conditionally render the Signin page or the main app content
	return (
		<Router>
			<div className='pb-16 bg-sky-800 text-white'>
				<Routes>
					<Route path='/page1' element={<HomePage />} />
					<Route path='/page2' element={<div>page 2</div>} />
					<Route path='/page3' element={<div>page 3</div>} />
				</Routes>
				<NavigationBar />
			</div>
		</Router>
	);
}

export default App;

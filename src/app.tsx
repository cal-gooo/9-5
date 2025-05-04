import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/Home';
import Wallet from './pages/Wallet';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Post from './pages/Post';
import { Login } from './pages/Login';
import { NDKHeadless } from './ndk';
import { useEffect, useState } from 'preact/hooks';
import { useNDKCurrentUser } from '@nostr-dev-kit/ndk-hooks';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false); // Replace with actual authentication logic
	const currentUser = useNDKCurrentUser();
	
	// Simulate checking login status (replace with real logic)
	useEffect(() => {
		setIsLoggedIn(!!currentUser);
	}, [currentUser]);
	return (
		<div>
			<NDKHeadless />
			<Router>
				<div className='min-h-screen bg-sky-800 text-white'>
					{!isLoggedIn ? (
						<Routes>
							<Route path='*' element={<Navigate to='/' />} />
							<Route path='/' element={<Login />} />
						</Routes>
					) : (
						<Routes>
							<Route path='*' element={<Navigate to='/home' />} />
							<Route path='/home' element={<HomePage />} />
							<Route path='/following' element={<div>following</div>} />
							<Route path='/wallet' element={<Wallet />} />
							<Route path='/post' element={<Post />} />
							<Route path='/messages' element={<Messages />} />
							<Route path='/profile' element={<Profile />} />
						</Routes>
					)}
					{isLoggedIn && <NavigationBar />}
				</div>
			</Router>
		</div>
	);
}

export default App;

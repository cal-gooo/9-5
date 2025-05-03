import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';

// function LogoutButton() {
// 	const logout = useNDKSessionLogout();
// 	const currentUser = useNDKCurrentUser();

// 	if (!currentUser) {
// 		return null; // No user is logged in
// 	}

// 	const handleLogout = () => {
// 		logout();
// 		console.log('User logged out successfully');
// 	};

// 	return (
// 		<button
// 			onClick={handleLogout}
// 			style={{
// 				marginTop: '20px',
// 				padding: '10px',
// 				backgroundColor: '#dc3545',
// 				color: '#fff',
// 				border: 'none',
// 				borderRadius: '5px',
// 				cursor: 'pointer',
// 			}}
// 		>
// 			Log Out
// 		</button>
// 	);
// }

function App() {
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

import { useNDKSessionLogout } from '@nostr-dev-kit/ndk-hooks';

export default function Profile() {
	const logout = useNDKSessionLogout();

	const handleLogout = () => {
		logout();
		console.log('User logged out successfully');
	};
	const settings = [
		{ id: 1, name: 'Edit Profile', action: () => console.log('Edit Profile') },
		{
			id: 2,
			name: 'Change Password',
			action: () => console.log('Change Password'),
		},
		{
			id: 3,
			name: 'Privacy Settings',
			action: () => console.log('Privacy Settings'),
		},
		{ id: 4, name: 'Logout', action: () => handleLogout() },
	];

	return (
		<div className='h-screen bg-gray-100 p-4'>
			{/* Profile Picture */}
			<div className='flex flex-col items-center mb-6'>
				<img
					src='https://via.placeholder.com/150'
					alt='Profile'
					className='w-32 h-32 rounded-full shadow-md'
				/>
				<h1 className='text-xl font-bold mt-4 text-gray-800'>John Doe</h1>
			</div>

			{/* Settings List */}
			<ul className='space-y-4'>
				{settings.map((setting) => (
					<li
						key={setting.id}
						onClick={setting.action}
						className='bg-white p-4 rounded-md shadow hover:bg-gray-50 cursor-pointer transition'
					>
						<p className='text-gray-800 font-medium'>{setting.name}</p>
					</li>
				))}
			</ul>
		</div>
	);
}

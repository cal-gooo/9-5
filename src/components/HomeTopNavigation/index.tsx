import { useState } from 'preact/hooks';

export default function HomeTopNavigation() {
	const [activeTab, setActiveTab] = useState('for-you'); // Default active tab

	return (
		<nav className='fixed top-0 left-0 w-full bg-sky-800 shadow-md z-10 no-scrollbar'>
			<div className='flex justify-around items-center font-bold'>
				{/* Following Tab */}
				<div
					onClick={() => setActiveTab('following')}
					className={`flex-1 text-center py-3 font-serif cursor-pointer ${
						activeTab === 'following'
							? 'text-lime-500 border-b-2 border-lime-500'
							: 'text-white'
					} hover:text-lime-500 transition duration-200`}
				>
					Following
				</div>

				{/* For You Tab */}
				<div
					onClick={() => setActiveTab('for-you')}
					className={`flex-1 text-center py-3 font-serif cursor-pointer ${
						activeTab === 'for-you'
							? 'text-lime-500 border-b-2 border-lime-500'
							: 'text-white'
					} hover:text-lime-500 transition duration-200`}
				>
					For You
				</div>
			</div>
		</nav>
	);
}

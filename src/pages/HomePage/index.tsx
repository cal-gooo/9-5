import { useState } from 'preact/hooks';
import PullToRefresh from 'react-pull-to-refresh';
export default function HomePage() {
	const [items, setItems] = useState([
		{ id: 1, title: 'Item 1', content: 'This is item 1' },
		{
			id: 2,
			title: 'Item 2',
			content:
				'This is a longer content for item 2 to test adaptive grid height.',
		},
		{ id: 3, title: 'Item 3', content: 'This is item 3' },
		{
			id: 4,
			title: 'Item 4',
			content:
				'This is item 4 with even longer content to test how the grid adapts to varying heights.',
		},
		{ id: 5, title: 'Item 5', content: 'This is item 5' },
		{ id: 6, title: 'Item 6', content: 'This is item 6' },
		{ id: 7, title: 'Item 7', content: 'This is item 7' },
		{ id: 8, title: 'Item 8', content: 'This is item 8' },
	]);

	const fetchNewPosts = async () => {
		// Simulate fetching new posts
		const newPosts = [
			{ id: 9, title: 'New Item 9', content: 'This is a new post.' },
			{ id: 10, title: 'New Item 10', content: 'This is another new post.' },
		];
		return new Promise<void>((resolve) => {
			setTimeout(() => {
				setItems((prevItems) => [...newPosts, ...prevItems]); // Add new posts to the top
				resolve();
			}, 1000); // Simulate a 1-second delay
		});
	};

	return (
		<PullToRefresh onRefresh={fetchNewPosts} className='h-screen'>
			<div className='w-full h-screen p-4'>
				<h1 className='text-2xl font-bold mb-4 font-serif'>
					Welcome to the Home Page
				</h1>
				<div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
					{items.map((item, index) => (
						<div
							key={item.id}
							className={`bg-white shadow-md rounded-md p-4 ${
								index % 2 === 0 ? 'row-span-5' : ''
							}`}
						>
							<h2 className='text-lg font-semibold mb-2'>{item.title}</h2>
							<p className='text-gray-600 line-clamp-3'>{item.content}</p>
						</div>
					))}
				</div>
			</div>
		</PullToRefresh>
	);
}

import { useNavigate } from 'react-router-dom';

export default function BackButton() {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(-1)} // Navigate to the previous page
			className='absolute top-4 left-4 bg-gray-700 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400'
		>
			← Back
		</button>
	);
}

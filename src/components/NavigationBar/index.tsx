import { NavLink } from 'react-router-dom';

export default function NavigationBar() {
    return (
        <nav className="fixed bottom-0 left-0 w-full bg-sky-800 text-white shadow-md">
            <div className="flex justify-around items-center py-2">
                <NavLink
                    to="/page1"
                    className={({ isActive }) =>
                        `flex flex-col items-center text-center px-4 py-2 rounded-md ${
                            isActive ? 'bg-lime-500 text-black' : 'hover:text-gray-300'
                        }`
                    }
                >
                    <span className="text-lg">🏠</span>
                    <span className="text-sm">Home</span>
                </NavLink>
                <NavLink
                    to="/page2"
                    className={({ isActive }) =>
                        `flex flex-col items-center text-center px-4 py-2 rounded-md ${
                            isActive ? 'bg-lime-500 text-black' : 'hover:text-gray-300'
                        }`
                    }
                >
                    <span className="text-lg">📄</span>
                    <span className="text-sm">Posts</span>
                </NavLink>
                <NavLink
                    to="/compose"
                    className={({ isActive }) =>
                        `flex flex-col items-center text-center px-4 py-2 rounded-md ${
                            isActive ? 'bg-lime-500 text-black' : 'hover:text-gray-300'
                        }`
                    }
                >
                    <span className="text-lg">✍️</span>
                    <span className="text-sm">Compose</span>
                </NavLink>
                <NavLink
                    to="/page3"
                    className={({ isActive }) =>
                        `flex flex-col items-center text-center px-4 py-2 rounded-md ${
                            isActive ? 'bg-lime-500 text-black' : 'hover:text-gray-300'
                        }`
                    }
                >
                    <span className="text-lg">👤</span>
                    <span className="text-sm">Profile</span>
                </NavLink>
            </div>
        </nav>
    );
}

export default function Messages() {
    const messages = [
        { id: 1, sender: 'Alice', content: 'Hey, how are you?', time: '10:30 AM' },
        { id: 2, sender: 'Bob', content: 'Let’s catch up later!', time: '9:15 AM' },
        { id: 3, sender: 'Charlie', content: 'Can you send me the files?', time: 'Yesterday' },
        { id: 4, sender: 'Diana', content: 'Great job on the project!', time: '2 days ago' },
    ];

    return (
        <div className="h-screen bg-gray-100 p-4">
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Direct Messages</h1>
            <ul className="space-y-4">
                {messages.map((message) => (
                    <li
                        key={message.id}
                        className="flex items-center justify-between bg-white p-4 rounded-md shadow hover:bg-gray-50 transition"
                    >
                        <div>
                            <p className="font-semibold text-gray-800">{message.sender}</p>
                            <p className="text-gray-600 text-sm truncate">{message.content}</p>
                        </div>
                        <span className="text-gray-500 text-sm">{message.time}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
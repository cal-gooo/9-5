import HomeTopNavigation from "../../components/HomeTopNavigation";
export default function HomePage() {
  const items = [
    { id: 1, title: "Item 1", content: "This is item 1" },
    {
      id: 2,
      title: "Item 2",
      content:
        "This is a longer content for item 2 to test adaptive grid height.",
    },
    { id: 3, title: "Item 3", content: "This is item 3" },
    {
      id: 4,
      title: "Item 4",
      content:
        "This is item 4 with even longer content to test how the grid adapts to varying heights.",
    },
    { id: 5, title: "Item 5", content: "This is item 5" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 7, title: "Item 7", content: "This is item 7" },
    { id: 8, title: "Item 8", content: "This is item 8" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
    { id: 6, title: "Item 6", content: "This is item 6" },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-md"></div>

      {/* Foreground Content */}
      <div className="relative">
        <HomeTopNavigation />
        <div className="p-4 pt-20 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`shadow-xl/30 shadow-lime-400 rounded-xl p-4 ${
                  index % 2 === 0 ? "row-span-5" : ""
                }`}
              >
                <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 line-clamp-3">{item.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

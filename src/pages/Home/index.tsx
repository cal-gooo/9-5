import HomeTopNavigation from "../../components/HomeTopNavigation";
import { homePageItems } from "../../mock/mockHomeItems";
export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-opacity-50 backdrop-blur-md"></div>

      {/* Foreground Content */}
      <div className="relative">
        <HomeTopNavigation />
        <div className="p-4 pt-20 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {homePageItems.map((item, index) => (
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

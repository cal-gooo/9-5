import HomeGrid from "../../components/HomeGrid";
import HomeTopNavigation from "../../components/HomeTopNavigation";
import { homePageItems } from "../../mock/mockHomeItems";
export default function HomePage() {
  return (
    <div className="bg-sky-800">
      <HomeTopNavigation />
      <div className="p-4 pt-20 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {homePageItems.map((item) => {
            const rowSpanMapping = [
              { maxLength: 150, rowSpan: "row-span-3" }, // Very long content
              { maxLength: 100, rowSpan: "row-span-2" }, // Long content
              { maxLength: 50, rowSpan: "row-span-1" }, // Medium content
            ];

            // Determine row-span based on content length
            const rowSpanClass = rowSpanMapping.find(
              (mapping) => item.content.length > mapping.maxLength,
            )?.rowSpan;

            return (
              <div key={item.id} className={`relative group ${rowSpanClass}`}>
                <div class="absolute -inset-0.5 bg-gradient-to-b from-sky-500 to-lime-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <HomeGrid
                  title={item.title}
                  content={item.content}
                  profilePic={"img"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

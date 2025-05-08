import HomeGrid from "../../components/HomeGrid";
import HomeTopNavigation from "../../components/HomeTopNavigation";
import { homePageItems } from "../../mock/mockHomeItems";
export default function HomePage() {
	return (
		<div className='min-h-screen relative'>
			{/* Blurred Background */}
			<div className='absolute inset-0 bg-opacity-50 backdrop-blur-md'></div>

      {/* Foreground Content */}
      <div className="relative">
        <HomeTopNavigation />
        <div className="p-4 pt-20 pb-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {homePageItems.map((item, index) => {
              const rowSpanMapping = [
                { maxLength: 150, rowSpan: "row-span-4" }, // Very long content
                { maxLength: 100, rowSpan: "row-span-3" }, // Long content
                { maxLength: 50, rowSpan: "row-span-2" }, // Medium content
              ];
              const truncatedContent =
                item.content.length > 150
                  ? `${item.content.slice(0, 150)}...`
                  : item.content;
              // Determine row-span based on content length
              const rowSpanClass =
                rowSpanMapping.find(
                  (mapping) => truncatedContent.length > mapping.maxLength,
                )?.rowSpan || (index % 2 === 0 ? "row-span-2" : "row-span-1"); // Default fallback

              return (
                <div
                  key={item.id}
                  className={`shadow-xl/30 shadow-lime-400 rounded-xl ${
                    rowSpanClass
                  } `}
                >
                  <HomeGrid
                    title={item.title}
                    content={truncatedContent}
                    profilePic={"img"}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

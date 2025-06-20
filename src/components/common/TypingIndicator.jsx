// Component cho typing indicator với animation đẹp
const TypingIndicator = ({ senderName, isAdmin = false }) => {
  return (
    <div
      className={`flex ${
        isAdmin ? "justify-start" : "justify-center"
      } px-4 pb-4 mt-4`}
    >
      <div
        className="max-w-xs lg:max-w-md rounded-lg px-4 py-2 shadow-sm
         bg-gray-100 text-gray-800 border border-gray-200 animate-fade-in"
      >
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-600">
            {isAdmin ? "Admin" : `${senderName} is`} typing
          </span>

          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{
                animationDelay: "0ms",
                animationDuration: "1.4s",
                animationTimingFunction: "ease-in-out",
              }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{
                animationDelay: "200ms",
                animationDuration: "1.4s",
                animationTimingFunction: "ease-in-out",
              }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
              style={{
                animationDelay: "400ms",
                animationDuration: "1.4s",
                animationTimingFunction: "ease-in-out",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

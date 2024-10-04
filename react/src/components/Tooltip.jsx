export default function Tooltip({ message, children }) {
    return (
      <div className="group relative">
        {children}
        <div className="z-10 absolute left-1/2 top-1/2 -translate-y-1/2 ml-2 scale-0 transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-500 group-hover:scale-100">
          <div className="flex max-w-xs flex-row items-center shadow-lg">
            <div className="clip-left h-2 w-4 bg-gray-800"></div>
            <div className="rounded bg-gray-800 p-2 text-center text-sm text-white">
              {message}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
const ErrorPopup = ({ message, onClose }) => (
  <div
    role="alert"
    className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/50"
  >
    <div className="bg-white border border-red-400 rounded-xl shadow-lg px-8 py-6 flex flex-col items-center max-w-sm w-full">
      <span className="text-red-600 font-bold text-lg mb-2">Error</span>
      <span className="text-gray-700 mb-4 text-center">{message}</span>
      <button
        type="button"
        onClick={onClose}
        className="px-4 py-2 rounded bg-pink-500 text-white font-semibold hover:bg-pink-600 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
      >
        Close
      </button>
    </div>
  </div>
);

export default ErrorPopup;

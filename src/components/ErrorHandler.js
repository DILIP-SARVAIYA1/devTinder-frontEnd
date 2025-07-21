const ErrorHandler = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">Error</h1>
      <p className="text-2xl">{error.message}</p>
      <p className="text-xl">
        Please try again later or contact our support team if the issue
        persists.
      </p>
    </div>
  );
};

export default ErrorHandler;

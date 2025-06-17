export default function errorHandler(error) {
  if (error.response) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">Oops!</h1>
        <p className="text-2xl mt-4">
          {error.response.status} {error.response.statusText}
        </p>
        <p className="text-xl mt-4">{error.response.data.message}</p>
      </div>
    );
  } else {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">Oops!</h1>
        <p className="text-2xl mt-4">Something went wrong</p>
        <p className="text-xl mt-4">{error.message}</p>
      </div>
    );
  }
}

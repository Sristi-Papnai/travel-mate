import Link from "next/link";

export default function ResetNotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
      <h1 className="text-3xl font-bold">401 - Unauthorized</h1>
      <p className="text-gray-600">Token Expired, Please try reseting password again.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </Link>
    </div>
  );
}

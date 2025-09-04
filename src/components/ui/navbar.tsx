import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-black shadow-md">
      <div className="flex items-center ml-3">
        <Image src="/images/logo.png" alt="Logo" width={80} height={80} />
        {/* <span className="ml-2 font-bold text-xl">TravelMate</span> */}
      </div>
  
      <div className="space-x-4">
            <button
                className="bg-black text-white border border-white px-5 py-2 hover:bg-white hover:text-black transition"
              >
                JOIN
            </button>
            <button
              className="bg-blue-500 text-white px-5 py-2 hover:bg-blue-600 transition"
            >
              Sign In
            </button>
            {/* TODO - use signin Model funtion in href */}
      </div>
    </nav>
  );
}

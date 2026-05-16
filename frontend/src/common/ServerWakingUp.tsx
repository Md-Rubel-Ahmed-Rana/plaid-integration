import { FiServer, FiClock, FiLoader } from "react-icons/fi";

const ServerWakingUp = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <FiServer className="text-3xl text-blue-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Server is Starting Up
        </h1>

        <p className="text-gray-600 leading-relaxed mb-6">
          Our backend server is hosted on Render&apos;s free instance, which
          goes to sleep after inactivity. It may take around{" "}
          <span className="font-semibold text-gray-900">30–60 seconds</span> to
          fully wake up and respond.
        </p>

        <div className="flex items-center justify-center gap-3 text-blue-600 font-medium">
          <FiLoader className="animate-spin text-xl" />
          <span>Please wait...</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
          <FiClock />
          <span>Usually ready within a minute</span>
        </div>
      </div>
    </div>
  );
};

export default ServerWakingUp;

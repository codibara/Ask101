import Navigation from "@/components/Navigation";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Ask101
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Ask questions and get answers from the community
          </p>
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in with your Google account to start asking questions and
              participating in the community.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Ask questions and get community feedback</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Vote on questions and answers</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Build your profile and reputation</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?
          </p>

          <Link
            href="/register"
            className="inline-block mt-2 text-blue-600 hover:underline font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

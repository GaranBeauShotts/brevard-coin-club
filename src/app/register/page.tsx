import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 border rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

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
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
          </p>

          <Link
            href="/login"
            className="inline-block mt-2 text-blue-600 hover:underline font-medium"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

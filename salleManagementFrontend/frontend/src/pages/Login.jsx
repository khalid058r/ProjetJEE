export default function Login() {
  const handleLogin = (e) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm p-8 rounded-xl shadow-lg border border-gray-200 space-y-5"
      >
        <h1 className="text-2xl font-bold tracking-tight text-center">Welcome Back</h1>

        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="w-full border mt-1 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="w-full border mt-1 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Login
        </button>
      </form>

    </div>
  );
}

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import { Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({
    user_name: "",
    password: "",
  });

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loginUser = async () => {
    if (form.user_name === "" || form.password === "") {
      alert("Please enter both username and password.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8800/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid username or password.");
        }
        throw new Error("Failed to sign in. Please try again.");
      }

      const data = await response.json(); // Parse JSON response
      console.log("User login successful:", data);

      alert(data.message || "Login successful!");

      // Store user data and redirect
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        authContext.signin(data.user, () => {
          navigate("/"); // Redirect to dashboard
        });
      } else {
        throw new Error("User data missing in server response.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(); // Call the login function
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen items-center place-items-center">
      <div className="flex justify-center items-center w-full h-screen">
        <img
          src={require("../assets/poster3.jpg")}
          alt="Sign In"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full max-w-md space-y-8 p-10 rounded-lg">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src={require("../assets/football.png")}
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="user_name" className="sr-only">
                User Name
              </label>
              <input
                id="user_name"
                name="user_name"
                type="text"
                autoComplete="username"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Username"
                value={form.user_name}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 px-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="Password"
                value={form.password}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{" "}
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Don't Have an Account? <Link to="/register">Register now</Link>
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;

import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/user";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function Auth() {
  const dispatch=useDispatch()
  const [isLogin, setIsLogin] = useState(true);
  const [error ,setError] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  console.log("erro  setled " , error)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("cliked ")
    if (!isLogin && password !== reenterPassword) {
      alert("Passwords do not match");
      return;
    }

    const endpoint = isLogin ? "/user/login" : "/user/register";

    try {

      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("response "  ,response)

      if (!response.ok) {
        let errorMessage = "Authentication failed";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        setError(errorMessage)
        setTimeout(() => {
          setError("")
        }, (5000));
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(data);
      Me(data.token)

    } catch (error) {
      setError(error.message)
        setTimeout(() => {
          setError("")
        }, (5000));
      console.error(error);
    }
  };
  async function Me(token:string){
    try{
      const response =await fetch(`${BACKEND_URL}/user/me`,{
        method:"GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }
    

      })
      if(!response.ok){
        setError("try again")        
        return
    }
    const data = await response.json()
    dispatch(login(data.data))
    localStorage.setItem("auto-token",token)
    
    }catch(e){
      setErrors(e.message)
      console.log("error /me " , e.mesage)
    }
  }
  function setErrors(message:string){
    setError(message)
    setTimeout(() => {
      setError("")
    }, 5000);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-8 sm:px-6 bg-red-400">
      <section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-md sm:p-8">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Auto Apply
          </h1>

          
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:h-12 sm:text-base"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:h-12 sm:text-base"
            />
          </div>

          {/* Re-enter Password */}
          {!isLogin && (
            <div>
              <label
                htmlFor="reenter-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Re-enter Password
              </label>

              <input
                id="reenter-password"
                type="password"
                value={reenterPassword}
                onChange={(e) => setReenterPassword(e.target.value)}
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                className="h-11 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black sm:h-12 sm:text-base"
              />
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 h-11 w-full rounded-lg bg-black px-4 text-sm font-medium text-white transition hover:bg-gray-800 active:scale-[0.99] sm:h-12 sm:text-base"
          >
            {isLogin ? "Login" : "Create Account"}
          </button>
        </form>

        {/* Switch Auth Mode */}
        <div className="mt-6 text-center text-sm sm:mt-8">
          <span className="text-gray-500">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>{" "}
            <p className="text-sm font-semibold text-red-500">{error}</p>
          <button
            type="button"
            onClick={() => setIsLogin((prev) => !prev)}
            className="font-medium text-black underline underline-offset-2 hover:text-gray-600"
          >
            {isLogin ? "Create Account" : "Login"}
          </button>
        </div>
      </section>
    </main>
  );
}

export default Auth;
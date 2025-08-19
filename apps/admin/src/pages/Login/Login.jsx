import "./login.css";

const Login = () => {
  return (
    <div className="login h-screen p-10 flex justify-center items-center">
      <div className="flex h-9/12 w-9/12 bg-stone-100 rounded-xl shadow-2x">
        <div className="login-form flex justify-center w-1/2">
          <form
            action=""
            className="flex flex-col  justify-center align-center gap-3"
          >
            <label htmlFor="">Username:</label>
            <input
              type="text"
              name=""
              id=""
              placeholder="Username"
              className="login-input"
            />
            <label htmlFor="">Password:</label>
            <input
              type="password"
              name=""
              id=""
              placeholder="Password"
              className="login-input"
            />
            <button className="bg-blue-700 text-stone-100 rounded-md px-3 py-2">
              Login
            </button>
          </form>
        </div>
        <div className="w-1/2 rounded-r-2xl">
          <img
            src="/images/lock.jpg"
            alt="lock-image"
            className="w-full h-full rounded-r-2xl object-fit-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;

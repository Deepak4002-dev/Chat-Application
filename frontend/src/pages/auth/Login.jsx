import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "../../rtk/auth/authAsyncThunk";

const Login = () => {
  const schema = yup.object().shape({
    email: yup.string().required("Email is required").email("Invalid Email"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password characters must be at lest 8."),
  });
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submissionHandler = async (data) => {
    try {
      const res = await dispatch(login(data)).unwrap();
      toast.success(res.message); // "succesffuly Loggedin"
      navigate("/chat");
    } catch (error) {
      // Error from rejectWithValue
      if (error?.errors) {
        error?.errors.forEach((err) =>
          toast.error(`${err.field}: ${err.message}`),
        );
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="w-screen h-full">
      <div className="h-auto mt-12 w-full flex justify-center items-center">
        <div className="w-2/6 h-auto px-2 py-1">
          <div className="w-full h-full bg-gray-100 px-6 py-4 ">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl "> Login </h1>
            </div>
            <form
              onSubmit={handleSubmit(submissionHandler)}
              className="w-full h-full  flex flex-col gap-y-4 rounded-md"
            >
              <div className="">
                <label htmlFor="">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter your email"
                  type="email"
                  className="w-full text-lg px-2 py-1.5 rounded-md bg-blue-200 outline-none text-black"
                />
                {errors.email && (
                  <p className="text-[12px] text-red-500 mt-1.5 ml-0.5">
                    {errors.email?.message}
                  </p>
                )}
              </div>

              <div className="">
                <label htmlFor="">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full text-lg px-2 py-1.5 rounded-md bg-blue-200 outline-none text-black"
                />
                {errors.password && (
                  <p className="text-[12px] text-red-500 mt-1.5 ml-0.5">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="active:scale-95 hover:scale-103 transition duration-200 w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white cursor-pointer"
              >
                Login
              </button>
            </form>
            <div className="mt-4 flex flex-col items-center justify-center gap-y-4">
              <p className="self-end text-[15px] -tracking-tighter text-blue-500 cursor-pointer">
                Forgot Password?
              </p>
              <p>
                Don't hava an Account?
                <Link
                  to={"/signup"}
                  className="text-blue-500 font-bold cursor-pointer pl-2"
                >
                  Signup
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

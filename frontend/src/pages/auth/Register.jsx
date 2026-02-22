import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signup } from "../../rtk/auth/authAsyncThunk";
import { toast } from "sonner";

const Register = () => {
  const schema = yup.object().shape({
    username: yup
      .string()
      .required("Username is required")
      .min(3, "Username characters must be at least 3."),
    email: yup.string().required("Email is required").email("Invalid Email"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password characters must be at lest 8."),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password")], "Password must be matched."),
  });

  const dispatch = useDispatch();
  const {
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const navigate = useNavigate();
  const submissionHandler = async (data) => {
    try {
      const res = await dispatch(signup(data)).unwrap();
      toast.success(res?.message);
      reset();
      navigate("/");
    } catch (error) {
      if (error?.errors) {
        error.errors.forEach((err) =>
          toast.error(`${err.field}: ${err.message}`),
        );
      } else {
        toast.error(error?.message || error);
      }
    }
  };
  return (
    <div className="w-screen h-full">
      <div className="h-auto mt-8 w-full flex justify-center items-center">
        <div className="w-2/6 h-auto px-2 py-1">
          <div className="w-full h-full bg-gray-100 px-6 py-4 ">
            <div className="flex justify-center items-center">
              <h1 className="text-2xl "> Signup </h1>
            </div>
            <form
              onSubmit={handleSubmit(submissionHandler)}
              className="w-full h-full  flex flex-col gap-y-4 rounded-md"
            >
              <div className="">
                <label htmlFor="">Username</label>
                <input
                  {...register("username")}
                  placeholder="Enter your username"
                  type="text"
                  className="w-full text-lg px-2 py-1.5 rounded-md bg-blue-200 outline-none text-black"
                />
                {errors.username && (
                  <p className="text-[12px] text-red-500 mt-1.5 ml-0.5">
                    {errors.username?.message}
                  </p>
                )}
              </div>
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
                  placeholder="Enter password"
                  className="w-full text-lg px-2 py-1.5 rounded-md bg-blue-200 outline-none text-black"
                />
                {errors.password && (
                  <p className="text-[12px] text-red-500 mt-1.5 ml-0.5">
                    {errors.password?.message}
                  </p>
                )}
              </div>

              <div className="">
                <label htmlFor="">Password</label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Enter confirm password"
                  className="w-full text-lg px-2 py-1.5 rounded-md bg-blue-200 outline-none text-black"
                />
                {errors.confirmPassword && (
                  <p className="text-[12px] text-red-500 mt-1.5 ml-0.5">
                    {errors.confirmPassword?.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="active:scale-95 hover:scale-103 transition duration-200 w-full px-2 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-md text-white cursor-pointer"
              >
                {isSubmitting ? "Signing up" : "Signup"}
              </button>
            </form>
            <div className="mt-4 flex flex-col items-center justify-center gap-y-4">
              <p>
                Have already an account ?
                <Link
                  to={"/"}
                  className="text-blue-500 font-bold cursor-pointer pl-2"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

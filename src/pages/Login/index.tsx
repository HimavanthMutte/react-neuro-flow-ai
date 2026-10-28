import { useState, type FormEvent } from "react";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address" }),

  password: z
    .string()
    .min(1, { error: "Password is required" })
    .min(8, { error: "Password must be at least 8 characters long" }),
});

type LoginErrors = {
  email?: string[];
  password?: string[];
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const result = loginSchema.safeParse({
        email,
        password,
      });

      if (!result.success) {
        setErrors(result.error.flatten().fieldErrors);
        return;
      }
      //need to make a backend call here
      console.log(result.data);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-row bg-primary">
      <div className="flex-1">Image</div>
      <div className="flex flex-1 items-center justify-center bg-tertiary p-4">
        <div className="w-full max-w-lg overflow-hidden rounded-xl border-4 border-white bg-white shadow-2xl">
          <div className="rounded-2xl bg-tertiary/30 px-7 py-5 sm:px-9 sm:py-6">
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl border border-accent/40 bg-white text-base font-bold text-primary">
              N
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>

            <p className=" text-md text-primary/50">
              Sign in to access your dashboard
            </p>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
              {/* Email */}
              <div>
                <label
                  htmlFor="input-email"
                  className="mb-1 block text-xs font-medium text-primary"
                >
                  Email
                </label>

                <div className="flex h-10 items-center gap-3 rounded-lg border border-accent/30 bg-white px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#BB9457"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <input
                    id="input-email"
                    type="email"
                    formNoValidate
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors((state) => ({
                        email: undefined,
                        ...state,
                      }));
                    }}
                    placeholder="yourname@example.com"
                    autoComplete="off"
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-primary/40"
                  />
                </div>
                {errors.email && <p>{errors.email.join(",")}</p>}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="input-password"
                  className="mb-1 block text-xs font-medium text-primary"
                >
                  Password
                </label>

                <div className="flex h-10 items-center gap-3 rounded-lg border border-accent/30 bg-white px-3 focus-within:border-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#BB9457"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  <input
                    id="input-password"
                    type="password"
                    value={password}
                    placeholder="* * * * * * *"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((state) => ({ ...state, password: undefined }));
                    }}
                    className="h-full  flex-1 justify-center bg-transparent text-sm text-primary outline-none placeholder:text-primary/40"
                  />
                </div>
                {errors.password && <p>{errors.password[0]}</p>}
              </div>

              {/* Sign in */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 h-10 w-full cursor-pointer rounded-full bg-primary text-sm font-semibold text-tertiary shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-primary"
              >
                Sign In
              </button>

              {/* Sign up */}
              <p className="pt-1 text-center text-xs text-primary/70">
                Don't have an account?{" "}
                <span className="cursor-pointer font-semibold text-primary underline underline-offset-2">
                  Sign up
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

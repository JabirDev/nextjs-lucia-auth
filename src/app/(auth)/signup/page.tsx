import { Metadata } from "next";
import SignUpForm from "./components/form";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <div className="w-full font-sans flex-col min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold leading-tight">Sign Up</h1>
      <p>Create a new account</p>
      <SignUpForm />
    </div>
  );
}

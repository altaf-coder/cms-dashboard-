import PageMeta from "../../app/features/Dashboard/PageMeta";
import SignInForm from "../auth/SignInForm";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard |  Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}

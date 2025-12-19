import PageMeta from "../../app/features/Dashboard/PageMeta";
import SignUpForm from "../auth/SignUpForm";
import AuthLayout from "./AuthPageLayout";


export default function SignUp() {
  return (
    <>
      <PageMeta
        title="React.js SignUp Dashboard | Next.js Admin Dashboard Template"
        description="This is React.js SignUp Tables Dashboard page for React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignUpForm />
      </AuthLayout>
    </>
  );
}

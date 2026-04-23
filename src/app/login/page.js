import LoginClientPage from "@/components/auth/LoginClientPage";

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const verified = params?.verified === "1";
  const initialEmail = typeof params?.email === "string" ? params.email : "";

  return <LoginClientPage verified={verified} initialEmail={initialEmail} />;
}

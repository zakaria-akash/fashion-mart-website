import LoginClientPage from "@/components/auth/LoginClientPage";

/**
 * LoginPage (Server Component)
 * Simple shell that parses URL params for verification status and hands off to the client login flow.
 */
export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const verified = params?.verified === "1";
  const initialEmail = typeof params?.email === "string" ? params.email : "";

  return <LoginClientPage verified={verified} initialEmail={initialEmail} />;
}

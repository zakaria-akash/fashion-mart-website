import VerifyEmailClientPage from "@/components/auth/VerifyEmailClientPage";

/**
 * VerifyEmailPage (Server Component)
 * Parses verification parameters from the URL and initializes the client-side verification flow.
 */
export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "";
  const token = typeof params?.token === "string" ? params.token : "";

  return <VerifyEmailClientPage email={email} token={token} />;
}

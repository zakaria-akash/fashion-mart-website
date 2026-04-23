import VerifyEmailClientPage from "@/components/auth/VerifyEmailClientPage";

export default async function VerifyEmailPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "";
  const token = typeof params?.token === "string" ? params.token : "";

  return <VerifyEmailClientPage email={email} token={token} />;
}

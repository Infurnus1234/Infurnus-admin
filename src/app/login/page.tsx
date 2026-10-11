import { AuthScreen } from "@/components/auth/AuthScreen";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ portal?: string }>;
}) {
  const params = await searchParams;
  return <AuthScreen superPortal={params.portal === "super-admin"} />;
}

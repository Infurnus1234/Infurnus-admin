import { redirect } from "next/navigation";
export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ portal?: string }>;
}) {
  const params = await searchParams;
  redirect(
    params.portal === "super-admin"
      ? "/login?portal=super-admin"
      : "/login?portal=admin",
  );
}

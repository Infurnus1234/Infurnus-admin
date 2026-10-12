import { RestoreSession } from "@/components/auth/RestoreSession";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  return <RestoreSession returnTo={returnTo} />;
}

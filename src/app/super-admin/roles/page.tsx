import { redirect } from "next/navigation";

export default function RolesRedirectPage() {
  redirect("/super-admin/roles-permissions");
}

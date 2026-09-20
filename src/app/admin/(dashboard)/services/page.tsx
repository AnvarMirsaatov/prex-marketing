import { redirect } from "next/navigation";

export default function ServicesRedirect() {
  redirect("/admin/content?tab=services");
}

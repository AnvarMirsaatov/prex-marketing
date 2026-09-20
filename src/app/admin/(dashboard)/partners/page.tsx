import { redirect } from "next/navigation";

export default function PartnersRedirect() {
  redirect("/admin/content?tab=partners");
}

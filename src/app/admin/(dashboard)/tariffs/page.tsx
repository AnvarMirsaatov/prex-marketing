import { redirect } from "next/navigation";

export default function TariffsRedirect() {
  redirect("/admin/content?tab=tariffs");
}

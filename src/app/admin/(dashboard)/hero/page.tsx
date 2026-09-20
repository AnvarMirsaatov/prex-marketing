import { redirect } from "next/navigation";

export default function HeroRedirect() {
  redirect("/admin/content?tab=hero");
}

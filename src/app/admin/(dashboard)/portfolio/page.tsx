import { redirect } from "next/navigation";

export default function PortfolioRedirect() {
  redirect("/admin/content?tab=portfolio");
}

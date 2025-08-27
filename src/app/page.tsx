import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewDashboard from "@/components/dashboard/NewDashboard";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <NewDashboard />;
} 
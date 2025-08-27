import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProductsPixelGrid from "@/components/products/ProductsPixelGrid";

export default async function Page() {
  const user = await currentUser();
  if (!user) redirect("/login");

  return <ProductsPixelGrid />;
} 
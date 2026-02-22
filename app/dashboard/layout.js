import { redirect } from "next/navigation";
import config from "@/config";

export default async function LayoutPrivate({ children }) {

  if (!session) {
    redirect(config.auth.loginUrl);
  }

  return <>{children}</>;
}

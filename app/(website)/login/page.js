import { getSettings } from "@/lib/getSettings";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const settings = await getSettings();
  return <LoginForm bgUrl={settings?.login_bg_url || ""} />;
}
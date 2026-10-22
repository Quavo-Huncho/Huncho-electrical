import { getSettings } from "@/lib/getSettings";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const settings = await getSettings();
  return <LoginForm bgUrl={settings?.login_bg_url || ""} />;
}

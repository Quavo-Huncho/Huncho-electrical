import { getSettings } from "@/lib/getSettings";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const settings = await getSettings();
  return <RegisterForm bgUrl={settings?.login_bg_url || ""} />;
}

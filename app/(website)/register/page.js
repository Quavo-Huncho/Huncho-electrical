import { getSettings } from "@/lib/getSettings";
import RegisterForm from "./RegisterForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const settings = await getSettings();
  return <RegisterForm bgUrl={settings?.login_bg_url || ""} />;
}
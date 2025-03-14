import AppLogout from "@/db/logout";
import { AppLogin } from "./app-login";
import { Prompts } from "../prompts";

export default function AppGlobals() {
  return (
    <>
      <AppLogin />
      <AppLogout />
      <Prompts />
    </>
  );
}

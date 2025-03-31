import { useRegisterSW } from "virtual:pwa-register/react";

export default function AppOffline() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log("SW Registered: " + r);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });
  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }
  return null;
}

// import { useEffect, useRef } from "react";
// import { toast } from "sonner";
// import { useRegisterSW } from "virtual:pwa-register/react";

// export default function ReloadPrompt() {
//   const {
//     updateServiceWorker,
//   } = useRegisterSW({
//     immediate: true,
//     onRegisteredSW(swScriptUrl) {
//       console.log("SW registered: ", swScriptUrl);
//     },
//     onRegistered(r) {
//       // eslint-disable-next-line prefer-template
//       console.log("SW Registered: " + r);
//     },
//     onRegisterError(error) {
//       console.log("SW registration error", error);
//     },
//     onOfflineReady() {
//       toast.success("The app is ready to work offline");
//     },
//     onNeedRefresh() {
//       toast.message(
//         "New content is available",
//         {
//           action: {
//             label: "Reload",
//             onClick: () => {
//               updateServiceWorker(true);
//             },
//           },
//         }
//       );
//     },
//   });
//   return null;
// }

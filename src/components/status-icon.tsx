import AppStatus from "@/components/board/app-status.tsx";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function StatusIcon() {
  return <AppStatus>
    <AppStatus.Icon>{(sync) => sync && (<title>
        {`${capitalize(sync.phase)}: ${
            sync.progress
            ? `${sync.progress}%`
            : capitalize(sync.status.replace("-", " "))
        }`}
    </title>)}</AppStatus.Icon>
  </AppStatus>
}

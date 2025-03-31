import {MistQLInstance} from "mistql";

export const mistql = new MistQLInstance({
    extras: {
        textContent: (data: string) => {
            const doc = new DOMParser().parseFromString(data, "text/html");
            return doc.body.textContent || "";
        },
        matchAll: (regex: RegExp, data: any) => [...String(data).matchAll(regex)],
    },
});

export function interpolate(str: string, data: Record<string, string>) {
    return str.replace(/{{([^}]+)}}/g, (_, query: string) => {
        const res = mistql.query(query, data);
        if (typeof res === "string") return res;
        return JSON.stringify(res, null, 2);
    });
}

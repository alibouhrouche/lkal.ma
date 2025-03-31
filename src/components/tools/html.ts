import hljs from "highlight.js";

export const htmlToPlaintext = (html: string) => {
  console.log(html);
  return html;
  // const doc = new DocumentFragment();
  // const tempElement = document.createElement("pre");
  // console.log(html);
  // tempElement.innerHTML = html;
  // doc.appendChild(tempElement);
  // console.log(doc.textContent)
  // return doc.textContent || "";
};

export const escapeHtml = (html: string) =>
  html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const getHtmlBlock = (text: string) => {
  const dom = new DOMParser().parseFromString(text, "text/html");
  return (
    dom.querySelector("code.language-html")?.textContent ??
    dom.querySelector("code")?.textContent ??
    text
  );
};

export const rehightlight = (text: string) => {
  const dom = new DOMParser().parseFromString(text, "text/html");
  for (const node of dom.querySelectorAll("code")) {
    const lang = node.className.replace("language-", "");
    const code = node.textContent ?? "";
    if (lang) {
      node.innerHTML = hljs.highlight(code, {
        language: lang,
      }).value;
    } else {
      node.innerHTML = hljs.highlightAuto(code).value;
    }
  }
  return dom.body.innerHTML;
};

export const highlightJson = (data: any) => {
  const value =
    typeof data !== "string"
      ? JSON.stringify(data, null, "\t")
      : data;
    return hljs.highlight(value, {
      language: "json",
    }).value;
};

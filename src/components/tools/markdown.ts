import Turndown from "turndown";

const toMd = new Turndown({
    headingStyle: "setext",
    codeBlockStyle: "fenced",
});

const toMarkdown = (html: string) => toMd.turndown(html);

export default toMarkdown;

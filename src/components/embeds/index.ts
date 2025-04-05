import {DEFAULT_EMBED_DEFINITIONS} from "tldraw";
import instagram from "./instagram.ts";
import twitter from "./twitter.ts";
import threads from "./threads.ts";

const embeds = [...DEFAULT_EMBED_DEFINITIONS, instagram, twitter, threads];

export default embeds;
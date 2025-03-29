import {
  Box,
  DefaultFontFamilies,
  Editor,
  FileHelpers,
  getDefaultColorTheme,
  RichTextSVGProps,
  SvgExportContext,
  TEXT_PROPS,
} from "tldraw";
import { ComponentShape, ComponentTypeStyle } from ".";
import { PropsWithChildren } from "react";
import { FONT_SIZES } from "./content";

async function getDataURIFromURL(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();
  return FileHelpers.blobToDataUrl(blob);
}

function compressImage(image: string, quality = 0.8) {
  return new Promise<string>((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const MAX_WIDTH = 1024;
      const MAX_HEIGHT = 1024;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.src = image;
  });
}

const HeaderPaths = {
  text: "M5.2 16q-.4 0-.8-.4-.3-.3-.5-1.2-.1-.6-.1-1.4 0-.8.1-2t.3-2.9h-.9q-.5 0-1-.1-.9 0-1.3-.4-.3-.3-.3-.9 0-.3.3-.5.2-.2.7-.2h1.8q.8 0 1.5.1h2.6q.5-.1.8-.1.4-.1.9-.1t.7.3q.2.2.2.6-.1.7-.7 1-.7.4-1.6.4H6.3q.1.3 0 .9-.2 1.6-.2 2.6-.1 1.1 0 1.7v1.1q.1.3.1.6-.1.9-1 .9Zm9.7 1q-1.5 0-2.4-.5-.9-.5-1.2-1.5-.4-.9-.4-2.1.1-.9.5-1.9.3-.9 1-1.7.6-.8 1.5-1.3.9-.4 2-.4 1.4 0 2.3.7.8.8.7 2.2 0 1-.6 1.7t-1.6 1q-1 .3-2.1.3-.6 0-1-.1t-.6-.3q0 .9.4 1.4.3.6 1.3.6t1.7-.2q.6-.2 1.1-.5.4-.3.7-.5.4-.2.7-.2.6 0 .5.8 0 .6-.6 1.2t-1.6.9q-1 .4-2.3.4Zm1-7.4q-.9 0-1.6.7-.7.6-1 1.6.2 0 .4.1h.7q1.1 0 1.8-.4.6-.4.7-1 0-1-1-1Zm5.3 8.9q-.3 0-.6-.3-.2-.2-.1-.9t.4-1.6q.4-.9.9-1.9.6-.9 1.4-1.9-.4-.3-.7-.7-.4-.3-.7-.6-.3-.3-.5-.6t-.2-.7q0-.3.2-.6t.7-.3q.3 0 .6.1.2.2.7.6.2.2.6.5.3.4.7.8.8-.8 1.5-1.3.7-.4 1.1-.6.4-.2.6-.2.5 0 .7.3.3.2.3.7 0 .4-.2.6-.2.3-.6.5-1.1.6-2 1.5.5.5 1 1.1.4.6.7 1 .4.7.5 1 .2.4.2.6-.1.4-.3.6-.2.2-.7.2-.3 0-.6-.2t-.6-.7l-.8-1q-.4-.6-.9-1.1-1.3 1.8-2.1 4.1-.2.4-.5.7-.3.3-.7.3Zm12.3-2q-1.3 0-2.1-.5-.8-.6-1.1-1.6-.3-1.1-.2-2.4.1-1 .2-1.8.1-.7.3-1.4.2-.7.2-1.5.1-.7.1-1.2-.1-.5 0-.9 0-.4.2-.6.2-.2.7-.2.7 0 1 .7.4.6.2 2.1 0 .4-.1.7-.1.4-.1.7.6-.2 1.3-.2.7-.1 1.3-.1.7 0 1.1.3.4.4.4.9 0 .3-.2.4-.1.2-.5.2-.8.1-1.5.2-.6 0-1.2.2-.6.1-1.2.3v.5q0 .3-.1.7 0 1.3.4 1.8.4.6 1.2.6.4 0 .6-.1.2-.1.3-.1.2-.1.4-.1.7 0 .6.8 0 .7-.6 1.2-.5.4-1.6.4Z",
  image:
    "M1.9 15.9q-.8 0-1.2-.3-.4-.4-.4-.9.1-.3.3-.5.2-.2.6-.3.8-.1 1.4-.2h1.2q-.2-.4-.1-.8 0-1.3.2-2.4.1-1.2.2-2.1v-.3q-.7 0-1.2.1t-1 .1q-.7 0-.9-.3-.3-.4-.3-.8.1-.4.3-.6.3-.3.9-.4.9-.1 2-.2T6 5.8h1.9q.9 0 1.2.2.3.2.2.7 0 .6-.5.9-.5.4-1.2.4H6.1q.1.3.1.7 0 .6-.2 1.8-.1 1.2-.2 2.7 0 .3-.1.4.4.1.9.1h1q1 0 1.2.2.3.3.3.7 0 .5-.5.8-.4.3-1.2.3-1.9 0-3.3.1t-2.2.1Zm9.9 0q-.5 0-.8-.3-.3-.3-.4-.8-.1-.5-.1-1.1.1-.7.2-1.3.1-.6.1-1.4.1-.3 0-.6v-.7q0-.2.2-.4t.6-.2q.4 0 .7.2.3.3.4.7.4-.7.9-1 .6-.4 1.2-.4.9 0 1.3.7t.6 1.8q.1.3.1.5.1.2.1.4.7-1.5 1.6-2.4 1-.9 2-.9t1.6.8q.5.8.6 2.5.1.9.2 1.4.1.5.2.8.1.3.2.5t.1.4q0 .4-.3.6-.3.2-.7.2-.7 0-1.1-.6-.5-.5-.6-1.9-.1-.8-.2-1.3t-.1-.8q-.1-.3-.2-.5-.8.7-1.3 1.8-.5 1-1 2.5-.2.4-.4.6-.3.2-.7.2-.8 0-1.2-.7-.3-.6-.5-1.7t-.3-1.6q-.1-.6-.4-1-.7.8-1.1 1.9-.3 1.1-.6 2.3-.1.8-.9.8Zm15.7 0q-1.2 0-1.9-.7t-.6-1.7q0-.9.4-1.8.5-.8 1.2-1.6.7-.7 1.6-1.1.9-.4 1.8-.4 1 0 1.1.7h.3q.5 0 .9.3t.5.8q.2.9.3 1.7.2.7.5 1.4t.9 1.4q.2.3.2.8-.1.4-.4.8-.3.3-.8.3-.3 0-.4-.1-.2-.1-.3-.3-.5-.7-.9-1.4t-.6-1.8q-.5 1-1.1 1.6-.7.6-1.4.8-.7.3-1.3.3Zm-.5-2.2v.1h.6q.8 0 1.6-.8.7-.9 1.1-2.6-.9.2-1.7.7-.7.5-1.1 1.2-.4.7-.5 1.4Zm14.2 6.8q-1.4 0-2.3-.3-.8-.2-1.3-.6-.5-.4-.7-.9-.1-.5-.1-.9 0-.5.3-.9.4-.3.9-.3.4 0 .5.1.1.2.1.4 0 .6.6.9.6.4 2 .4.9 0 1.3-.4t.4-1.2q.1-1.2-.1-2-.1-.8-.3-1.8-.6 1-1.5 1.3-.9.4-1.8.4-1.6 0-2.5-.8-.9-.8-.9-2.3.1-.9.5-1.6.4-.8 1-1.4.7-.5 1.5-.8.8-.4 1.7-.4.8 0 1.3.3t.7.7q.2-.2.7-.2.6 0 .9.4.3.4.3.9 0 1.1.1 1.9.2.8.3 1.6.2.9.2 1.8.1.9.1 2.2-.1 1.6-1.1 2.6-1 .9-2.8.9Zm-3.3-8.9q0 .5.3.8.3.2 1.1.2 1 0 1.8-.6.7-.5 1-1.8-.2 0-.3-.1-.2-.1-.3-.3-.1-.1-.3-.2-.2-.1-.5-.1-.7 0-1.3.3-.6.3-1 .8t-.5 1ZM50.5 17q-1.5 0-2.3-.5-.9-.5-1.3-1.5-.4-.9-.4-2.1.1-.9.5-1.9.3-.9 1-1.7.7-.8 1.6-1.3.8-.4 1.9-.4 1.5 0 2.3.7.8.8.8 2.2-.1 1-.7 1.7t-1.6 1q-.9.3-2 .3-.6 0-1-.1t-.7-.3q0 .9.4 1.4.3.6 1.4.6.9 0 1.6-.2.7-.2 1.1-.5.4-.3.8-.5.3-.2.6-.2.6 0 .6.8-.1.6-.7 1.2t-1.6.9q-1 .4-2.3.4Zm1-7.4q-.9 0-1.6.7-.7.6-1 1.6.2 0 .5.1h.7q1 0 1.7-.4.6-.4.7-1 0-1-1-1Z",
  instruction:
    "M1.9 15.9q-.8 0-1.2-.3-.4-.4-.4-.9.1-.3.3-.5.2-.2.6-.3.8-.1 1.4-.2h1.2q-.2-.4-.1-.8 0-1.3.2-2.4.1-1.2.2-2.1v-.3q-.7 0-1.2.1t-1 .1q-.7 0-.9-.3-.3-.4-.3-.8.1-.4.3-.6.3-.3.9-.4.9-.1 2-.2T6 5.8h1.9q.9 0 1.2.2.3.2.2.7 0 .6-.5.9-.5.4-1.2.4H6.1q.1.3.1.7 0 .6-.2 1.8-.1 1.2-.2 2.7 0 .3-.1.4.4.1.9.1h1q1 0 1.2.2.3.3.3.7 0 .5-.5.8-.4.3-1.2.3-1.9 0-3.3.1t-2.2.1Zm16.4.8q-.9 0-1.4-1.3-.5-1.3-.4-3.8v-1q0-.4-.1-.6h-.1q-.3 0-.8.4-.4.4-.9 1.1-.5.8-.9 1.8-.5 1-.9 2.1-.2.6-.4.9-.3.2-.7.2-.7 0-1-.7-.3-.8-.3-1.9.1-.7.2-1.2 0-.5.1-1 .1-.4.2-.9t.2-1.2q0-.3.2-.6.2-.2.6-.2.4 0 .8.4.3.4.3 1.1-.1.2-.1.5 0 .2-.1.4.9-1.6 1.8-2.5 1-.8 2-.8t1.5.7q.5.7.5 1.8-.1 1.9 0 2.9.1 1.1.5 1.6.4.3.3.8 0 .4-.3.7-.3.3-.8.3Zm4.7.3q-.9 0-1.5-.3-.6-.2-.9-.7-.3-.4-.2-.8 0-.3.1-.5.2-.2.6-.2.2 0 .5.1.2.1.6.2.3.2.9.2.9 0 1.5-.3.6-.2 1-.8-.1-.3-.6-.5-.4-.2-.9-.3-.6-.2-1.1-.4-.6-.2-1.1-.5-.5-.3-.8-.8-.3-.4-.2-1.1 0-.9.5-1.5.4-.6 1.1-1 .6-.4 1.5-.6.8-.2 1.6-.1.8 0 1.2.4.4.5.4 1-.1.7-.8.7h-.9q-1 0-1.7.3-.6.2-1 .9.2.3.6.5.4.2 1 .3.5.2 1.1.4.6.2 1.1.4.5.3.8.8.3.4.2 1.1 0 1.1-.7 1.7-.6.7-1.7 1.1-1 .3-2.2.3Zm9.8-.5q-1.4 0-2.1-.5-.8-.6-1.1-1.6-.3-1.1-.2-2.4 0-1 .2-1.8.1-.7.3-1.4.1-.7.2-1.5.1-.7 0-1.2 0-.5.1-.9 0-.4.2-.6.1-.2.6-.2.8 0 1.1.7.3.6.2 2.1-.1.4-.1.7-.1.4-.2.7.7-.2 1.4-.2.7-.1 1.2-.1.8 0 1.2.3.4.4.4.9 0 .3-.2.4-.2.2-.5.2-.8.1-1.5.2-.6 0-1.2.2-.6.1-1.2.3 0 .3-.1.5v.7q-.1 1.3.3 1.8.4.6 1.3.6.3 0 .5-.1t.4-.1.4-.1q.7 0 .6.8 0 .7-.6 1.2-.6.4-1.6.4Zm6 0q-.5 0-.8-.5-.4-.4-.4-1.1.1-1.4.1-2.4-.1-1.1-.3-1.8-.1-.4-.1-.6-.1-.2 0-.4 0-.3.2-.5t.6-.2q.6 0 1 .4t.5 1.5q.8-1.3 1.8-2 1.1-.8 1.9-.8.6 0 .8.4.2.3.1.9 0 .3-.1.5-.2.3-.7.5-1.1.4-1.9 1.1-.7.6-1.1 1.5-.4.9-.5 2-.2.9-.4 1.2-.2.3-.7.3Zm10.7-.3q-1.1 0-1.9-.4-.8-.4-1.3-1.1-.5-.7-.8-1.5-.2-.8-.2-1.6 0-.7.2-1.3.2-.7.5-1.3 0-.2.3-.4.2-.1.5-.1.5 0 .8.3.3.4.3.9 0 .3-.1.5l-.2.6q-.1.4-.2.9 0 .6.3 1.1.2.6.7 1 .4.3.9.3.9 0 1.4-.8.6-.9.6-2.3.1-.5.1-.9-.1-.3-.1-.7.1-.4.2-.7.2-.3.7-.3.6 0 1 .6.3.6.2 1.8-.1 1.8-.6 3-.6 1.2-1.4 1.8-.9.6-1.9.6Zm9-.1q-1.2 0-2-.4-.7-.5-1.1-1.3-.4-.8-.3-1.8 0-.8.4-1.6.3-.7.9-1.3.7-.6 1.4-.9.8-.3 1.7-.3.5 0 1 .3t.4 1.1q0 .5-.2.8-.3.3-.7.3-.2 0-.3-.1l-.2-.2q-.1-.1-.3-.1-.6 0-1 .3-.5.3-.7.8-.3.5-.3 1-.1.6.3 1 .3.4 1 .4t1-.2q.4-.1.6-.3.2-.2.4-.3.2-.1.5-.1.6 0 .6.8-.1.6-.5 1.1-.4.5-1.1.7-.7.3-1.5.3Zm8.1.4q-1.4 0-2.1-.5-.8-.6-1.1-1.6-.3-1.1-.2-2.4 0-1 .2-1.8.1-.7.3-1.4.1-.7.2-1.5.1-.7.1-1.2-.1-.5 0-.9 0-.4.2-.6.2-.2.6-.2.8 0 1.1.7.3.6.2 2.1-.1.4-.1.7-.1.4-.2.7.7-.2 1.4-.2.7-.1 1.2-.1.8 0 1.2.3.4.4.4.9 0 .3-.2.4-.2.2-.5.2-.8.1-1.5.2-.6 0-1.2.2-.6.1-1.2.3v.5q-.1.3-.1.7-.1 1.3.3 1.8.4.6 1.3.6.3 0 .5-.1t.4-.1.4-.1q.7 0 .6.8 0 .7-.6 1.2-.6.4-1.6.4Zm5.9 0q-.5 0-.9-.5-.4-.4-.3-1 0-1 .1-1.6v-1.9q0-.6.4-1 .4-.5 1-.5.5 0 .8.3.3.4.3 1-.1.3-.1.8-.1.6-.1 1.3-.1.7-.2 1.3v.9q-.1.4-.3.6-.2.3-.7.3Zm.4-9.2q-.7 0-1.1-.3-.4-.4-.4-1 .1-.6.5-.9.5-.4 1.1-.4.7 0 1.1.4.3.5.3.9 0 .5-.4.9t-1.1.4ZM80 16q-1.3 0-2.2-.5-1-.5-1.4-1.3-.5-.9-.5-2 .1-.7.4-1.4.4-.6.9-1.2.5-.5 1.2-.8.6-.2 1.1-.2.4 0 .6.1h.2q1.8 0 2.7 1 1 1 .9 2.6 0 1.1-.6 2-.5.8-1.4 1.3-.9.4-1.9.4Zm-2-3.6q0 .7.5 1.1.5.5 1.4.5.8 0 1.4-.5.5-.4.5-1.2.1-.8-.3-1.2-.4-.4-1.1-.4-.4 0-.7.1-.3.2-.6.5l-.5.5q-.2.1-.5.2-.1.1-.1.4Zm15.5 4.3q-1 0-1.5-1.3t-.4-3.8v-1q0-.4-.1-.6h-.1q-.3 0-.7.4-.5.4-1 1.1l-.9 1.8q-.5 1-.8 2.1-.2.6-.5.9-.3.2-.7.2-.7 0-1-.7-.3-.8-.2-1.9 0-.7.1-1.2l.2-1q.1-.4.1-.9.1-.5.2-1.2 0-.3.2-.6.2-.2.6-.2.5 0 .8.4.3.4.3 1.1 0 .2-.1.5 0 .2-.1.4.9-1.6 1.9-2.5 1-.8 1.9-.8 1 0 1.5.7.6.7.5 1.8-.1 1.9 0 2.9.1 1.1.5 1.6.4.3.3.8 0 .4-.3.7-.3.3-.7.3Z",
  button: "",
};

const placeholder_image = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200' fill='none'%3E%3Cg opacity='.5'%3E%3Cg opacity='.5'%3E%3Cpath fill='%23FAFAFA' d='M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z' /%3E%3Cpath stroke='%23C9C9C9' stroke-width='2.418' d='M600.709 736.5c-75.454 0-136.621-61.167-136.621-136.62 0-75.454 61.167-136.621 136.621-136.621 75.453 0 136.62 61.167 136.62 136.621 0 75.453-61.167 136.62-136.62 136.62Z' /%3E%3C/g%3E%3Cpath stroke='url(%23a)' stroke-width='2.418' d='M0-1.209h553.581' transform='scale(1 -1) rotate(45 1163.11 91.165)' /%3E%3Cpath stroke='url(%23b)' stroke-width='2.418' d='M404.846 598.671h391.726' /%3E%3Cpath stroke='url(%23c)' stroke-width='2.418' d='M599.5 795.742V404.017' /%3E%3Cpath stroke='url(%23d)' stroke-width='2.418' d='m795.717 796.597-391.441-391.44' /%3E%3Cpath fill='%23fff' d='M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z' /%3E%3Cg clip-path='url(%23e)'%3E%3Cpath fill='%23666' fill-rule='evenodd' d='M616.426 586.58h-31.434v16.176l3.553-3.554.531-.531h9.068l.074-.074 8.463-8.463h2.565l7.18 7.181V586.58Zm-15.715 14.654 3.698 3.699 1.283 1.282-2.565 2.565-1.282-1.283-5.2-5.199h-6.066l-5.514 5.514-.073.073v2.876a2.418 2.418 0 0 0 2.418 2.418h26.598a2.418 2.418 0 0 0 2.418-2.418v-8.317l-8.463-8.463-7.181 7.181-.071.072Zm-19.347 5.442v4.085a6.045 6.045 0 0 0 6.046 6.045h26.598a6.044 6.044 0 0 0 6.045-6.045v-7.108l1.356-1.355-1.282-1.283-.074-.073v-17.989h-38.689v23.43l-.146.146.146.147Z' clip-rule='evenodd' /%3E%3C/g%3E%3Cpath stroke='%23C9C9C9' stroke-width='2.418' d='M600.709 656.704c-31.384 0-56.825-25.441-56.825-56.824 0-31.384 25.441-56.825 56.825-56.825 31.383 0 56.824 25.441 56.824 56.825 0 31.383-25.441 56.824-56.824 56.824Z' /%3E%3C/g%3E%3Cdefs%3E%3ClinearGradient id='a' x1='554.061' x2='-.48' y1='.083' y2='.087' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23C9C9C9' stop-opacity='0' /%3E%3Cstop offset='.208' stop-color='%23C9C9C9' /%3E%3Cstop offset='.792' stop-color='%23C9C9C9' /%3E%3Cstop offset='1' stop-color='%23C9C9C9' stop-opacity='0' /%3E%3C/linearGradient%3E%3ClinearGradient id='b' x1='796.912' x2='404.507' y1='599.963' y2='599.965' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23C9C9C9' stop-opacity='0' /%3E%3Cstop offset='.208' stop-color='%23C9C9C9' /%3E%3Cstop offset='.792' stop-color='%23C9C9C9' /%3E%3Cstop offset='1' stop-color='%23C9C9C9' stop-opacity='0' /%3E%3C/linearGradient%3E%3ClinearGradient id='c' x1='600.792' x2='600.794' y1='403.677' y2='796.082' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23C9C9C9' stop-opacity='0' /%3E%3Cstop offset='.208' stop-color='%23C9C9C9' /%3E%3Cstop offset='.792' stop-color='%23C9C9C9' /%3E%3Cstop offset='1' stop-color='%23C9C9C9' stop-opacity='0' /%3E%3C/linearGradient%3E%3ClinearGradient id='d' x1='404.85' x2='796.972' y1='403.903' y2='796.02' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23C9C9C9' stop-opacity='0' /%3E%3Cstop offset='.208' stop-color='%23C9C9C9' /%3E%3Cstop offset='.792' stop-color='%23C9C9C9' /%3E%3Cstop offset='1' stop-color='%23C9C9C9' stop-opacity='0' /%3E%3C/linearGradient%3E%3CclipPath id='e'%3E%3Cpath fill='%23fff' d='M581.364 580.535h38.689v38.689h-38.689z' /%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E";

function SVGWrapper({
  editor,
  shape,
  ctx,
  children,
}: PropsWithChildren<{
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}>) {
  const bounds = editor.getShapeGeometry(shape).bounds;
  const width = bounds.width / (shape.props.scale ?? 1);
  const height = bounds.height / (shape.props.scale ?? 1);

  const scaleX = width / shape.props.w;
  const scaleY = height / shape.props.h;

  const theme = getDefaultColorTheme(ctx);

  return (
    <g>
      <g
        transform={`scale(${scaleX}, ${scaleY})`}
        clipPath="inset(0% round 10px)"
      >
        <rect
          x="0"
          y="0"
          width={shape.props.w}
          height={shape.props.h}
          fill={theme[shape.props.color].semi}
        ></rect>
        <g fill={theme[shape.props.color].solid} transform="translate(4, 4)">
          <circle cx="9" cy="12" r="2"></circle>
          <circle cx="9" cy="5" r="2"></circle>
          <circle cx="9" cy="19" r="2"></circle>
          <circle cx="15" cy="12" r="2"></circle>
          <circle cx="15" cy="5" r="2"></circle>
          <circle cx="15" cy="19" r="2"></circle>
        </g>
        <path
          fill={theme[shape.props.color].solid}
          d={HeaderPaths[shape.props.component]}
          transform="translate(30 5)"
        ></path>
        {/* <g
          fill="none"
          stroke={theme[shape.props.color].solid}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${shape.props.w - 60}, 5)`}
        >
          <path d="M20 7h-9" />
          <path d="M14 17H5" />
          <circle cx="17" cy="17" r="3" />
          <circle cx="7" cy="7" r="3" />
        </g> */}
        {/* <polygon
          stroke={theme[shape.props.color].solid}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points="6 3 20 12 6 21 6 3"
          transform={`translate(${shape.props.w - 30}, 5)`}
        ></polygon> */}
        {children}
      </g>
    </g>
  );
}

export async function imageSVG({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const image = shape.props.data.find((d) => d.type === "image");
  const data_url = image ? await getDataURIFromURL(image.src) : placeholder_image;
  return (
    <SVGWrapper editor={editor} shape={shape} ctx={ctx}>
      <image
        x="0"
        y="32"
        width={shape.props.w}
        height={shape.props.h - 32}
        preserveAspectRatio="xMidYMid slice"
        href={data_url}
      />
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M14.8182 21.7579 2.00488 29.3144c-1.9875039 1.1722-1.959754 4.0566.04996 5.1902L14.856 41.7259c.7398.4173 1.6347.5191 2.4041.1589 8.3475-3.9082 8.3486-16.2377.0466-20.2967-.7937-.388-1.7276-.279-2.4885.1698Zm1.61 1.627c-.0796-.0389-.2976-.0791-.5941.0957L3.02087 31.0371c-.6608.3898-.65151 1.3487.01658 1.7255l12.80115 7.2213c.2881.1625.4966.1255.5734.0896 6.7869-3.1775 6.8475-13.3487.0162-16.6886ZM30.086 7.98151 17.275.426192c-.7607-.4485936-1.6942-.557625-2.4878-.17025C6.47252 4.31532 6.44074 16.6577 14.7782 20.5553c.7684.3591 1.6619.257 2.4009-.1593 2.8838-1.6247 5.7775-3.2503 8.6712-4.8757 1.3947-.7835 2.7895-1.567 4.183-2.3503 2.012-1.131 2.0408-4.01606.0527-5.18849ZM16.259 2.14894 29.07 9.70423c.6615.39007.6501 1.34747-.0167 1.72237-1.3925.7827-2.7867 1.5659-4.1812 2.3492-2.8943 1.6258-5.7899 3.2524-8.6747 4.8777-.2884.1625-.4965.1254-.5723.0899-6.7602-3.1602-6.81829-13.34209.0396-16.69021.08-.03906.2981-.0789.5943.09575Z"
        clipRule="evenodd"
        style={{ mixBlendMode: "difference" }}
        transform={`translate(${shape.props.w - 52}, ${shape.props.h - 60})`}
      ></path>
    </SVGWrapper>
  );
}

function RichTextSVG({
  bounds,
  html,
  fontSize,
  font,
  align,
  verticalAlign,
  wrap,
  labelColor,
  padding,
}: Omit<RichTextSVGProps, "richText"> & {
  html: string;
}) {
  const textAlign =
    align === "middle"
      ? ("center" as const)
      : align === "start"
      ? ("start" as const)
      : ("end" as const);
  const justifyContent =
    align === "middle"
      ? ("center" as const)
      : align === "start"
      ? ("flex-start" as const)
      : ("flex-end" as const);
  const alignItems =
    verticalAlign === "middle"
      ? "center"
      : verticalAlign === "start"
      ? "flex-start"
      : "flex-end";
  const wrapperStyle = {
    display: "flex",
    height: `100%`,
    justifyContent,
    alignItems,
    padding: `${padding}px`,
  };
  const style = {
    fontSize: `${fontSize}px`,
    fontFamily: DefaultFontFamilies[font],
    wrap: wrap ? "wrap" : "nowrap",
    color: labelColor,
    lineHeight: TEXT_PROPS.lineHeight,
    textAlign,
    width: "100%",
    wordWrap: "break-word" as const,
    overflowWrap: "break-word" as const,
    // borderColor,
    whiteSpace: "pre-wrap",
  };

  return (
    <foreignObject
      x={bounds.minX}
      y={bounds.minY}
      width={bounds.w}
      height={bounds.h}
      className="tl-export-embed-styles tl-rich-text tl-rich-text-svg"
    >
      <div style={wrapperStyle}>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: html,
          }}
          style={style}
        />
      </div>
    </foreignObject>
  );
}

export function textSVG({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const theme = getDefaultColorTheme(ctx);
  const exportBounds = new Box(0, 24, shape.props.w, shape.props.h - 24);
  return (
    <SVGWrapper editor={editor} shape={shape} ctx={ctx}>
      <RichTextSVG
        fontSize={FONT_SIZES[shape.props.size]}
        font={shape.props.font}
        align="start"
        verticalAlign="start"
        html={shape.props.value}
        labelColor={theme[shape.props.color].solid}
        bounds={exportBounds}
        wrap
        padding={10}
      />
    </SVGWrapper>
  );
}

const ICON_SIZES = {
  s: 16,
  m: 24,
  l: 32,
  xl: 48,
};

export function buttonSVG({
  editor,
  shape,
  ctx,
}: {
  editor: Editor;
  shape: ComponentShape;
  ctx: SvgExportContext;
}) {
  const bounds = editor.getShapeGeometry(shape).bounds;
  const width = bounds.width / (shape.props.scale ?? 1);
  const height = bounds.height / (shape.props.scale ?? 1);

  const size = ICON_SIZES[shape.props.size];
  const scaleX = 24 / size;
  const scaleY = 24 / size;

  const theme = getDefaultColorTheme(ctx);

  const min = Math.min(width, height);

  return (
    <g>
      <g height={height} width={width}>
        <circle
          cx={width / 2}
          cy={height / 2}
          r={min / 2}
          fill={theme[shape.props.color].semi}
        />
        <g
          transform={`translate(${(width - 24) / 2}, ${
            (height - 24) / 2
          }) scale(${scaleX}, ${scaleY})`}
          fill="none"
          stroke={theme[shape.props.color].solid}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
        >
          <path d="m6 3 14 9-14 9V3z" />
        </g>
      </g>
    </g>
  );
}

// import satori from "satori";
// import { Parser } from "html-to-react";
// import { ComponentShape } from ".";
// import {
//   Editor,
//   FileHelpers,
//   getDefaultColorTheme,
//   SvgExportContext,
// } from "tldraw";
// import React, { JSX } from "react";

// const htmlToReactParser = Parser();

// async function getDataURIFromURL(url: string): Promise<string> {
//   const response = await fetch(url);
//   const blob = await response.blob();
//   return FileHelpers.blobToDataUrl(blob);
// }

// export const topBarContent = (props: { type: string }) => (
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       width: "100%",
//       padding: "8px",
//       borderTopLeftRadius: "0.625rem",
//       borderTopRightRadius: "0.625rem",
//       flexShrink: 0,
//     }}
//   >
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "4px",
//         textTransform: "capitalize",
//         fontSize: "14px",
//         flexShrink: 0,
//       }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         stroke-width="2"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       >
//         <circle cx="9" cy="12" r="1" />
//         <circle cx="9" cy="5" r="1" />
//         <circle cx="9" cy="19" r="1" />
//         <circle cx="15" cy="12" r="1" />
//         <circle cx="15" cy="5" r="1" />
//         <circle cx="15" cy="19" r="1" />
//       </svg>
//       {props.type}
//     </div>
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//       }}
//     >
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         width="16"
//         height="16"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         stroke-width="2"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       >
//         <polygon points="6 3 20 12 6 21 6 3" />
//       </svg>
//     </div>
//   </div>
// );

// export const textContent = (props: { html: string }) => (
//   <div
//     style={{
//       display: "flex",
//       height: "100%",
//       width: "100%",
//       flexGrow: 1,
//       flexShrink: 1,
//     }}
//   >
//     <p
//       style={{
//         margin: 0,
//         padding: "8px",
//         fontSize: 16,
//         height: "100%",
//         width: "100%",
//         textWrap: "wrap",
//       }}
//     >
//       {htmlToReactParser.parse(props.html)}
//     </p>
//   </div>
// );

// export const imageContent = (props: {
//   src: string;
//   height: number;
//   width: number;
// }) => (
//   <img
//     src={props.src}
//     // height={props.height}
//     // width={props.width}
//     style={{
//       height: "100%",
//       width: "100%",
//       objectFit: "cover",
//       objectPosition: "center",
//       borderBottomLeftRadius: "10px",
//       borderBottomRightRadius: "10px",
//     }}
//   />
// );

// const getContent = async ({ shape }: { shape: ComponentShape }) => {
//   switch (shape.props.component) {
//     case "image": {
//       const img = shape.props.data.find((d) => d.type === "image")!;
//       // const dataUrl = await getDataURIFromURL(img.src);
//       return imageContent({
//         src: img.src,
//         height: img.height,
//         width: img.width,
//       });
//     }
//     case "text": {
//       return textContent({ html: shape.props.value });
//     }
//   }
// };

// export const toSvg = async (
//   editor: Editor,
//   shape: ComponentShape,
//   ctx: SvgExportContext
// ) => {
//   const bounds = editor.getShapeGeometry(shape).bounds;
//   const width = bounds.width / (shape.props.scale ?? 1);
//   const height = bounds.height / (shape.props.scale ?? 1);

//   const theme = getDefaultColorTheme(ctx);
//   const fonts = ["/fonts/roboto.woff"];
//   const fontData = await Promise.all(
//     fonts.map(async (url) => fetch(url).then((res) => res.arrayBuffer()))
//   );

//   const topBar = topBarContent({ type: shape.props.component });
//   const content = await getContent({ shape });

//   const html = await satori(
//     <div
//       style={{
//         height: "100%",
//         width: "100%",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: theme[shape.props.color].semi,
//         color: theme[shape.props.color].solid,
//         fontSize: 32,
//         fontWeight: 600,
//         borderRadius: "10px",
//       }}
//     >
//       {topBar}
//       <div
//         style={{
//           display: "flex",
//           height: "100%",
//           width: "100%",
//           flexGrow: 1,
//           flexShrink: 1,
//         }}
//       >
//         {content}
//       </div>
//     </div>,
//     {
//       fonts: [
//         {
//           name: "roboto",
//           data: fontData[0],
//           weight: 600,
//           style: "normal",
//         },
//       ],
//       height: height,
//       width: width,
//     }
//   );
//   return htmlToReactParser.parse(html) as JSX.Element;
// };

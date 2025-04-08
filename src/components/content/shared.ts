import { TLDefaultSizeStyle } from "tldraw";
import React from "react";

export const FONT_SIZES: Record<TLDefaultSizeStyle, number> = {
  s: 12,
  m: 16,
  l: 22,
  xl: 38,
};

export const stopEventPropagationNoZoom = (event: React.WheelEvent) => {
  if (!event.ctrlKey) event.stopPropagation();
};

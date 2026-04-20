"use client";

import Script from "next/script";

export function BeholdWidget() {
  return (
    <>
      <behold-widget feed-id="B65YMzAjAvYPa4RJ6rfg" />
      <Script
        src="https://w.behold.so/widget.js"
        type="module"
        strategy="lazyOnload"
      />
    </>
  );
}

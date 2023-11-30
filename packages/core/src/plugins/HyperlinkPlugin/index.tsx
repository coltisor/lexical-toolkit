import React from "react";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { AUTOLINK_MATCHERS } from "./AutoLinkMatchers";

export type HyperlinkPluginProps = {
  validateUrl?: (url: string) => boolean;
  shouldAutoLink?: boolean;
};

export function HyperlinkPlugin(props: HyperlinkPluginProps) {
  const { validateUrl, shouldAutoLink = true } = props;

  return (
    <>
      <LinkPlugin validateUrl={validateUrl} />
      {shouldAutoLink ? <AutoLinkPlugin matchers={AUTOLINK_MATCHERS} /> : <></>}
    </>
  );
}

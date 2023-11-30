import React from "react";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { AUTOLINK_MATCHERS } from "./AutoLinkMatchers";

type LexicalLinkPluginProps = {
  validateUrl?: (url: string) => boolean;
  shouldAutoLink?: boolean;
};

export default function HyperlinkPlugin(props: LexicalLinkPluginProps) {
  const { validateUrl, shouldAutoLink = true } = props;

  return (
    <>
      <LinkPlugin validateUrl={validateUrl} />
      {shouldAutoLink ? <AutoLinkPlugin matchers={AUTOLINK_MATCHERS} /> : <></>}
    </>
  );
}

"use client";

import React, { Dispatch } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalToolbar } from "lexical-toolkit";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaUnderline,
} from "react-icons/fa";
import { Button } from "@/components/Button";

type ToolbarProps = {
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
};

export const Toolbar = (props: ToolbarProps) => {
  const { setIsLinkEditMode } = props;

  const [editor] = useLexicalComposerContext();
  const toolbar = useLexicalToolbar({
    editor: editor,
  });

  return (
    <div className="flex w-full border-b border-gray-200 text-xl text-gray-600">
      <div className="flex w-full border-b border-gray-200 text-xl text-gray-600">
        <Button
          className="border-r"
          onClick={() => toolbar.bold.dispatch()}
          active={toolbar.bold.active}
        >
          <FaBold height={10} width={10} title={toolbar.bold.title} />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.italic.dispatch()}
          active={toolbar.italic.active}
        >
          <FaItalic height={10} width={10} title={toolbar.italic.title} />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.underline.dispatch()}
          active={toolbar.underline.active}
        >
          <FaUnderline height={10} width={10} title={toolbar.underline.title} />
        </Button>
        <Separator />
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.paragraph.dispatch()}
          active={toolbar.blockFormatting.paragraph.active}
        >
          <FaParagraph
            height={10}
            width={10}
            title={toolbar.blockFormatting.paragraph.title}
          />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.h1.dispatch()}
          active={toolbar.blockFormatting.h1.active}
        >
          <span title={toolbar.blockFormatting.h1.title}>
            H<sub>1</sub>
          </span>
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.h2.dispatch()}
          active={toolbar.blockFormatting.h2.active}
        >
          <span title={toolbar.blockFormatting.h2.title}>
            H<sub>2</sub>
          </span>
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.h3.dispatch()}
          active={toolbar.blockFormatting.h3.active}
        >
          <span title={toolbar.blockFormatting.h3.title}>
            H<sub>3</sub>
          </span>
        </Button>
        <Separator />
        <Button
          className="border-r"
          onClick={() => {
            setIsLinkEditMode(true);
            toolbar.link.dispatch();
          }}
          active={toolbar.link.active}
        >
          <FaLink height={10} width={10} title={toolbar.link.title} />
        </Button>
        <Separator />
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.bulletList.dispatch()}
          active={toolbar.blockFormatting.bulletList.active}
        >
          <FaListUl
            height={10}
            width={10}
            title={toolbar.blockFormatting.bulletList.title}
          />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.blockFormatting.numberList.dispatch()}
          active={toolbar.blockFormatting.numberList.active}
        >
          <FaListOl
            height={10}
            width={10}
            title={toolbar.blockFormatting.numberList.title}
          />
        </Button>
        <Separator />
        <Button
          className="border-r"
          onClick={() => toolbar.elementFormatting.leftAlign.dispatch()}
          active={toolbar.elementFormatting.leftAlign.active}
        >
          <FaAlignLeft
            height={10}
            width={10}
            title={toolbar.elementFormatting.leftAlign.title}
          />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.elementFormatting.centerAlign.dispatch()}
          active={toolbar.elementFormatting.centerAlign.active}
        >
          <FaAlignCenter
            height={10}
            width={10}
            title={toolbar.elementFormatting.centerAlign.title}
          />
        </Button>
        <Button
          className="border-r"
          onClick={() => toolbar.elementFormatting.rightAlign.dispatch()}
          active={toolbar.elementFormatting.rightAlign.active}
        >
          <FaAlignRight
            height={10}
            width={10}
            title={toolbar.elementFormatting.rightAlign.title}
          />
        </Button>
      </div>
    </div>
  );
};

const Separator = () => {
  return <span className="mr-1 w-[8px] border-r border-gray-200" />;
};

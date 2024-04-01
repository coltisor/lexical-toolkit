import { sanitizeUrl, useHyperlinkEditor, validateUrl } from "lexical-toolkit";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { getLinkEditorPosition } from "./getLinkEditorPosition";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/Button";
import { FaX } from "react-icons/fa6";
import { FaCheck, FaEdit, FaTrash } from "react-icons/fa";

export type LinkEditorProps = {
  anchorElem: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
};

export const LinkEditor = (props: LinkEditorProps) => {
  const { anchorElem, isLinkEditMode, setIsLinkEditMode } = props;

  const [editor] = useLexicalComposerContext();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editedLinkUrl, setEditedLinkUrl] = useState("");

  const {
    currentNodeIsLink,
    linkUrl,
    dispatchLinkSubmission,
    dispatchLinkRemoval,
    linkNodeRect,
  } = useHyperlinkEditor({
    editor: editor,
    anchorElem: anchorElem,
  });

  useEffect(() => {
    if (isLinkEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLinkEditMode, currentNodeIsLink]);

  useEffect(() => {
    if (!currentNodeIsLink) {
      setEditedLinkUrl("");
      setIsLinkEditMode(false);
    }
  }, [currentNodeIsLink]);

  useEffect(() => {
    if (!editorRef.current) {
      console.error("RichTextEditorLink: no editor ref");
      return;
    }

    const editorElem = editorRef.current;
    if (currentNodeIsLink) {
      if (linkNodeRect) {
        console.log("RichTextEditorLink");
        const position = getLinkEditorPosition({
          linkNodeRect: linkNodeRect,
          anchorElem: anchorElem,
        });
        editorElem.style.opacity = "1";
        editorElem.style.transform = `translate(${position.x}px, ${position.y}px)`;
      } else {
        console.error("RichTextEditorLink: no link node position");
      }
    } else {
      editorElem.style.opacity = "0";
      editorElem.style.transform = "translate(-10000px, -10000px)";
    }
  }, [linkNodeRect, currentNodeIsLink]);

  const handleLinkSubmission = () => {
    const url = sanitizeUrl(editedLinkUrl);
    const urlIsValid = validateUrl(url);

    if (editedLinkUrl && urlIsValid) {
      dispatchLinkSubmission({ url: url });
    } else {
      // @todo show error message
      dispatchLinkRemoval();
    }
    setIsLinkEditMode(false);
  };

  return createPortal(
    <div
      ref={editorRef}
      className={
        "absolute left-0 top-0 z-10 box-border flex w-full max-w-[400px] rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-600 transition-opacity duration-500 will-change-transform"
      }
    >
      {isLinkEditMode ? (
        <div className={"flex w-full items-center gap-1"}>
          <input
            ref={inputRef}
            value={editedLinkUrl}
            className={
              "block flex-grow rounded-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
            placeholder={"https://www.google.com/"}
            onChange={(event) => {
              setEditedLinkUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleLinkSubmission();
              } else if (event.key === "Escape") {
                event.preventDefault();
                setIsLinkEditMode(false);
              }
            }}
          />
          <Button
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              handleLinkSubmission();
            }}
          >
            <FaCheck width={10} height={10} />
          </Button>
          <Button
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setIsLinkEditMode(false);
            }}
          >
            <FaX width={10} height={10} />
          </Button>
        </div>
      ) : (
        <div className={"flex w-full items-center gap-1"}>
          <a
            href={sanitizeUrl(linkUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className={
              "flex-grow overflow-hidden text-ellipsis whitespace-nowrap font-sans text-sm text-blue-500 no-underline antialiased hover:underline"
            }
          >
            {linkUrl}
          </a>
          <Button
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setEditedLinkUrl(linkUrl);
              setIsLinkEditMode(true);
            }}
          >
            <FaEdit width={10} height={10} />
          </Button>
          <Button
            onMouseDown={(event) => event.preventDefault()}
            onClick={dispatchLinkRemoval}
          >
            <FaTrash width={10} height={10} />
          </Button>
        </div>
      )}
    </div>,
    anchorElem,
  );
};

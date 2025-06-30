"use client";
import { MessageType } from "@axflow/models/shared";
import React, { useState, useEffect } from "react";
import AskNinaIcon from "@public/logos/antenna-90x90.png";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

import {
  BsFillHandThumbsUpFill,
  BsHandThumbsUp,
  BsHandThumbsDown,
  BsHandThumbsDownFill,
} from "react-icons/bs";
import { AdditionalMessageDetails } from "@/types/chat";
import { useConversationStore } from "@/providers/conversationStoreProvider";

interface LinkPreview {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
}

interface SystemResponseProps {
  message: MessageType & AdditionalMessageDetails;
  isCurrentChat: boolean;
  isLoading: boolean;
  isResponded: boolean;
}
const SystemResponse = ({ message, isLoading }: SystemResponseProps) => {
  const { respondToMessage } = useConversationStore((state) => state);

  const [response, setResponse] = useState(message.response);

  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const extractUrls = (text: string): string[] => {
    const urlRegex =
      /(https?:\/\/[^\s\)]+|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
    return text.match(urlRegex) || [];
  };
  const makeUrlsClickable = (text: string): string => {
    // regex to pull the URLs from chat response
    const urlRegex =
      /([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;

    return text.replace(urlRegex, (url) => {
      const fullUrl = `https://${url}`;
      return `[${url}](${fullUrl})`;
    });
  };
  // // remove once the link preview works
  // console.log("Raw mesg", message.content);
  // const urls = extractUrls(message.content);
  // console.log("regex found urlss", urls);

  const fetchLinkPreview = async (url: string): Promise<LinkPreview | null> => {
    try {
      const response = await fetch("/api/link-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      return response.ok ? await response.json() : null;
    } catch (error) {
      console.error("Error fetching link preview:", error);
      return null;
    }
  };

  useEffect(() => {
    const processLinks = async () => {
      if (!message.content || isLoading) return;

      const urls = extractUrls(message.content);
      console.log("🔍 Raw message content:", message.content);
      console.log("🔗 URLs found for previews:", urls);
      if (urls.length === 0) return;

      setLoadingPreviews(true);
      const previews: LinkPreview[] = [];

      for (const url of urls.slice(0, 3)) {
        // const preview = await fetchLinkPreview(url);
        // if (preview) previews.push(preview);
        previews.push({
          url: `https://${url}`,
          title: url,
          description: `Preview for ${url}`,
          image: `https://www.google.com/s2/favicons?sz=64&domain=${url}`,
          domain: url,
        });
      }

      setLinkPreviews(previews);
      setLoadingPreviews(false);
    };

    processLinks();
  }, [message.content, isLoading]);
  const handleResponse = (response: boolean) => {
    setResponse({ liked: response, timeResponded: new Date().toDateString() });
    respondToMessage(message.id, response);
  };

  return (
    <div className="w-full flex flex-row justify-center bg-grey-100 border border-grey-300 px-1 md:px-4 py-4 font-nunito">
      <div className="flex flex-row max-w-screen-lg">
        <div className="relative w-12 h-12 p-1 mr-4 self-start">
          <Image
            src={AskNinaIcon}
            alt="ask nina in purple"
            className="shadow-md"
          />
        </div>
        <div className="flex-1 break-words space-y-2">
          {/* Converts Markdown into HTML, link opens in a new tsb */}
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {makeUrlsClickable(message.content)}
          </ReactMarkdown>
          {loadingPreviews && (
            <div className="flex items-center gap-2 text-sm text-gray-500 my-3">
              <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              <span>Loading link previews...</span>
            </div>
          )}

          {linkPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {linkPreviews.map((link, index) => (
                <a
                  key={`${link.url}-${index}`}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#ECECF1] text-[#423EEE] rounded-lg text-sm font-medium hover:shadow-[0_0_16px_rgba(242,103,237,0.3)] transition-all duration-300 border border-[#C5C5D1]"
                >
                  {link.domain} ↗
                </a>
              ))}
            </div>
          )}
        </div>
        {!isLoading && (
          <div className="w-16 flex flex-row items-center justify-around self-end">
            {response?.liked ? (
              <div>
                <BsFillHandThumbsUpFill />
              </div>
            ) : (
              <button onClick={() => handleResponse(true)}>
                <BsHandThumbsUp />
              </button>
            )}

            {response?.timeResponded ? (
              <div className="scale-x-[-1]">
                {response.liked ? (
                  <button onClick={() => handleResponse(false)}>
                    <BsHandThumbsDown />
                  </button>
                ) : (
                  <BsHandThumbsDownFill />
                )}
              </div>
            ) : (
              <button
                className="scale-x-[-1]"
                onClick={() => handleResponse(false)}
              >
                <BsHandThumbsDown />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemResponse;

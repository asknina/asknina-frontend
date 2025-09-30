"use client";
import { MessageType } from "@axflow/models/shared";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
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
  domain: string;
}

interface SystemResponseProps {
  message: MessageType & AdditionalMessageDetails;
  isCurrentChat: boolean;
  isLoading: boolean;
  isResponded: boolean;
}
const SystemResponse = ({ message, isLoading }: SystemResponseProps) => {
  const { respondToMessage } = useConversationStore();
  const [response, setResponse] = useState(message.response);
  const [showModal, setShowModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);

  const handleExternalLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setPendingUrl(url);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    // if (pendingUrl && pendingUrl !== undefined) {
    //   window.open(pendingUrl, "_blank", "noopener,noreferrer");
    // }
    setShowModal(false);
    setPendingUrl("");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setPendingUrl("");
  };
  const URL_REGEX =
    /[a-zA-Z0-9][a-zA-Z0-9.-]*[a-zA-Z0-9]\.[a-zA-Z]{2,}(?:\/[^\s]*)?/g;

  const extractUrls = (text: string): string[] => {
    return text.match(URL_REGEX) || [];
  };

  const makeUrlsClickable = (text: string): string => {
    // regex to pull the URLs from chat respone
    return text.replace(URL_REGEX, (url) => {
      const fullUrl = `https://${url}`;
      return `[${url}](${fullUrl})`;
    });
  };

  useEffect(() => {
    const processLinks = () => {
      if (!message.content || isLoading) return;

      const urls = extractUrls(message.content);

      if (urls.length === 0) return;

      const previews: LinkPreview[] = [];

      for (const url of urls) {
        previews.push({
          url: `https://${url}`,
          domain: url,
        });
      }

      setLinkPreviews(previews);
    };

    processLinks();
  }, [message.content, isLoading]);
  const handleResponse = (response: boolean) => {
    setResponse({ liked: response, timeResponded: new Date().toDateString() });
    respondToMessage(message.id, response);
  };

  return (
    <>
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
                  <a
                    href={href}
                    onClick={(e) => handleExternalLinkClick(e, href!)}
                    className="text-[#423EEE] hover:text-[#F267ED] cursor-pointer underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {makeUrlsClickable(message.content)}
            </ReactMarkdown>

            {linkPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {linkPreviews.map((link, index) => (
                  <button
                    key={`${link.url}-${index}`}
                    onClick={(e) => handleExternalLinkClick(e, link.url)}
                    className="inline-flex items-center px-4 py-2 bg-[#ECECF1] text-[#423EEE] rounded-lg text-sm font-medium hover:shadow-[0_0_16px_rgba(242,103,237,0.3)] transition-all duration-300 border border-[#C5C5D1]"
                  >
                    {link.domain} ↗
                  </button>
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
      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        className="bg-white rounded-2xl p-6 max-w-sm mx-auto mt-20 shadow-2xl border-2 border-pink-400"
        overlayClassName="fixed inset-0 bg-gray-700 bg-opacity-70 flex items-center justify-center z-50 p-4"
        ariaHideApp={false}
      >
        {/* Leaving aSK Nina Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-gray-700 mb-2 font-mono">
            Hey! You&apos;re heading off-site
          </h3>
          <p className="text-gray-500 font-sans text-sm">
            This link will take you away from Ask Nina AI✨
          </p>
        </div>

        {/* URL destination */}
        <div className="mb-6">
          <p className="text-gray-700 font-sans text-sm mb-2 font-medium">
            You&apos;re going to:
          </p>
          <div className="border border-pink-400 rounded-xl p-4 break-all text-sm text-gray-700 font-sans text-center">
            {pendingUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleModalClose}
            className="px-5 py-3 bg-gray-300 text-gray-700 rounded-xl font-sans font-medium hover:bg-gray-400 hover:text-white transition-all duration-200 text-sm"
          >
            Stay here
          </button>
          <button
            onClick={handleModalConfirm}
            className="px-5 py-3 bg-gradient-to-r from-pink-400 to-purple-600 text-white rounded-xl font-sans font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
          >
            Let&apos;s go! →
          </button>
        </div>

        <div className="absolute top-4 right-4 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-3 h-3 bg-pink-200 rounded-full opacity-60"></div>
        <div className="absolute top-8 left-6 w-1 h-1 bg-pink-400 rounded-full opacity-80"></div>
      </Modal>
    </>
  );
};

export default SystemResponse;

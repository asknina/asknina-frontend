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

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  channelTitle?: string;
  publishedAt?: string;
  duration?: string;
  viewCount?: string;
  embedUrl?: string;
  watchUrl?: string;
}

interface ImageItem {
  url: string;
  title?: string;
  thumbnail?: string;
}

interface MediaContent {
  videos?: VideoItem[];
  images?: ImageItem[];
  searchQuery?: string;
  fetchedAt?: string;
}

interface SystemResponseProps {
  message: MessageType &
    AdditionalMessageDetails & {
      mediaContent?: MediaContent;
    };
  isCurrentChat: boolean;
  isLoading: boolean;
  isResponded: boolean;
}

const SystemResponse = ({ message, isLoading }: SystemResponseProps) => {
  const { respondToMessage } = useConversationStore((state) => state);
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
    if (pendingUrl && pendingUrl !== undefined) {
      window.open(pendingUrl, "_blank", "noopener,noreferrer");
    }
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

  // Check if we have media content from backend - handle the actual data structure
  const messageData = (message as any).data || [];
  const videosData =
    messageData.find((item: any) => item.type === "videos")?.videos || [];
  const imagesData =
    messageData.find((item: any) => item.type === "images")?.images || [];

  const hasMediaContent = videosData.length > 0 || imagesData.length > 0;

  // Debug logging for media content
  console.log("=== MEDIA DEBUG ===");
  console.log("Message object:", message);
  console.log("Message keys:", Object.keys(message));
  console.log("Message data:", (message as any).data);
  console.log("Videos data:", videosData);
  console.log("Images data:", imagesData);
  console.log("Has media content:", hasMediaContent);
  console.log("Message content:", message.content);
  console.log("Message role:", message.role);
  console.log("Message ID:", message.id);
  console.log("Full message JSON:", JSON.stringify(message, null, 2));
  console.log("===================");

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
          <div className="flex-1 break-words space-y-2 max-w-full overflow-hidden">
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

            {/* Media Content Display - Aligned with text container */}
            {hasMediaContent && (
              <div className="break-words space-y-2 max-w-full overflow-hidden">
                {/* Horizontal Scroll Container - aligned with text */}
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <div className="flex space-x-4 pb-2 flex-nowrap min-w-0 justify-center">
                    {/* Images */}
                    {imagesData.map((image: any, index: number) => (
                      <div
                        key={`image-${index}`}
                        className="flex-shrink-0 w-36 md:w-40 h-32 relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                        onClick={() => window.open(image.url, "_blank")}
                      >
                        <img
                          src={image.url}
                          alt={image.title || `Related image ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="w-6 h-6 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-gray-700"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Videos */}
                    {videosData.map((video: any, index: number) => (
                      <div
                        key={`video-${index}`}
                        className="flex-shrink-0 w-64 md:w-80 lg:w-96 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 custom-scrollbar"
                      >
                        {/* Video Thumbnail */}
                        <div className="relative w-full h-56">
                          {video.embedUrl ? (
                            <iframe
                              src={video.embedUrl}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="relative w-full h-full bg-gray-100">
                              {video.thumbnail ? (
                                <>
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title || "Video thumbnail"}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-[#423EEE] rounded-full flex items-center justify-center hover:bg-[#F267ED] transition-colors duration-200">
                                      <svg
                                        className="w-6 h-6 text-white ml-1"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                                      </svg>
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <div className="w-12 h-12 bg-[#423EEE] rounded-full flex items-center justify-center hover:bg-[#F267ED] transition-colors duration-200">
                                    <svg
                                      className="w-6 h-6 text-white ml-1"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Video Info */}
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-900 mb-1 overflow-hidden text-ellipsis">
                            {video.title || "Untitled Video"}
                          </h3>
                          <div className="flex items-center text-xs text-gray-600 mb-2">
                            <span className="font-medium text-gray-900">
                              {video.channelTitle || "Unknown Channel"}
                            </span>
                            {video.viewCount && (
                              <>
                                <span className="mx-1">•</span>
                                <span>
                                  {parseInt(video.viewCount).toLocaleString()}{" "}
                                  views
                                </span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (video.watchUrl) {
                                window.open(video.watchUrl, "_blank");
                              }
                            }}
                            className="w-full inline-flex items-center justify-center px-3 py-1 bg-[#423EEE] text-white text-xs font-medium rounded hover:bg-[#F267ED] transition-colors duration-200"
                            disabled={!video.watchUrl}
                          >
                            <svg
                              className="w-3 h-3 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                            </svg>
                            Watch
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {linkPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {linkPreviews.map((link, index) => (
                  <button
                    key={`${link.url}-${index}`}
                    onClick={(e) => handleExternalLinkClick(e, link.url)}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-primaryPurple text-white"
                  >
                    {link.domain}
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
            Hey! You're heading off-site
          </h3>
          <p className="text-gray-500 font-sans text-sm">
            This link will take you away from Ask Nina AI✨
          </p>
        </div>

        {/* URL destination */}
        <div className="mb-6">
          <p className="text-gray-700 font-sans text-sm mb-2 font-medium">
            You're going to:
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
            Let's go! →
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

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

  // Check if we have media content from backend
  const hasMediaContent =
    message.mediaContent &&
    ((message.mediaContent.videos && message.mediaContent.videos.length > 0) ||
      (message.mediaContent.images && message.mediaContent.images.length > 0));

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

            {/* Media Content Display */}
            {hasMediaContent && (
              <div className="mt-4 space-y-4">
                {/* Images Grid */}
                {message.mediaContent?.images &&
                  message.mediaContent.images.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <span>🖼️</span> Related Images
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {message.mediaContent.images.map((image, index) => (
                          <div
                            key={`image-${index}`}
                            className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                            onClick={() => window.open(image.url, "_blank")}
                          >
                            <img
                              src={image.url}
                              alt={image.title || `Related image ${index + 1}`}
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
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
                      </div>
                      {message.mediaContent.images.length > 6 && (
                        <p className="text-xs text-gray-500 text-center">
                          Showing 6 of {message.mediaContent.images.length}{" "}
                          images
                        </p>
                      )}
                    </div>
                  )}

                {/* Videos Grid */}
                {message.mediaContent?.videos &&
                  message.mediaContent.videos.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <span>🎥</span> Related Videos
                      </h4>
                      <div className="space-y-4">
                        {message.mediaContent.videos
                          .slice(0, 3)
                          .map((video, index) => (
                            <div
                              key={`video-${index}`}
                              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              {/* YouTube-style embedded video container */}
                              <div
                                className="relative w-full"
                                style={{ paddingBottom: "56.25%" }}
                              >
                                {video.embedUrl ? (
                                  <div className="relative w-full h-full">
                                    <iframe
                                      src={video.embedUrl}
                                      title={video.title}
                                      className="absolute top-0 left-0 w-full h-full"
                                      frameBorder="0"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                ) : (
                                  <div className="absolute top-0 left-0 w-full h-full bg-gray-100 flex items-center justify-center">
                                    {video.thumbnail ? (
                                      <div className="relative w-full h-full">
                                        <img
                                          src={video.thumbnail}
                                          alt={video.title || "Video thumbnail"}
                                          className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                                            <svg
                                              className="w-8 h-8 text-white ml-1"
                                              fill="currentColor"
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                                            </svg>
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                          <svg
                                            className="w-8 h-8 text-white ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                                          </svg>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                          Video not available
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* YouTube-style video info */}
                              <div className="p-4">
                                {/* Video title - YouTube style */}
                                <h3
                                  className="text-base font-medium text-gray-900 mb-2 overflow-hidden text-ellipsis"
                                  style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                  }}
                                >
                                  {video.title || "Untitled Video"}
                                </h3>

                                {/* Channel and stats - YouTube style */}
                                <div className="flex items-center text-sm text-gray-600 mb-3">
                                  <span className="font-medium text-gray-900">
                                    {video.channelTitle || "Unknown Channel"}
                                  </span>
                                  {video.viewCount && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>
                                        {parseInt(
                                          video.viewCount
                                        ).toLocaleString()}{" "}
                                        views
                                      </span>
                                    </>
                                  )}
                                  {video.publishedAt && (
                                    <>
                                      <span className="mx-1">•</span>
                                      <span>
                                        {new Date(
                                          video.publishedAt
                                        ).toLocaleDateString()}
                                      </span>
                                    </>
                                  )}
                                </div>

                                {/* Video description - YouTube style */}
                                {video.description && (
                                  <div className="mb-3">
                                    <p
                                      className="text-sm text-gray-700 overflow-hidden text-ellipsis"
                                      style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                      }}
                                    >
                                      {video.description}
                                    </p>
                                  </div>
                                )}

                                {/* YouTube-style action buttons */}
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <button
                                    onClick={() => {
                                      if (video.watchUrl) {
                                        window.open(video.watchUrl, "_blank");
                                      }
                                    }}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                                    disabled={!video.watchUrl}
                                  >
                                    <svg
                                      className="w-4 h-4 mr-2"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M6.3 4.1c0-.4.4-.7.8-.5l7.4 4.2c.4.2.4.8 0 1l-7.4 4.2c-.4.2-.8-.1-.8-.5V4.1z" />
                                    </svg>
                                    Watch on YouTube
                                  </button>

                                  {video.duration && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                      {video.duration}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                      {message.mediaContent.videos.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          Showing 3 of {message.mediaContent.videos.length}{" "}
                          videos
                        </p>
                      )}
                    </div>
                  )}

                {/* Search Query Info */}
              </div>
            )}

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

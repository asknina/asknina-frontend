import { MessageType } from "@axflow/models/shared";
import { FieldValue } from "firebase/firestore";

export interface DialogProps {
  role: SystemRoles;
  content: string;
  id: string;
  created: number;
}

export enum SystemRoles {
  USER = "user",
  SYSTEM = "system",
  ASSISTANT = "assistant",
}

export interface Conversation {
  conversationId: string;
  title: string;
  messages: MessageInfo[];
  promptQuestion?: string;
  created?: FieldValue;
}

export interface MessageInfo {
  [key: string]: string;
}

export interface MessageObj {
  [key: string]: MessageType;
}

export interface VideoItem {
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

export interface ImageItem {
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface MediaContent {
  videos?: VideoItem[];
  images?: ImageItem[];
  searchQuery?: string;
  fetchedAt?: string;
}

export interface AdditionalMessageDetails {
  response?: { liked: boolean; timeResponded: string };
  created?: FieldValue | number;
  updated?: FieldValue | number;
  mediaContent?: MediaContent;
}

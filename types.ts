declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    turnstile: any;
    particlesJS: {
      load: (id: string, path: string, callback?: () => void) => void;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

export type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type SiteVerifyRequest = {
  secret: string;
  response: string;
}

export type SiteVerifyResponse = {
  success: boolean;
  "error-codes": string[];
  challenge_ts: string;
  hostname: string;
}

export type Chat = {
  userId: string;
  title: string;
  chatId: string;
  createdTime?: number;
  updatedTime?: number;
  messages: Message[]
  visibility?: boolean;
}

export type Blog = {
  blogHandle: string;
  blogName: string;
  defaultVisibility?: boolean;
}

export type BlogPost = {
  chatId: string;
  title: string;
  description: string;
  updatedTime?: number;
  slug: string;
}
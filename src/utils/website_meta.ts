export const themes = ["theme"] as const;

export const types = [
  "ecommerce",
  "bussiness",
  "blog",
  "portfolio",
  "event",
  "personal",
  "forum",
  "membership",
  "nonprofit",
  "informational",
  "online_course",
  "job_board",
  "dating",
  "social_network",
  "music",
  "video",
  "photo",
  "app",
  "news",
  "magazine",
  "wiki",
] as const;

export const colors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "grey",
  "blue-grey",
  "black",
  "white",
] as const;

export type WebsiteMeta<Key extends keyof WebsiteRecord> = WebsiteRecord[Key];

export type WebsiteRecord = {
  theme: typeof themes;
  type: typeof types;
  color: typeof colors;
};

export type WebsiteMetaKey = keyof WebsiteRecord;

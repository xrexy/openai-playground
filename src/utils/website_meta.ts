export const themes = [""] as const;

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

export type WebsiteTheme = typeof themes[number];
export type WebsiteType = typeof types[number];
export type WebsiteColor = typeof colors[number];

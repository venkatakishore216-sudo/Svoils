export default function sitemap() {
  return [
    { url: "https://svoils.vercel.app", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://svoils.vercel.app/store", lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: "https://svoils.vercel.app/videos", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];
}

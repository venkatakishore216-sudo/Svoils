export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/"] },
    sitemap: "https://svoils.vercel.app/sitemap.xml",
  };
}

export const siteConfig = {
  name: "DeltaManager",
  description:
    "Plataforma contable y administrativa multiempresa con facturación CFDI, nómina y reportes inteligentes.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
  links: {
    twitter: "https://twitter.com/deltamanager",
    github: "https://github.com/deltamanager/deltamanager",
  },
};

export type SiteConfig = typeof siteConfig;



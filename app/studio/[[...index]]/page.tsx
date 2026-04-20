import { StudioClient } from "./studio-client";

export const metadata = {
  title: "Studio",
  description: "Interní CMS studio.",
  alternates: {
    canonical: "https://www.zdravimebavi.cz/studio"
  },
  robots: {
    index: false,
    follow: false
  }
};

export default function StudioPage() {
  return <StudioClient />;
}

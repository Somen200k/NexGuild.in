import { ScrollReset } from "@/components/ui/scroll-reset";
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScrollReset />
      {children}
      <ScrollToTop />
    </>
  );
}

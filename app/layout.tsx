import type {Metadata} from "next";
import "./globals.css";
 
// Font files can be colocated inside of `pages`
export const metadata: Metadata = {
  title: "Clock",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

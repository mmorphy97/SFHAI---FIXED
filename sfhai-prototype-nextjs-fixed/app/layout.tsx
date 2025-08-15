export const metadata = {
  title: "SFH AI Prototype",
  description: "South Florida Home-hunting AI prototype",
};

import "./../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

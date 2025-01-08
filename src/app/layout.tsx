import "./styles/globals.scss";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "CalmBridge",
  description: "Managing stress, anxiety, and depression",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </AuthProvider>
  );
}

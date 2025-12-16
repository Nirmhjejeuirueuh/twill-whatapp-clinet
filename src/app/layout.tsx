import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WhatsApp Web - Twilio',
  description: 'WhatsApp Web interface powered by Twilio',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';

export const metadata: Metadata = {
  title: 'Junto Feedback Practice | GFK Übung',
  description:
    'Übe Gewaltfreie Kommunikation in einem simulierten Feedbackgespräch mit KI-gestütztem Feedback.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased font-sans">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

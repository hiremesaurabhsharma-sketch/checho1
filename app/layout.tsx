import './globals.css';

export const metadata = {
  title: 'Checho1',
  description: 'Amazon seller analytics MVP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

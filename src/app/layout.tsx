import 'bootstrap/dist/css/bootstrap.min.css';
import { TRPCProvider } from './_trpc/Provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}

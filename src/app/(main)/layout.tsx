import OneTapComponent from "@/components/onetap";
import { validateRequest } from "@/lib/lucia/auth";
import Providers from "@/providers";
import SessionProvider from "@/providers/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await validateRequest();

  // if (!session.user && !session.session) redirect("/signin");
  return (
    <SessionProvider value={session}>
      <Providers>{children}</Providers>
      <OneTapComponent googleClientId={process.env.AUTH_GOOGLE_ID!} />
    </SessionProvider>
  );
}

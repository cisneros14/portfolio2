import { Footer } from "@/components/footer";
import Nav from "@/components/nav";
import WhatsappBtn from "@/components/whatsapp-btn";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <div className="relative px-4 sm:px-6 lg:px-8 py-30 bg-slate-100 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-7xl px-0 md:px-14">
          {children}
        </div>
      </div>
      <Footer />
      <WhatsappBtn />
    </>
  );
}

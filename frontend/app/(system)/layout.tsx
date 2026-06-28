import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

// layout da area interna
export default function SystemLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="system-shell">
      {/* aqui vai o header */}
      <Header />
      <div className="system-body">
        {/* aqui vai a barra lateral */}
        <Sidebar />
        {/* aqui vai o conteudo */}
        <main className="system-content">{children}</main>
      </div>
      {/* aqui vai o footer */}
      <Footer />
    </div>
  );
}

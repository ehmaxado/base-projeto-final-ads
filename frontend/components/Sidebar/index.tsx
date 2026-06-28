// links do menu lateral
import Link from "next/link";
import { logout } from "@/app/(auth)/logout/actions";

const navItems = [
  { href: "/home", label: "Dashboard" },
  { href: "/produtos", label: "Produtos" },
  { href: "/clientes", label: "Clientes" },
  { href: "/orcamentos", label: "Orcamentos" },
  { href: "/usuario", label: "Usuario" },
];

// componente da barra lateral
export default function Sidebar() {
  return (
    <aside className="system-sidebar">
      <div className="sidebar-section">
        <p className="sidebar-label">aMenu</p>
        <nav className="sidebar-nav" aria-label="Menu principal">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="sidebar-link">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar-section">
        <p className="sidebar-label">Logo</p>
        <form action={logout}>
          <button type="submit" className="btn btn-outline-secondary w-100">
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

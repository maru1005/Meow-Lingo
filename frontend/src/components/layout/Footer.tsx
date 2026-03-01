'use client';
import { usePathname } from 'next/navigation';

// src/components/layout/Footer.tsx
export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/chat' || pathname.startsWith('/chat/')) return null;

  return (
    <footer className="py-4 text-center">
      <p className="text-[10px] font-bold tracking-widest text-emerald-200 uppercase">
        © Meow Lingo 2026 / Happy Learning Nyann
      </p>
    </footer>
  );
}

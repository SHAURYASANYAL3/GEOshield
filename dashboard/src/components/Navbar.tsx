import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex gap-4 p-4 border-b border-gray-800">
      <Link href="/" className="font-bold">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  );
}
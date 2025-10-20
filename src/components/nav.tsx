import Link from "next/link";

export function Nav() {
  return (
    <header className="border-b">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-semibold">
          Blog Platform
        </Link>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/posts">Posts</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/dashboard/categories">Categories</Link>
        </div>
      </nav>
    </header>
  );
}

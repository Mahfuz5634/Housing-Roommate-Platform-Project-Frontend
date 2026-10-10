import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="text-8xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        404
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight mb-2">
        Page Not Found
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        The listing, profile, or dashboard route you are looking for has been moved or does not exist.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <Button variant="primary" className="gap-2">
            <Home className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
        <Link href="/properties">
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" /> Search Properties
          </Button>
        </Link>
        <Link href="/roommates">
          <Button variant="ghost" className="gap-2">
            <Compass className="w-4 h-4" /> Find Roommates
          </Button>
        </Link>
      </div>
    </div>
  );
}

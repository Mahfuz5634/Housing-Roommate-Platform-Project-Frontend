import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center animate-pulse">
          <span className="text-2xl">🏠</span>
        </div>
        <Loader2 className="w-20 h-20 text-blue-600 dark:text-blue-400 animate-spin absolute" />
      </div>
      <p className="mt-6 text-sm font-semibold text-slate-600 dark:text-slate-400 tracking-wide uppercase">
        Loading RoommateHub...
      </p>
    </div>
  );
}


'use client';

import { useRouter } from 'next/navigation';

/**
 * The root page of the application, serving as an interactive entry point.
 * When an unauthenticated user visits '/', they are presented with a clickable
 * icon that triggers the login flow.
 */
export default function RootPage() {
  const router = useRouter();

  const handleLoginClick = () => {
    // Pushing to '/login' will be intercepted by the parallel @auth route,
    // displaying the login modal without a full page navigation.
    router.push('/login');
  };

  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground overflow-hidden animate-in fade-in duration-1000">
      <div
        className="relative flex h-64 w-64 cursor-pointer items-center justify-center rounded-full bg-primary/5 group"
        onClick={handleLoginClick}
        onKeyDown={(e) => e.key === 'Enter' && handleLoginClick()}
        role="button"
        tabIndex={0}
        aria-label="Enter application"
      >
        {/* Animated rings for visual feedback on hover */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/10 transition-all duration-700 ease-out group-hover:scale-125 group-hover:opacity-0" />
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 transition-all duration-1000 ease-out group-hover:scale-150 group-hover:opacity-0" />

        {/* The main clickable icon */}
        <span className="text-9xl transition-transform duration-500 ease-in-out group-hover:scale-125">
          🐢
        </span>

        {/* Helper text that appears below the icon */}
        <div className="absolute bottom-0 translate-y-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground transition-opacity duration-500 group-hover:opacity-0">
            Click to Enter
          </p>
        </div>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
    // This page can be used for OAuth callbacks, etc.
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <p className="text-muted-foreground animate-pulse">Authenticating...</p>
        </div>
    );
}

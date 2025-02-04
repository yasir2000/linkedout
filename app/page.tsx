export default function Home() {
  return (
    <main className="container mx-auto py-6">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to LinkedOut</h1>
        <p className="text-muted-foreground mb-8">
          Check your <a href="/inbox" className="underline hover:text-foreground">inbox</a> to view your messages
        </p>
      </div>
    </main>
  );
}

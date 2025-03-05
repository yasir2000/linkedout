'use client';

import { ConnectionTest } from '@/utils/ConnectionTest';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">LinkedOut</h1>
        <div className="max-w-4xl mx-auto">
          <ConnectionTest />
        </div>
      </main>
    </div>
  );
}
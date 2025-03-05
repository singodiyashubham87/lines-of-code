import { Metadata } from 'next';
import LOCAnalyzer from '@/components/LOCAnalyzer';

export const metadata: Metadata = {
  title: 'GitHub LOC Analyzer',
  description: 'Analyze lines of code in GitHub repositories',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          GitHub LOC Analyzer
        </h1>
        <LOCAnalyzer />
      </div>
    </main>
  );
}
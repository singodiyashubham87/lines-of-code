'use client';

import { useState } from 'react';
import { Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import ResultsDisplay from '@/components/ResultsDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';

type AnalysisMode = 'all' | 'specific';

export default function LOCAnalyzer() {
  const [username, setUsername] = useState('');
  const [repository, setRepository] = useState('');
  const [branch, setBranch] = useState('main');
  const [mode, setMode] = useState<AnalysisMode>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          repository: mode === 'specific' ? repository : undefined,
          branch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }

      setResults(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <RadioGroup
              defaultValue="all"
              value={mode}
              onValueChange={(value) => setMode(value as AnalysisMode)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all">All Public Repos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="specific" id="specific" />
                <Label htmlFor="specific">Specific Repo</Label>
              </div>
            </RadioGroup>

            <div className="space-y-4">
              <div>
                <Label htmlFor="username">GitHub Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter GitHub username"
                  required
                />
              </div>

              {mode === 'specific' && (
                <div>
                  <Label htmlFor="repository">Repository Name</Label>
                  <Input
                    id="repository"
                    value={repository}
                    onChange={(e) => setRepository(e.target.value)}
                    placeholder="Enter repository name"
                    required={mode === 'specific'}
                  />
                </div>
              )}

              {mode === 'specific' && (
                <div>
                  <Label htmlFor="branch">Branch Name</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Enter branch name (defaults to main)"
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <Github className="mr-2 h-4 w-4" />
                Analyze Repository
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        {results && <ResultsDisplay results={results} mode={mode} />}
      </Card>
    </div>
  );
}
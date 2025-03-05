"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import ResultsDisplay from "@/components/ResultsDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";


export default function LOCAnalyzer() {
  const [username, setUsername] = useState("");
  const [repository, setRepository] = useState("");
  const [branch, setBranch] = useState("main");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(
        `https://api.codetabs.com/v1/loc/?github=${username}/${repository}&branch=${branch}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch data");
      }

      setResults(data);
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

                <div>
                  <Label htmlFor="repository">Repository Name</Label>
                  <Input
                    id="repository"
                    value={repository}
                    onChange={(e) => setRepository(e.target.value)}
                    placeholder="Enter repository name"
                    required={true}
                  />
                </div>

                <div>
                  <Label htmlFor="branch">Branch Name</Label>
                  <Input
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="Enter branch name (defaults to main)"
                  />
                </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
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

        {results && <ResultsDisplay results={results} />}
      </Card>
    </div>
  );
}

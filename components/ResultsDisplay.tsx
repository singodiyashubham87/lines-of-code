'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';

interface ResultsDisplayProps {
  results: any;
  mode: 'all' | 'specific';
}

export default function ResultsDisplay({ results, mode }: ResultsDisplayProps) {
  if (mode === 'specific') {
    return <SingleRepoResults data={results} />;
  }

  return <AllReposResults data={results} />;
}

function SingleRepoResults({ data }: { data: any[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Repository Analysis</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Language</TableHead>
            <TableHead className="text-right">Files</TableHead>
            <TableHead className="text-right">Lines</TableHead>
            <TableHead className="text-right">Blanks</TableHead>
            <TableHead className="text-right">Comments</TableHead>
            <TableHead className="text-right">Lines of Code</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.language}</TableCell>
              <TableCell className="text-right">{item.files}</TableCell>
              <TableCell className="text-right">{item.lines}</TableCell>
              <TableCell className="text-right">{item.blanks}</TableCell>
              <TableCell className="text-right">{item.comments}</TableCell>
              <TableCell className="text-right">{item.linesOfCode}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function AllReposResults({ data }: { data: Record<string, any> }) {
  // Calculate totals across all repos
  const totals = Object.values(data).reduce((acc: any, repo: any) => {
    if (!Array.isArray(repo)) return acc;
    
    repo.forEach((item) => {
      if (!acc[item.language]) {
        acc[item.language] = {
          files: 0,
          lines: 0,
          blanks: 0,
          comments: 0,
          linesOfCode: 0,
        };
      }
      acc[item.language].files += item.files;
      acc[item.language].lines += item.lines;
      acc[item.language].blanks += item.blanks;
      acc[item.language].comments += item.comments;
      acc[item.language].linesOfCode += item.linesOfCode;
    });
    return acc;
  }, {});

  return (
    <div className="mt-8 space-y-8">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Total Analysis</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Language</TableHead>
              <TableHead className="text-right">Files</TableHead>
              <TableHead className="text-right">Lines</TableHead>
              <TableHead className="text-right">Blanks</TableHead>
              <TableHead className="text-right">Comments</TableHead>
              <TableHead className="text-right">Lines of Code</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(totals).map(([language, stats]: [string, any]) => (
              <TableRow key={language}>
                <TableCell className="font-medium">{language}</TableCell>
                <TableCell className="text-right">{stats.files}</TableCell>
                <TableCell className="text-right">{stats.lines}</TableCell>
                <TableCell className="text-right">{stats.blanks}</TableCell>
                <TableCell className="text-right">{stats.comments}</TableCell>
                <TableCell className="text-right">{stats.linesOfCode}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Repository Breakdown</h2>
        {Object.entries(data).map(([repo, stats]) => (
          <Card key={repo} className="p-6">
            <h3 className="text-xl font-semibold mb-4">{repo}</h3>
            {Array.isArray(stats) ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Language</TableHead>
                    <TableHead className="text-right">Files</TableHead>
                    <TableHead className="text-right">Lines</TableHead>
                    <TableHead className="text-right">Blanks</TableHead>
                    <TableHead className="text-right">Comments</TableHead>
                    <TableHead className="text-right">Lines of Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.language}
                      </TableCell>
                      <TableCell className="text-right">{item.files}</TableCell>
                      <TableCell className="text-right">{item.lines}</TableCell>
                      <TableCell className="text-right">{item.blanks}</TableCell>
                      <TableCell className="text-right">{item.comments}</TableCell>
                      <TableCell className="text-right">
                        {item.linesOfCode}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-destructive">Failed to fetch data</div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
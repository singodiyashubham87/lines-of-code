'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ResultsDisplayProps {
  results: any;
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
    return <SingleRepoResults data={results} />;
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
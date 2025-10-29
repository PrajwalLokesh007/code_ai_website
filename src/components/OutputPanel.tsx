import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface OutputPanelProps {
  output: string;
  error: string;
  isRunning: boolean;
}

export function OutputPanel({ output, error, isRunning }: OutputPanelProps) {
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-3 border-b border-border flex-shrink-0">
        <h3 className="font-semibold text-sm">Output</h3>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6">
          {isRunning ? (
            <div className="flex items-center gap-3 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Running code...</span>
            </div>
          ) : error ? (
            <pre className="text-sm text-red-500 font-mono whitespace-pre-wrap break-words">{error}</pre>
          ) : output ? (
            <pre className="text-sm font-mono whitespace-pre-wrap break-words">{output}</pre>
          ) : (
            <p className="text-sm text-muted-foreground">Run your code to see output</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

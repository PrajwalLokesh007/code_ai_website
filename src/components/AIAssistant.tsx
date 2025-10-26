import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIAssistantProps {
  code: string;
  language: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant({ code, language }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAssistance = useAction(api.aiActions.getCodeAssistance);
  const explainCode = useAction(api.aiActions.explainCode);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getAssistance({
        code,
        language,
        question: userMessage,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      toast.error("Failed to get AI assistance");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExplain = async () => {
    if (!code.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", content: "Explain this code" }]);
    setIsLoading(true);

    try {
      const response = await explainCode({ code, language });
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      toast.error("Failed to explain code");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border border-border">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          AI Assistant
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExplain}
          disabled={!code.trim() || isLoading}
        >
          Explain Code
        </Button>
      </div>

      <ScrollArea className="flex-1 p-6">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ask questions about your code or request explanations
          </p>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm ${
                  msg.role === "user" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                <div className="font-semibold mb-1">
                  {msg.role === "user" ? "You" : "AI"}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-6 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

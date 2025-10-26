import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { Loader2, Send, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AIAssistantProps {
  code: string;
  language: string;
  onCodeChange?: (newCode: string) => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  isCodeEdit?: boolean;
  editedCode?: string;
}

export function AIAssistant({ code, language, onCodeChange }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getAssistance = useAction(api.aiActions.getCodeAssistance);
  const explainCode = useAction(api.aiActions.explainCode);
  const generateCodeEdit = useAction(api.aiActions.generateCodeEdit);

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

  const handleEditCode = async () => {
    if (!input.trim() || !code.trim() || isLoading) return;

    const instruction = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: `✨ Edit request: ${instruction}` }]);
    setIsLoading(true);

    try {
      toast.info("AI is modifying your code...");
      const modifiedCode = await generateCodeEdit({
        code,
        language,
        instruction,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've generated the modified code. Click 'Apply to Editor' to use it.",
          isCodeEdit: true,
          editedCode: modifiedCode,
        },
      ]);
      
      toast.success("Code modification ready!");
    } catch (error) {
      toast.error("Failed to modify code");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyCodeToEditor = (editedCode: string) => {
    if (onCodeChange) {
      onCodeChange(editedCode);
      toast.success("Code applied to editor!");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background border border-border">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
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

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6">
          {messages.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Ask questions about your code or request AI-powered edits
              </p>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  💡 <strong>Try AI Code Editing:</strong> Type instructions like "add error handling" or "optimize this function" and click the magic wand button!
                </p>
              </div>
            </div>
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
                  {msg.isCodeEdit && msg.editedCode && (
                    <Button
                      size="sm"
                      onClick={() => applyCodeToEditor(msg.editedCode!)}
                      className="mt-2 gap-2"
                    >
                      <Wand2 className="h-3 w-3" />
                      Apply to Editor
                    </Button>
                  )}
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
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border flex-shrink-0">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question or request code edits..."
            className="resize-none"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              size="icon"
              variant="default"
              onClick={handleEditCode}
              disabled={!input.trim() || !code.trim() || isLoading}
              title="AI Edit Code"
            >
              <Wand2 className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              title="Ask Question"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          <Wand2 className="h-3 w-3 inline" /> = AI Edit Code • <Send className="h-3 w-3 inline" /> = Ask Question
        </p>
      </div>
    </div>
  );
}
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
    <div className="h-full flex flex-col bg-background">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Assistant
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleExplain}
          disabled={!code.trim() || isLoading}
          className="gap-2"
        >
          <Sparkles className="h-3 w-3" />
          Explain Code
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-6">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Ask questions about your code or request AI-powered edits
              </p>
              
              {/* Feature Tiles */}
              <div className="grid grid-cols-1 gap-3">
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-primary/20">
                      <Wand2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">AI Code Editing</h4>
                      <p className="text-xs text-muted-foreground">
                        Type instructions like "add error handling" or "optimize this function" and click the magic wand button
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 border border-border hover:border-accent/40 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-accent/20">
                      <Send className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Ask Questions</h4>
                      <p className="text-xs text-muted-foreground">
                        Get explanations, debugging help, or learn about programming concepts
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-border hover:border-secondary/40 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-secondary/20">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Code Explanation</h4>
                      <p className="text-xs text-muted-foreground">
                        Click "Explain Code" to get a detailed breakdown of your current code
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    msg.role === "user"
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted/50 border-border"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-md ${
                      msg.role === "user" ? "bg-primary/20" : "bg-accent/20"
                    }`}>
                      {msg.role === "user" ? (
                        <span className="text-xs font-semibold">You</span>
                      ) : (
                        <Sparkles className="h-3 w-3" />
                      )}
                    </div>
                    <span className="font-semibold text-xs">
                      {msg.role === "user" ? "You" : "AI Assistant"}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                  {msg.isCodeEdit && msg.editedCode && (
                    <Button
                      size="sm"
                      onClick={() => applyCodeToEditor(msg.editedCode!)}
                      className="mt-3 gap-2"
                    >
                      <Wand2 className="h-3 w-3" />
                      Apply to Editor
                    </Button>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
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
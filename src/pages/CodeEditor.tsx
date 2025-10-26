import { AIAssistant } from "@/components/AIAssistant";
import { CodeEditor as Editor } from "@/components/CodeEditor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { OutputPanel } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const DEFAULT_CODE: Record<string, string> = {
  python: `# Welcome to VLY.AI\nprint("Hello, World!")`,
  javascript: `// Welcome to VLY.AI\nconsole.log("Hello, World!");`,
  java: `// Welcome to VLY.AI\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `// Welcome to VLY.AI\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  c: `// Welcome to VLY.AI\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
};

export default function CodeEditorPage() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const executeCode = useAction(api.codeExecutionActions.executeCode);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render editor if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(DEFAULT_CODE[newLanguage] || "");
    setOutput("");
    setError("");
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const result = await executeCode({
        code,
        language,
      });

      if (result.error) {
        setError(result.error);
        toast.error("Execution error");
      } else {
        setOutput(result.output || "Program completed successfully");
        toast.success("Code executed successfully");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to execute code";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-background"
      >
        <div className="px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <img
              src="/logo.svg"
              alt="VLY.AI"
              className="h-8 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <LanguageSelector value={language} onChange={handleLanguageChange} />
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleRun}
              disabled={isRunning}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              Run Code
            </Button>
            {user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {user.email || "Guest"}
                </span>
                <Button variant="outline" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="border-r border-border"
        >
          <Editor value={code} onChange={setCode} language={language} />
        </motion.div>

        {/* Right: Output and AI */}
        <div className="grid grid-rows-2 gap-0">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="border-b border-border"
          >
            <OutputPanel output={output} error={error} isRunning={isRunning} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AIAssistant code={code} language={language} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
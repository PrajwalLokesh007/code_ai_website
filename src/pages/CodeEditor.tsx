import { AIAssistant } from "@/components/AIAssistant";
import { CodeEditor as Editor } from "@/components/CodeEditor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { OutputPanel } from "@/components/OutputPanel";
import { ProjectManager } from "@/components/ProjectManager";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const DEFAULT_CODE: Record<string, string> = {
  python: `# Welcome to Code.AI\nprint("Hello, World!")`,
  javascript: `// Welcome to Code.AI\nconsole.log("Hello, World!");`,
  typescript: `// Welcome to Code.AI\nconsole.log("Hello, World!");`,
  java: `// Welcome to Code.AI\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  cpp: `// Welcome to Code.AI\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
  c: `// Welcome to Code.AI\n#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`,
  csharp: `// Welcome to Code.AI\nusing System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, World!");\n    }\n}`,
  go: `// Welcome to Code.AI\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  rust: `// Welcome to Code.AI\nfn main() {\n    println!("Hello, World!");\n}`,
  ruby: `# Welcome to Code.AI\nputs "Hello, World!"`,
  php: `<?php\n// Welcome to Code.AI\necho "Hello, World!";\n?>`,
  swift: `// Welcome to Code.AI\nprint("Hello, World!")`,
  kotlin: `// Welcome to Code.AI\nfun main() {\n    println("Hello, World!")\n}`,
  bash: `# Welcome to Code.AI\necho "Hello, World!"`,
  r: `# Welcome to Code.AI\nprint("Hello, World!")`,
  lua: `-- Welcome to Code.AI\nprint("Hello, World!")`,
  perl: `# Welcome to Code.AI\nprint "Hello, World!\\n";`,
  scala: `// Welcome to Code.AI\nobject Main extends App {\n  println("Hello, World!")\n}`,
  haskell: `-- Welcome to Code.AI\nmain = putStrLn "Hello, World!"`,
  sql: `-- Welcome to Code.AI\nSELECT 'Hello, World!' AS message;`,
  assembly: `; Welcome to Code.AI\nsection .data\n    msg db 'Hello, World!', 0xa\n    len equ $ - msg\n\nsection .text\n    global _start\n\n_start:\n    mov eax, 4\n    mov ebx, 1\n    mov ecx, msg\n    mov edx, len\n    int 0x80\n    \n    mov eax, 1\n    xor ebx, ebx\n    int 0x80`,
  clojure: `; Welcome to Code.AI\n(println "Hello, World!")`,
  cobol: `      * Welcome to Code.AI\n       IDENTIFICATION DIVISION.\n       PROGRAM-ID. HELLO.\n       PROCEDURE DIVISION.\n           DISPLAY 'Hello, World!'.\n           STOP RUN.`,
  commonlisp: `; Welcome to Code.AI\n(format t "Hello, World!~%")`,
  d: `// Welcome to Code.AI\nimport std.stdio;\n\nvoid main() {\n    writeln("Hello, World!");\n}`,
  elixir: `# Welcome to Code.AI\nIO.puts "Hello, World!"`,
  erlang: `% Welcome to Code.AI\n-module(hello).\n-export([start/0]).\n\nstart() ->\n    io:format("Hello, World!~n").`,
  fsharp: `// Welcome to Code.AI\nprintfn "Hello, World!"`,
  fortran: `! Welcome to Code.AI\nprogram hello\n    print *, 'Hello, World!'\nend program hello`,
  groovy: `// Welcome to Code.AI\nprintln "Hello, World!"`,
  objectivec: `// Welcome to Code.AI\n#import <Foundation/Foundation.h>\n\nint main() {\n    @autoreleasepool {\n        NSLog(@"Hello, World!");\n    }\n    return 0;\n}`,
  ocaml: `(* Welcome to Code.AI *)\nprint_endline "Hello, World!";;`,
  octave: `% Welcome to Code.AI\ndisp('Hello, World!')`,
  pascal: `(* Welcome to Code.AI *)\nprogram Hello;\nbegin\n    writeln('Hello, World!');\nend.`,
  prolog: `% Welcome to Code.AI\n:- initialization(main).\nmain :- write('Hello, World!'), nl.`,
  racket: `; Welcome to Code.AI\n#lang racket\n(displayln "Hello, World!")`,
  scheme: `; Welcome to Code.AI\n(display "Hello, World!")`,
  visualbasic: `' Welcome to Code.AI\nModule Hello\n    Sub Main()\n        Console.WriteLine("Hello, World!")\n    End Sub\nEnd Module`,
};

export default function CodeEditorPage() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [aiPanelHeight, setAiPanelHeight] = useState(50); // percentage

  const executeCode = useAction(api.codeExecutionActions.executeCode);
  const detectLanguage = useAction(api.languageDetection.detectLanguage);

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

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code first");
      return;
    }

    setIsRunning(true);
    setIsDetecting(true);
    setOutput("");
    setError("");

    try {
      // Step 1: Detect language using AI
      toast.info("Detecting language...");
      const detectedLang = await detectLanguage({ code });
      setLanguage(detectedLang);
      setIsDetecting(false);
      
      toast.success(`Detected: ${detectedLang.toUpperCase()}`);

      // Step 2: Execute code with detected language
      const result = await executeCode({
        code,
        language: detectedLang,
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
      setIsDetecting(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = aiPanelHeight;
    const containerHeight = window.innerHeight - 200; // Approximate header height

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const deltaPercent = (deltaY / containerHeight) * 100;
      const newHeight = Math.max(20, Math.min(80, startHeight - deltaPercent));
      setAiPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
              src="/code-logo.svg"
              alt="Code.AI"
              className="h-8 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div className="flex items-center gap-3">
              <LanguageSelector value={language} onChange={handleLanguageChange} />
              {isDetecting && (
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Detecting...
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <ProjectManager
              currentCode={code}
              currentLanguage={language}
              onLoadSnippet={(newCode, newLanguage) => {
                setCode(newCode);
                setLanguage(newLanguage);
                setOutput("");
                setError("");
              }}
            />
            <Button
              onClick={handleRun}
              disabled={isRunning || !code.trim()}
              className="gap-2"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Code
                </>
              )}
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

      {/* Info Banner */}
      <div className="bg-muted/50 border-b border-border px-8 py-2">
        <p className="text-xs text-muted-foreground text-center">
          ℹ️ Standard libraries only - External packages/modules are not supported in the execution environment
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
        {/* Left: Editor and Output */}
        <div className="flex flex-col h-full overflow-hidden border-r border-border">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 overflow-hidden"
          >
            <Editor value={code} onChange={handleCodeChange} language={language} />
          </motion.div>

          {/* Output Panel at Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="h-48 border-t border-border overflow-hidden"
          >
            <OutputPanel output={output} error={error} isRunning={isRunning} />
          </motion.div>
        </div>

        {/* Right: AI Assistant */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="h-full overflow-hidden"
        >
          <AIAssistant code={code} language={language} onCodeChange={handleCodeChange} />
        </motion.div>
      </div>
    </div>
  );
}
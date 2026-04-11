import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/hooks/use-theme";

// Configure Monaco Editor without web workers for simpler build
if (typeof window !== 'undefined') {
  // @ts-ignore
  self.MonacoEnvironment = {
    getWorkerUrl: function () {
      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/'
        };
        importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs/base/worker/workerMain.js');
      `)}`;
    }
  };
}

const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: 'console.log("Hello, World!");',
  typescript: 'const message: string = "Hello, World!";\nconsole.log(message);',
  python: 'print("Hello, World!")',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  rust: 'fn main() {\n    println!("Hello, World!");\n}',
  ruby: 'puts "Hello, World!"',
  php: '<?php\necho "Hello, World!";\n?>'
};

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!editorRef.current) return;

    try {
      const editor = monaco.editor.create(editorRef.current, {
        value,
        language: language === "cpp" ? "cpp" : language,
        theme: theme === "dark" ? "vs-dark" : "vs",
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
      });

      monacoEditorRef.current = editor;

      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });

      return () => {
        editor.dispose();
      };
    } catch (error) {
      console.error('Failed to initialize Monaco Editor:', error);
    }
  }, []);

  useEffect(() => {
    if (monacoEditorRef.current) {
      try {
        monaco.editor.setTheme(theme === "dark" ? "vs-dark" : "vs");
      } catch (error) {
        console.error('Failed to set theme:', error);
      }
    }
  }, [theme]);

  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        try {
          monaco.editor.setModelLanguage(model, language === "cpp" ? "cpp" : language);
          
          // Auto-fill template when changing languages (but not on initial load)
          if (!isInitialMount.current) {
            const newTemplate = LANGUAGE_TEMPLATES[language] || "";
            monacoEditorRef.current.setValue(newTemplate);
            onChange(newTemplate);
          }
        } catch (error) {
          console.error('Failed to set language:', error);
          // Don't throw the error
        }
      }
    }
    isInitialMount.current = false;
  }, [language]);

  useEffect(() => {
    if (monacoEditorRef.current && monacoEditorRef.current.getValue() !== value) {
      try {
        monacoEditorRef.current.setValue(value);
      } catch (error) {
        console.error('Failed to set editor value:', error);
        // Don't throw the error
      }
    }
  }, [value]);

  return <div ref={editorRef} className="h-full w-full" />;
}
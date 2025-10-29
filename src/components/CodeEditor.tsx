import { useEffect, useRef } from "react";
import * as monaco from "monaco-editor";
import { useTheme } from "@/hooks/use-theme";

// Configure Monaco Editor web workers
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorker(_: string, label: string) {
      try {
        if (label === 'json') {
          return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url), { type: 'module' });
        }
        if (label === 'typescript' || label === 'javascript') {
          return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url), { type: 'module' });
        }
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), { type: 'module' });
      } catch (error) {
        console.error('Failed to create Monaco worker:', error);
        // Return a fallback worker to prevent crashes
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url), { type: 'module' });
      }
    }
  };
}

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const { theme } = useTheme();

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
        } catch (error) {
          console.error('Failed to set language:', error);
          // Don't throw the error
        }
      }
    }
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
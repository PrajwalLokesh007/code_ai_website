import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LANGUAGES = [
  // Most Popular
  { id: "python", name: "Python" },
  { id: "javascript", name: "JavaScript" },
  { id: "typescript", name: "TypeScript" },
  { id: "java", name: "Java" },
  { id: "cpp", name: "C++" },
  { id: "c", name: "C" },
  { id: "csharp", name: "C#" },
  
  // Modern Languages
  { id: "go", name: "Go" },
  { id: "rust", name: "Rust" },
  { id: "swift", name: "Swift" },
  { id: "ruby", name: "Ruby" },
  { id: "php", name: "PHP" },
  
  // Functional Languages
  { id: "haskell", name: "Haskell" },
  { id: "scala", name: "Scala" },
  { id: "elixir", name: "Elixir" },
  { id: "erlang", name: "Erlang" },
  { id: "fsharp", name: "F#" },
  { id: "clojure", name: "Clojure" },
  { id: "ocaml", name: "OCaml" },
  { id: "commonlisp", name: "Common Lisp" },
  { id: "scheme", name: "Scheme" },
  { id: "racket", name: "Racket" },
  
  // Systems & Low-Level
  { id: "assembly", name: "Assembly" },
  { id: "d", name: "D" },
  { id: "fortran", name: "Fortran" },
  
  // Scripting & Shell
  { id: "bash", name: "Bash" },
  { id: "perl", name: "Perl" },
  { id: "lua", name: "Lua" },
  { id: "r", name: "R" },
  
  // Enterprise & Legacy
  { id: "cobol", name: "COBOL" },
  { id: "pascal", name: "Pascal" },
  { id: "visualbasic", name: "Visual Basic" },
  { id: "groovy", name: "Groovy" },
  
  // Other
  { id: "sql", name: "SQL" },
  { id: "prolog", name: "Prolog" },
  { id: "objectivec", name: "Objective-C" },
  { id: "octave", name: "Octave" },
];

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] border-border">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent className="max-h-[400px]">
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.id} value={lang.id}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="VLY.AI" className="h-8" />
            <span className="text-xl font-bold tracking-tight">VLY.AI</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(isAuthenticated ? "/editor" : "/auth")}
          >
            {isAuthenticated ? "Go to Editor" : "Sign In"}
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-6xl font-bold tracking-tight">
              Code in Any Language.
              <br />
              <span className="text-muted-foreground">Instantly.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A universal online coding platform with real-time execution and AI assistance.
              Write, run, and learn—all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              size="lg"
              onClick={() => navigate("/editor")}
              className="gap-2 text-lg px-8 py-6"
            >
              Start Coding
              <ArrowRight className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16"
          >
            <div className="space-y-3">
              <div className="flex justify-center">
                <Code2 className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Multi-Language</h3>
              <p className="text-sm text-muted-foreground">
                Python, JavaScript, Java, C++, and C—all in one editor
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">Instant Execution</h3>
              <p className="text-sm text-muted-foreground">
                Run your code in seconds with real-time output
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="font-semibold">AI Assistant</h3>
              <p className="text-sm text-muted-foreground">
                Get explanations and debugging help powered by GPT
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="border-t border-border py-8"
      >
        <div className="max-w-7xl mx-auto px-8 text-center text-sm text-muted-foreground">
          Built with{" "}
          <a
            href="https://vly.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            vly.ai
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
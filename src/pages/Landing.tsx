import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Sparkles, Zap, CheckCircle2, Globe, Shield } from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
          >
            <img src="/logo.svg" alt="VLY.AI" className="h-8 sm:h-10" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight">VLY.AI</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={() => navigate(isAuthenticated ? "/editor" : "/auth")}
              className="gap-2"
            >
              {isAuthenticated ? "Go to Editor" : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto text-center space-y-12 py-16 sm:py-24 lg:py-32"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Code Execution</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              Code in Any Language.
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Instantly.
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A universal online coding platform with real-time execution and AI assistance.
              <br className="hidden sm:block" />
              Write, run, and learn—all in one place.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                onClick={() => navigate("/editor")}
                className="gap-2 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
              >
                Start Coding Free
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth")}
                className="gap-2 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 w-full sm:w-auto"
              >
                <Shield className="h-5 w-5" />
                Sign In Securely
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pt-12 sm:pt-16"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">40+ Languages</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Python, JavaScript, Java, C++, Rust, Go, and 35+ more—all in one powerful editor
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Execution</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Run your code in seconds with real-time output and lightning-fast compilation
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Assistant</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get intelligent explanations and debugging help powered by advanced GPT models
              </p>
            </motion.div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            variants={itemVariants}
            className="pt-8 sm:pt-12"
          >
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Auto Language Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Secure Authentication</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span>Free to Use</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-border/50 py-6 sm:py-8 backdrop-blur-sm bg-background/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          Built with{" "}
          <a
            href="https://vly.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors font-medium"
          >
            vly.ai
          </a>
          {" "}• Empowering developers worldwide
        </div>
      </motion.footer>
    </div>
  );
}
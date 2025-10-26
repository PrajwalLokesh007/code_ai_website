import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import {
  FileCode,
  Folder,
  FolderOpen,
  FolderPlus,
  MoreVertical,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectManagerProps {
  currentCode: string;
  currentLanguage: string;
  onLoadSnippet: (code: string, language: string) => void;
}

export function ProjectManager({
  currentCode,
  currentLanguage,
  onLoadSnippet,
}: ProjectManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Id<"folders"> | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDesc, setNewFolderDesc] = useState("");
  const [snippetTitle, setSnippetTitle] = useState("");
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const folders = useQuery(api.folders.getUserFolders);
  const snippets = useQuery(api.codeSnippets.getUserSnippets, {
    folderId: selectedFolder || undefined,
  });

  const createFolder = useMutation(api.folders.createFolder);
  const deleteFolder = useMutation(api.folders.deleteFolder);
  const saveSnippet = useMutation(api.codeSnippets.saveSnippet);
  const deleteSnippet = useMutation(api.codeSnippets.deleteSnippet);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      await createFolder({
        name: newFolderName,
        description: newFolderDesc || undefined,
      });
      toast.success("Folder created successfully");
      setNewFolderName("");
      setNewFolderDesc("");
      setShowNewFolderDialog(false);
    } catch (error) {
      toast.error("Failed to create folder");
      console.error(error);
    }
  };

  const handleDeleteFolder = async (folderId: Id<"folders">) => {
    try {
      await deleteFolder({ folderId });
      toast.success("Folder deleted successfully");
      if (selectedFolder === folderId) {
        setSelectedFolder(null);
      }
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error(error);
    }
  };

  const handleSaveSnippet = async () => {
    if (!snippetTitle.trim()) {
      toast.error("Please enter a snippet title");
      return;
    }

    if (!currentCode.trim()) {
      toast.error("No code to save");
      return;
    }

    try {
      await saveSnippet({
        title: snippetTitle,
        language: currentLanguage,
        code: currentCode,
        folderId: selectedFolder || undefined,
      });
      toast.success("Code snippet saved successfully");
      setSnippetTitle("");
      setShowSaveDialog(false);
    } catch (error) {
      toast.error("Failed to save snippet");
      console.error(error);
    }
  };

  const handleDeleteSnippet = async (snippetId: Id<"codeSnippets">) => {
    try {
      await deleteSnippet({ snippetId });
      toast.success("Snippet deleted successfully");
    } catch (error) {
      toast.error("Failed to delete snippet");
      console.error(error);
    }
  };

  const handleLoadSnippet = (code: string, language: string) => {
    onLoadSnippet(code, language);
    setIsOpen(false);
    toast.success("Code loaded into editor");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            My Projects
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>My Projects & Code Snippets</DialogTitle>
            <DialogDescription>
              Organize your code into folders and save snippets for later
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 flex-1 min-h-0">
            {/* Folders Sidebar */}
            <div className="w-64 border-r pr-4 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">Folders</h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNewFolderDialog(true)}
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="space-y-1.5">
                  <Button
                    variant={selectedFolder === null ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2 h-10 px-3 hover:bg-accent transition-colors"
                    onClick={() => setSelectedFolder(null)}
                  >
                    <Folder className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">All Snippets</span>
                  </Button>

                  {folders?.map((folder) => (
                    <div key={folder._id} className="flex items-center gap-1 group">
                      <Button
                        variant={selectedFolder === folder._id ? "secondary" : "ghost"}
                        className="flex-1 justify-start gap-2 h-10 px-3 hover:bg-accent transition-colors"
                        onClick={() => setSelectedFolder(folder._id)}
                      >
                        <Folder className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span className="truncate">{folder.name}</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteFolder(folder._id)}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Folder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Snippets List */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm">
                  {selectedFolder
                    ? folders?.find((f) => f._id === selectedFolder)?.name
                    : "All Snippets"}
                </h3>
                <Button
                  size="sm"
                  onClick={() => setShowSaveDialog(true)}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Current Code
                </Button>
              </div>

              <ScrollArea className="flex-1">
                {snippets && snippets.length > 0 ? (
                  <div className="space-y-2.5">
                    {snippets.map((snippet) => (
                      <motion.div
                        key={snippet._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group relative p-4 border rounded-lg hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div className="p-1.5 rounded-md bg-primary/10 border border-primary/20">
                                <FileCode className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                              </div>
                              <h4 className="font-semibold text-sm truncate tracking-tight">
                                {snippet.title}
                              </h4>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span className="px-2 py-0.5 rounded-md bg-muted border border-border font-mono">
                                {snippet.language.toUpperCase()}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(snippet._creationTime).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() =>
                                handleLoadSnippet(snippet.code, snippet.language)
                              }
                              className="h-8 px-3 text-xs"
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSnippet(snippet._id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="p-4 rounded-2xl bg-muted/50 border border-border mb-4">
                      <FileCode className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1 tracking-tight">No snippets yet</h4>
                    <p className="text-xs text-muted-foreground max-w-[200px]">
                      Save your current code to get started organizing your work!
                    </p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <FolderPlus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Create New Folder</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Organize your code snippets into folders
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name" className="text-sm font-medium">
                Folder Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Python Projects"
                className="h-10"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="folder-desc" className="text-sm font-medium">
                Description <span className="text-muted-foreground text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="folder-desc"
                value={newFolderDesc}
                onChange={(e) => setNewFolderDesc(e.target.value)}
                placeholder="What's this folder for?"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowNewFolderDialog(false);
                setNewFolderName("");
                setNewFolderDesc("");
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateFolder}
              disabled={!newFolderName.trim()}
              className="w-full sm:w-auto gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Snippet Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Save className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl">Save Code Snippet</DialogTitle>
                <DialogDescription className="text-sm mt-1">
                  Save your current code to{" "}
                  <span className="font-medium text-foreground">
                    {selectedFolder
                      ? folders?.find((f) => f._id === selectedFolder)?.name
                      : "All Snippets"}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="snippet-title" className="text-sm font-medium">
                Snippet Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="snippet-title"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="e.g., Hello World Program"
                className="h-10"
                autoFocus
              />
            </div>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Language:</span>
                <span className="text-sm font-medium">{currentLanguage.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowSaveDialog(false);
                setSnippetTitle("");
              }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveSnippet}
              disabled={!snippetTitle.trim()}
              className="w-full sm:w-auto gap-2"
            >
              <Save className="h-4 w-4" />
              Save Snippet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

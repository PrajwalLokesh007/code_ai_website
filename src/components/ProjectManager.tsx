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
                <div className="space-y-1">
                  <Button
                    variant={selectedFolder === null ? "secondary" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => setSelectedFolder(null)}
                  >
                    <Folder className="h-4 w-4" />
                    All Snippets
                  </Button>

                  {folders?.map((folder) => (
                    <div key={folder._id} className="flex items-center gap-1">
                      <Button
                        variant={selectedFolder === folder._id ? "secondary" : "ghost"}
                        className="flex-1 justify-start gap-2"
                        onClick={() => setSelectedFolder(folder._id)}
                      >
                        <Folder className="h-4 w-4" />
                        {folder.name}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleDeleteFolder(folder._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
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
                  <div className="space-y-2">
                    {snippets.map((snippet) => (
                      <motion.div
                        key={snippet._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileCode className="h-4 w-4 text-primary flex-shrink-0" />
                              <h4 className="font-medium text-sm truncate">
                                {snippet.title}
                              </h4>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {snippet.language.toUpperCase()} •{" "}
                              {new Date(snippet._creationTime).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleLoadSnippet(snippet.code, snippet.language)
                              }
                            >
                              Load
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteSnippet(snippet._id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <FileCode className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      No snippets yet. Save your current code to get started!
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize your code snippets into folders
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g., Python Projects"
              />
            </div>
            <div>
              <Label htmlFor="folder-desc">Description (Optional)</Label>
              <Textarea
                id="folder-desc"
                value={newFolderDesc}
                onChange={(e) => setNewFolderDesc(e.target.value)}
                placeholder="What's this folder for?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              <Plus className="h-4 w-4 mr-2" />
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save Snippet Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Code Snippet</DialogTitle>
            <DialogDescription>
              Save your current code to{" "}
              {selectedFolder
                ? folders?.find((f) => f._id === selectedFolder)?.name
                : "All Snippets"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="snippet-title">Snippet Title</Label>
              <Input
                id="snippet-title"
                value={snippetTitle}
                onChange={(e) => setSnippetTitle(e.target.value)}
                placeholder="e.g., Hello World Program"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Language: <span className="font-medium">{currentLanguage.toUpperCase()}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSnippet}>
              <Save className="h-4 w-4 mr-2" />
              Save Snippet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

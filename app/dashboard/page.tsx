"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, Plus, Trash2, LogOut, Download, Eye, ImageIcon, FileText } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface DataItem {
  id: string
  name: string
  content: string
}

export default function DashboardPage() {
  const [data, setData] = useState<DataItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newItemName, setNewItemName] = useState("")
  const [newItemContent, setNewItemContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imageItemName, setImageItemName] = useState("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const router = useRouter()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false)
  const [currentPdfName, setCurrentPdfName] = useState("")

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token")
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    }
  }

  const fetchData = async () => {
    try {
      const response = await fetch("/api/data/", {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else if (response.status === 401) {
        router.push("/login")
      } else {
        setError("Failed to fetch data")
      }
    } catch (err) {
      setError("An error occurred while fetching data")
    } finally {
      setIsLoading(false)
    }
  }

  const createData = async () => {
    setIsCreating(true)
    try {
      const response = await fetch("/api/data/", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: newItemName,
          content: newItemContent,
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setData([...data, newItem])
        setNewItemName("")
        setNewItemContent("")
        setIsCreateDialogOpen(false)
      } else {
        setError("Failed to create data")
      }
    } catch (err) {
      setError("An error occurred while creating data")
    } finally {
      setIsCreating(false)
    }
  }

  const uploadImage = async () => {
    if (!selectedFile || !imageItemName) {
      setError("Please select a file and enter a name")
      return
    }

    setIsUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch(`/api/data/image?name=${encodeURIComponent(imageItemName)}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      })

      if (response.ok) {
        const newItem = await response.json()
        setData([...data, newItem])
        setSelectedFile(null)
        setImageItemName("")
        setIsCreateDialogOpen(false)
      } else {
        setError("Failed to upload image")
      }
    } catch (err) {
      setError("An error occurred while uploading image")
    } finally {
      setIsUploadingImage(false)
    }
  }

  const deleteData = async (id: string) => {
    try {
      const response = await fetch(`/api/data/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        setData(data.filter((item) => item.id !== id))
      } else {
        setError("Failed to delete data")
      }
    } catch (err) {
      setError("An error occurred while deleting data")
    }
  }

  const convertToPdf = async (id: string, name: string, action: "view" | "download" = "view") => {
    try {
      const response = await fetch(`/api/data/convert/${id}`, {
        headers: getAuthHeaders(),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)

        if (action === "download") {
          // Create download link
          const a = document.createElement("a")
          a.href = url
          a.download = `${name}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } else {
          // View PDF in dialog
          setPdfUrl(url)
          setCurrentPdfName(name)
          setIsPdfDialogOpen(true)
        }
      } else {
        setError("Failed to convert to PDF")
      }
    } catch (err) {
      setError("An error occurred during PDF conversion")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  const closePdfDialog = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
    setIsPdfDialogOpen(false)
    setCurrentPdfName("")
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Database className="h-12 w-12 animate-spin mx-auto mb-4" />
          <p>Loading your data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center">
          <Database className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">DataVault</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Dashboard</span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Your Data</h1>
            <p className="text-muted-foreground">Manage your stored information and images</p>
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Item</DialogTitle>
                <DialogDescription>Add text data or upload an image to your vault</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Text Data
                  </TabsTrigger>
                  <TabsTrigger value="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Image Upload
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="text-name">Name</Label>
                    <Input
                      id="text-name"
                      placeholder="Enter data name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-content">Content</Label>
                    <Textarea
                      id="text-content"
                      placeholder="Enter data content"
                      value={newItemContent}
                      onChange={(e) => setNewItemContent(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={createData}
                    disabled={isCreating || !newItemName || !newItemContent}
                    className="w-full"
                  >
                    {isCreating ? "Creating..." : "Create Text Data"}
                  </Button>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="image-name">Name</Label>
                    <Input
                      id="image-name"
                      placeholder="Enter image name"
                      value={imageItemName}
                      onChange={(e) => setImageItemName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image-file">Image File</Label>
                    <Input
                      id="image-file"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={uploadImage}
                    disabled={isUploadingImage || !selectedFile || !imageItemName}
                    className="w-full"
                  >
                    {isUploadingImage ? "Uploading..." : "Upload Image"}
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {data.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No data yet</h3>
              <p className="text-muted-foreground text-center mb-4">
                Get started by creating your first data entry or uploading an image
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate flex items-center gap-2">
                      {item.content.startsWith("data:image/") || item.content.includes("image") ? (
                        <ImageIcon className="h-4 w-4" />
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                      {item.name}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => convertToPdf(item.id, item.name, "view")}
                        title="View PDF"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => convertToPdf(item.id, item.name, "download")}
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => deleteData(item.id)} title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>ID: {item.id}</CardDescription>
                </CardHeader>
                <CardContent>
                  {item.content.startsWith("data:image/") ? (
                    <div className="space-y-2">
                      <img
                        src={item.content || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">Image uploaded</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground line-clamp-3">{item.content}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* PDF Viewer Dialog */}
        <Dialog open={isPdfDialogOpen} onOpenChange={closePdfDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="flex items-center justify-between">
                <span>PDF Preview: {currentPdfName}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    convertToPdf(
                      data.find((item) => item.name === currentPdfName)?.id || "",
                      currentPdfName,
                      "download",
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="px-6 pb-6">
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  className="w-full h-[70vh] border rounded-md"
                  title={`PDF Preview: ${currentPdfName}`}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Upload,
  FileText,
  Settings,
  Layers,
  Binary,
  Network,
  AlertCircle,
  CheckCircle2,
  Clock,
  X
} from 'lucide-react'

interface Document {
  id: string;
  name: string;
  status: 'processing' | 'completed' | 'failed';
  uploadDate: Date;
  size: string;
  pages: number;
  chunks: number;
  vectors: number;
  metadata: {
    title?: string;
    author?: string;
    date?: string;
    keywords?: string[];
  };
  processingDetails: {
    chunking: {
      method: string;
      size: number;
      overlap: number;
    };
    embedding: {
      model: string;
      dimensions: number;
    };
    indexing: {
      method: string;
      parameters: IndexingParameters;
    };
  };
}

interface IndexingParameters {
  M: number;
  efConstruction: number;
  // Add other possible parameters here
}

export default function Resources() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'machine_learning_basics.pdf',
      status: 'completed',
      uploadDate: new Date(),
      size: '2.4 MB',
      pages: 45,
      chunks: 128,
      vectors: 256,
      metadata: {
        title: 'Introduction to Machine Learning',
        author: 'John Doe',
        date: '2024',
        keywords: ['ML', 'AI', 'Neural Networks']
      },
      processingDetails: {
        chunking: {
          method: 'sentence-window',
          size: 512,
          overlap: 50
        },
        embedding: {
          model: 'all-MiniLM-L6-v2',
          dimensions: 384
        },
        indexing: {
          method: 'HNSW',
          parameters: {
            M: 16,
            efConstruction: 200
          }
        }
      }
    }
  ]);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadingFiles(prev => [...prev, ...files]);
      // Simulate processing
      files.forEach(file => {
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f !== file));
          setDocuments(prev => [...prev, {
            id: Math.random().toString(),
            name: file.name,
            status: 'processing',
            uploadDate: new Date(),
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            pages: 0,
            chunks: 0,
            vectors: 0,
            metadata: {},
            processingDetails: {
              chunking: {
                method: 'sentence-window',
                size: 512,
                overlap: 50
              },
              embedding: {
                model: 'all-MiniLM-L6-v2',
                dimensions: 384
              },
              indexing: {
                method: 'HNSW',
                parameters: {
                  M: 16,
                  efConstruction: 200
                }
              }
            }
          }]);
        }, 2000);
      });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Resources</h1>
        <div className="flex gap-4">
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Processing Settings
          </Button>
          <label>
            <Input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              multiple
              onChange={handleFileUpload}
            />
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Documents
            </Button>
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      <AnimatePresence>
        {uploadingFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Uploading Files</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {uploadingFiles.map(file => (
                  <div key={file.name} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500 animate-spin" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map(doc => (
          <Card 
            key={doc.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => setSelectedDocument(doc)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-indigo-500" />
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">
                      {doc.size} • {doc.pages} pages
                    </p>
                  </div>
                </div>
                {doc.status === 'completed' && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
                {doc.status === 'processing' && (
                  <Clock className="h-5 w-5 text-blue-500 animate-spin" />
                )}
                {doc.status === 'failed' && (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Layers className="h-4 w-4 text-gray-500" />
                  <span>{doc.chunks} chunks</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Binary className="h-4 w-4 text-gray-500" />
                  <span>{doc.vectors} vectors</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Details Modal */}
      <AnimatePresence>
        {selectedDocument && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedDocument(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-lg w-full max-w-3xl overflow-hidden"
            >
              <div className="p-6 flex justify-between items-start border-b">
                <div>
                  <h2 className="text-2xl font-semibold">{selectedDocument.name}</h2>
                  <p className="text-gray-500">
                    Uploaded on {selectedDocument.uploadDate.toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedDocument(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Processing Details */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Processing Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Layers className="h-4 w-4" />
                          Chunking
                        </h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>Method: {selectedDocument.processingDetails.chunking.method}</p>
                          <p>Size: {selectedDocument.processingDetails.chunking.size}</p>
                          <p>Overlap: {selectedDocument.processingDetails.chunking.overlap}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Binary className="h-4 w-4" />
                          Embedding
                        </h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>Model: {selectedDocument.processingDetails.embedding.model}</p>
                          <p>Dimensions: {selectedDocument.processingDetails.embedding.dimensions}</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium flex items-center gap-2">
                          <Network className="h-4 w-4" />
                          Indexing
                        </h4>
                        <div className="mt-2 space-y-1 text-sm">
                          <p>Method: {selectedDocument.processingDetails.indexing.method}</p>
                          <p>Parameters: {JSON.stringify(selectedDocument.processingDetails.indexing.parameters)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Metadata */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                  <Card>
                    <CardContent className="p-4 grid grid-cols-2 gap-4">
                      {Object.entries(selectedDocument.metadata).map(([key, value]) => (
                        <div key={key}>
                          <p className="font-medium capitalize">{key}</p>
                          <p className="text-gray-600">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-500">Pages</p>
                        <p className="text-2xl font-bold">{selectedDocument.pages}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-500">Size</p>
                        <p className="text-2xl font-bold">{selectedDocument.size}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-500">Chunks</p>
                        <p className="text-2xl font-bold">{selectedDocument.chunks}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <p className="text-gray-500">Vectors</p>
                        <p className="text-2xl font-bold">{selectedDocument.vectors}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
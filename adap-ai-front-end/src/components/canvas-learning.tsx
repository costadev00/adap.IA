'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PuzzleIcon, Send, X, Clock, ChevronLeft, ChevronRight, Plus, FolderPlus, FileText } from 'lucide-react'
import ReactFlow, { 
  Node,
  Edge,
  Controls,
  Background,
  MarkerType,
  ReactFlowProvider,
  ConnectionMode,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Video, 
  CreditCard,
  Brain,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Confetti from 'react-confetti';
import { Mic, MicOff } from 'lucide-react'; // Agregar estos imports

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Flashcard {
  id: number;
  front: string;
  back: string;
  category: string;
  difficulty: string;
  tags: string[];
  image: string;
}

interface RecallStatus {
  easy: number;
  medium: number;
  hard: number;
  again: number;
}

interface LoadingStep {
  id: number;
  message: string;
  completed: boolean;
}

interface MindMapNode {
  id: string;
  label: string;
  type: 'general_subject' | 'category' | 'concept';
  parent?: string;
}

interface MindMapEdge {
  source: string;
  target: string;
}

interface MindMapData {
  general_subject: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

// Add this interface for learning options
interface LearningOption {
  id: string;
  name: string;
  command: string;
  icon: React.ReactNode;
  description: string;
  isDefault?: boolean;
}

// Add this interface for history items
interface HistoryItem {
  id: string;
  type: string;
  content: {
    videoUrl?: string;
    wordSearchData?: WordSearchData;
    mathData?: MathData;
    mindMapData?: MindMapData;
  };
  timestamp: Date;
  title: string;
}

// Add these new interfaces
interface Session {
  id: string;
  name: string;
  timestamp: Date;
  chatHistory: ChatMessage[];
  contentHistory: HistoryItem[];
}

// Add these interfaces near the top with other interfaces
interface WordSearchData {
  grid: string[][];
  answers: {
    word: string;
    start: [number, number];
    end: [number, number];
  }[];
}

// Define the constant data before using it in types
const wordSearchData: WordSearchData = {
  grid: [
    ["N", "O", "T", "A", "S", "O", "B", "R", "E", "M"],
    ["M", "U", "S", "I", "C", "A", "E", "S", "A", "U"],
    ["I", "N", "S", "T", "R", "U", "M", "E", "N", "S"],
    ["A", "C", "O", "R", "D", "E", "S", "L", "I", "I"],
    ["M", "E", "L", "O", "D", "I", "A", "A", "N", "C"],
    ["P", "I", "A", "N", "O", "T", "R", "O", "S", "A"],
    ["R", "I", "T", "M", "O", "N", "B", "A", "N", "L"],
    ["G", "U", "I", "T", "A", "R", "R", "A", "S", "E"],
    ["V", "O", "L", "U", "M", "E", "N", "X", "Y", "S"],
    ["C", "O", "M", "P", "A", "S", "E", "S", "O", "N"]
  ],
  answers: [
    { word: "notas", start: [0, 0], end: [0, 4] },
    { word: "musica", start: [1, 0], end: [1, 5] },
    { word: "instrumen", start: [2, 0], end: [2, 7] },
    { word: "acordes", start: [3, 0], end: [3, 6] },
    { word: "melodia", start: [4, 0], end: [4, 6] },
    { word: "piano", start: [5, 0], end: [5, 4] },
    { word: "ritmo", start: [6, 0], end: [6, 4] },
    { word: "guitarra", start: [7, 0], end: [7, 7] },
    { word: "volumen", start: [8, 0], end: [8, 6] },
    { word: "compases", start: [9, 0], end: [9, 7] }
  ]
};

interface MathData {
  general_subject: string;
  flashcards: {
    id: number;
    front: string;
    back: string;
    category: string;
    difficulty: string;
    tags: string[];
    image: string;
  }[];
}

const mindMapData: MindMapData = {
  general_subject: "Politics in the U.S.",
  nodes: [
    { id: "1", label: "Politics in the U.S.", type: "general_subject" },
    
    // Government Structure
    { id: "2", label: "Government Structure", type: "category", parent: "1" },
    { id: "3", label: "Executive Branch", type: "concept", parent: "2" },
    { id: "4", label: "Legislative Branch", type: "concept", parent: "2" },
    { id: "5", label: "Judicial Branch", type: "concept", parent: "2" },
    
    // Political Parties
    { id: "6", label: "Political Parties", type: "category", parent: "1" },
    { id: "7", label: "Democratic Party", type: "concept", parent: "6" },
    { id: "8", label: "Republican Party", type: "concept", parent: "6" },
    { id: "9", label: "Third Parties", type: "concept", parent: "6" },

    // Elections
    { id: "10", label: "Elections", type: "category", parent: "1" },
    { id: "11", label: "Presidential Elections", type: "concept", parent: "10" },
    { id: "12", label: "Midterm Elections", type: "concept", parent: "10" },
    { id: "13", label: "Primary Elections", type: "concept", parent: "10" },

    // Major Policies
    { id: "14", label: "Major Policies", type: "category", parent: "1" },
    { id: "15", label: "Foreign Policy", type: "concept", parent: "14" },
    { id: "16", label: "Economic Policy", type: "concept", parent: "14" },
    { id: "17", label: "Social Policy", type: "concept", parent: "14" },
    { id: "18", label: "Environmental Policy", type: "concept", parent: "14" }
  ],
  edges: [
    { source: "1", target: "2" },
    { source: "1", target: "6" },
    { source: "1", target: "10" },
    { source: "1", target: "14" },

    // Government Structure Connections
    { source: "2", target: "3" },
    { source: "2", target: "4" },
    { source: "2", target: "5" },

    // Political Parties Connections
    { source: "6", target: "7" },
    { source: "6", target: "8" },
    { source: "6", target: "9" },

    // Elections Connections
    { source: "10", target: "11" },
    { source: "10", target: "12" },
    { source: "10", target: "13" },

    // Major Policies Connections
    { source: "14", target: "15" },
    { source: "14", target: "16" },
    { source: "14", target: "17" },
    { source: "14", target: "18" }
  ]
};

// Agregar estas interfaces al inicio del archivo, junto con las otras interfaces
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

// Actualizar la declaración global
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
}

// Agregar esta función helper fuera del componente
const getBrowserLanguage = (): string => {
  // Get browser language
  const browserLang = navigator.language || navigator.languages?.[0];
  
  // Supported languages by Web Speech API
  const supportedLanguages = {
    'es': 'en-US',    // Spanish -> English
    'en': 'en-US',    // English
    'fr': 'en-US',    // French -> English
    'de': 'en-US',    // German -> English
    'it': 'en-US',    // Italian -> English
    'pt': 'en-US',    // Portuguese -> English
    'zh': 'en-US',    // Chinese -> English
    'ja': 'en-US',    // Japanese -> English
    'ko': 'en-US',    // Korean -> English
    'ru': 'en-US',    // Russian -> English
  };

  // Get base language code (e.g., 'en' from 'en-US')
  const baseLanguage = browserLang?.split('-')[0];
  
  // Always return English
  return 'en-US';
};

export function FruitLearning() {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [showWordSearch, setShowWordSearch] = useState(false)
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<[number, number][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [recallStats, setRecallStats] = useState<RecallStatus>({
    easy: 0,
    medium: 0,
    hard: 0,
    again: 0,
  });
  const [showVideo, setShowVideo] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>([
    { id: 1, message: "Analyzing request...", completed: false },
    { id: 2, message: "Generating adaptive content...", completed: false },
    { id: 3, message: "Processing video parameters...", completed: false },
    { id: 4, message: "Optimizing learning experience...", completed: false },
    { id: 5, message: "Preparing video content...", completed: false }
  ]);
  const [showMindMap, setShowMindMap] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [contentHistory, setContentHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Move these states inside the FruitLearning component
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isSessionListOpen, setIsSessionListOpen] = useState(false);

  // Add this constant for available learning options
  const learningOptions: LearningOption[] = [
    {
      id: 'text',
      name: 'Text',
      command: 'text',
      icon: <FileText className="h-4 w-4" />,
      description: 'Learn through text explanations',
      isDefault: true
    },
    {
      id: 'puzzle',
      name: 'Word Puzzle',
      command: 'teach me about fruits',
      icon: <PuzzleIcon className="h-4 w-4" />,
      description: 'Learn through an interactive word puzzle'
    },
    {
      id: 'flashcards',
      name: 'Flashcards',
      command: 'flashcards',
      icon: <CreditCard className="h-4 w-4" />,
      description: 'Study with interactive flashcards'
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      command: 'show mind map',
      icon: <Brain className="h-4 w-4" />,
      description: 'Visualize concepts with a mind map'
    },
    {
      id: 'video',
      name: 'Video',
      command: 'video',
      icon: <Video className="h-4 w-4" />,
      description: 'Watch an educational video'
    }
  ];

  // Update handleOptionSelect to not modify the message
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    // Reset all view states when selecting a new option
    setShowWordSearch(false);
    setShowFlashcards(false);
    setShowVideo(false);
    setShowMindMap(false);
    setIsLoading(false);
    setLoadingProgress(0);
    
    // Focus the input field
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && !isCommandOpen) {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isCommandOpen]);

  const handleCellMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([[row, col]])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectedCells([...selectedCells, [row, col]])
    }
  }

  const handleCellMouseUp = () => {
    setIsSelecting(false)
    checkSelectedWord()
  }

  // Modificar el estado de celebración para incluir más información
  const [celebration, setCelebration] = useState<{
    active: boolean;
    position: { x: number; y: number };
    word: string;
  } | null>(null);

  const checkSelectedWord = () => {
    if (!wordSearchData) return;

    const start = selectedCells[0];
    const end = selectedCells[selectedCells.length - 1];

    const foundAnswer = wordSearchData.answers.find(answer => 
      (answer.start[0] === start[0] && answer.start[1] === start[1] && 
       answer.end[0] === end[0] && answer.end[1] === end[1]) ||
      (answer.start[0] === end[0] && answer.start[1] === end[1] && 
       answer.end[0] === start[0] && answer.end[1] === start[1])
    );

    if (foundAnswer && !foundWords.includes(foundAnswer.word)) {
      const lastCell = document.querySelector(`[data-cell="${end[0]},${end[1]}"]`);
      const rect = lastCell?.getBoundingClientRect();
      
      if (rect) {
        // Activar celebración con la palabra encontrada
        setCelebration({
          active: true,
          position: {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          },
          word: foundAnswer.word
        });

        // Añadir la palabra encontrada
        setFoundWords(prev => [...prev, foundAnswer.word]);

        // Desactivar celebración después de la animación
        setTimeout(() => {
          setCelebration(null);
        }, 1500); // Aumentado a 1.5 segundos para que se vea mejor la celebración
      }
    }

    setSelectedCells([]);
  };

  const isCellSelected = (row: number, col: number) => selectedCells.some(cell => cell[0] === row && cell[1] === col)

  const isCellFound = (row: number, col: number) => 
    wordSearchData && foundWords.some(word => 
      wordSearchData.answers.find(answer => 
        answer.word === word && 
        ((row >= answer.start[0] && row <= answer.end[0] && col >= answer.start[1] && col <= answer.end[1]) ||
         (row >= answer.end[0] && row <= answer.start[0] && col >= answer.end[1] && col <= answer.start[1]))
      )
    );

  // Actualizar las variantes de animación
  const gridVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cellVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.5,
      y: 20
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % mathData.flashcards.length);
  };

  const previousCard = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => 
      prev === 0 ? mathData.flashcards.length - 1 : prev - 1
    );
  };

  const handleRecallFeedback = (level: keyof RecallStatus) => {
    setRecallStats(prev => ({
      ...prev,
      [level]: prev[level] + 1
    }));
    nextCard();
    setIsFlipped(false);
  };

  const simulateLoading = async () => {
    setIsLoading(true);
    setLoadingProgress(0);
    
    // Reset steps
    setLoadingSteps(steps => steps.map(step => ({ ...step, completed: false })));

    // Simulate step completion
    for (let i = 0; i < loadingSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds per step
      setLoadingSteps(steps => 
        steps.map(step => 
          step.id === i + 1 ? { ...step, completed: true } : step
        )
      );
      setLoadingProgress((i + 1) * (100 / loadingSteps.length));
    }

    setIsLoading(false);
    setShowVideo(true);
  };

  const generateNodePositions = (mindMapData: MindMapData) => {
    const levelSpacing = 250; // Increased spacing between levels
    const centerX = 500; // Increased center position
    const centerY = 300;

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Helper function to get children of a node
    const getChildren = (nodeId: string) => {
      return mindMapData.nodes.filter(node => node.parent === nodeId);
    };

    // Position root node (Mathematics)
    const rootNode = mindMapData.nodes.find(node => node.type === 'general_subject');
    if (rootNode) {
      newNodes.push({
        id: rootNode.id,
        position: { x: centerX, y: centerY },
        data: { label: rootNode.label },
        className: 'bg-blue-500 text-white rounded-lg p-4 shadow-lg font-semibold',
      });

      // Position category nodes (Level 1)
      const categoryNodes = getChildren(rootNode.id);
      const categoryCount = categoryNodes.length;
      categoryNodes.forEach((node, index) => {
        const angle = ((2 * Math.PI) / categoryCount) * index - Math.PI / 2; // Start from top
        const x = centerX + Math.cos(angle) * levelSpacing;
        const y = centerY + Math.sin(angle) * levelSpacing;

        newNodes.push({
          id: node.id,
          position: { x, y },
          data: { label: node.label },
          className: 'bg-green-500 text-white rounded-lg p-3 shadow-md font-medium',
        });

        // Add edge from root to category
        newEdges.push({
          id: `${rootNode.id}-${node.id}`,
          source: rootNode.id,
          target: node.id,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: '#64748b', 
            strokeWidth: 2,
            opacity: 0.8,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#64748b',
          },
        });

        // Position concept nodes (Level 2) for each category
        const conceptNodes = getChildren(node.id);
        const conceptCount = conceptNodes.length;
        conceptNodes.forEach((conceptNode, conceptIndex) => {
          // Calculate position in an arc around the category node
          const conceptAngle = angle - Math.PI/4 + (Math.PI/2 * (conceptIndex / (conceptCount - 1 || 1)));
          const conceptRadius = levelSpacing * 0.8;
          const x = centerX + Math.cos(angle) * levelSpacing + Math.cos(conceptAngle) * conceptRadius;
          const y = centerY + Math.sin(angle) * levelSpacing + Math.sin(conceptAngle) * conceptRadius;

          newNodes.push({
            id: conceptNode.id,
            position: { x, y },
            data: { label: conceptNode.label },
            className: 'bg-yellow-500 text-white rounded-lg p-2 shadow-sm text-sm',
          });

          // Add edge from category to concept
          newEdges.push({
            id: `${node.id}-${conceptNode.id}`,
            source: node.id,
            target: conceptNode.id,
            type: 'smoothstep',
            animated: true,
            style: { 
              stroke: '#94a3b8', 
              strokeWidth: 1.5,
              opacity: 0.7,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#94a3b8',
            },
          });
        });
      });
    }

    return { nodes: newNodes, edges: newEdges };
  };

  // Añadir este estado para manejar el video actual
  const [currentVideo, setCurrentVideo] = useState<{
    title: string;
    content: string;
    url: string;
  } | null>(null);

  // Función unificada de generateVideo
  const generateVideo = async (prompt: string) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      setLoadingPhase(0);
      
      // Iniciar animación de carga
      const loadingInterval = setInterval(() => {
        setLoadingPhase(prev => (prev + 1) % 3); // Crear efecto de pulso
      }, 800);

      // Simular progreso realista
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev < 90) { // Solo incrementar hasta 90% automáticamente
            // Incremento no linear para simular proceso real
            const increment = Math.max(0.5, (90 - prev) / 10);
            return Math.min(90, prev + increment);
          }
          return prev;
        });
      }, 1000);

      // Reset loading steps
      setLoadingSteps(steps => steps.map(step => ({ ...step, completed: false })));

      // Actualizar los pasos de carga para reflejar el proceso real
      setLoadingSteps([
        { id: 1, message: "Generating initial text...", completed: false },
        { id: 2, message: "Initiating video generation...", completed: false },
        { id: 3, message: "Processing video...", completed: false },
        { id: 4, message: "Downloading video...", completed: false },
        { id: 5, message: "Finalizing...", completed: false }
      ]);

      const response = await fetch('http://147.182.255.123:3000/generateVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      // Limpiar intervalos
      clearInterval(loadingInterval);
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error('Failed to generate video');
      }

      const data = await response.json();

      if (data.success) {
        setLoadingSteps(steps => steps.map(step => ({ ...step, completed: true })));
        setLoadingProgress(100);

        setCurrentVideo({
          title: data.title,
          content: data.content,
          url: data.video_url
        });

        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          type: 'video',
          content: {
            videoUrl: data.video_url,
          },
          timestamp: new Date(),
          title: data.title || `Video: ${prompt.substring(0, 30)}...`,
        };
        
        setContentHistory(prev => [newHistoryItem, ...prev]);
        setIsLoading(false);
        setShowVideo(true);
      } else {
        throw new Error('Video generation failed');
      }

    } catch (error) {
      console.error('Error generating video:', error);
      setIsLoading(false);
    }
  };

  // Añadir función para generar sopa de letras
  const generateWordSearch = async (prompt: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/generate-word-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate word search');
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar el estado de la sopa de letras con los nuevos datos
        setWordSearchData(data.data);
        
        // Resetear estados
        setFoundWords([]);
        setSelectedCells([]);
        
        // Añadir al historial
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          type: 'puzzle',
          content: {
            wordSearchData: data.data,
          },
          timestamp: new Date(),
          title: `Word Search: ${prompt.substring(0, 30)}...`,
        };
        
        setContentHistory(prev => [newHistoryItem, ...prev]);
        
        // Mostrar la sopa de letras
        setIsLoading(false);
        setShowWordSearch(true);
      } else {
        throw new Error('Word search generation failed');
      }

    } catch (error) {
      console.error('Error generating word search:', error);
      setIsLoading(false);
    }
  };

  // Añadir el estado para mathData
  const [mathData, setMathData] = useState<MathData>({
    general_subject: "",
    flashcards: []
  });

  // Modificar la función generateFlashcards
  const generateFlashcards = async (prompt: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();

      if (data.success) {
        // Actualizar el estado de mathData con los nuevos datos
        setMathData({
          general_subject: data.data.general_subject,
          flashcards: data.data.flashcards
        });

        // Resetear estados
        setCurrentCardIndex(0);
        setIsFlipped(false);
        setRecallStats({
          easy: 0,
          medium: 0,
          hard: 0,
          again: 0,
        });
        
        // Añadir al historial
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          type: 'flashcards',
          content: {
            mathData: {
              general_subject: data.data.general_subject,
              flashcards: data.data.flashcards
            },
          },
          timestamp: new Date(),
          title: `Flashcards: ${prompt.substring(0, 30)}...`,
        };
        
        setContentHistory(prev => [newHistoryItem, ...prev]);
        
        // Mostrar las flashcards
        setIsLoading(false);
        setShowFlashcards(true);
      } else {
        throw new Error('Flashcards generation failed');
      }

    } catch (error) {
      console.error('Error generating flashcards:', error);
      setIsLoading(false);
    }
  };

  // Añadir función para generar mind map
  const generateMindMap = async (prompt: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/generate-mind-map', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate mind map');
      }

      const data = await response.json();

      if (data.success) {
        // Generar posiciones de nodos y convertir a formato ReactFlow
        const { nodes: newNodes, edges: newEdges } = generateNodePositions({
          general_subject: data.data.general_subject,
          nodes: data.data.nodes,
          edges: data.data.edges
        });
        
        // Actualizar estados
        setNodes(newNodes);
        setEdges(newEdges);
        
        // Añadir al historial
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          type: 'mindmap',
          content: {
            mindMapData: {
              general_subject: data.data.general_subject,
              nodes: data.data.nodes,
              edges: data.data.edges
            },
          },
          timestamp: new Date(),
          title: `Mind Map: ${prompt.substring(0, 30)}...`,
        };
        
        setContentHistory(prev => [newHistoryItem, ...prev]);
        
        // Mostrar el mind map
        setIsLoading(false);
        setShowMindMap(true);
      } else {
        throw new Error('Mind map generation failed');
      }

    } catch (error) {
      console.error('Error generating mind map:', error);
      setIsLoading(false);
    }
  };

  // Añadir estado para el contenido detallado
  const [detailedContent, setDetailedContent] = useState<string>('');
  const [showDetailedContent, setShowDetailedContent] = useState(false);

  // Añadir contador de mensajes
  const [messageCount, setMessageCount] = useState(0);

  // Función para limpiar el historial
  const clearHistory = async () => {
    try {
      console.log('Attempting to clear history...');
      const response = await fetch('/api/clear-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to clear history: ${response.status}`);
      }

      const data = await response.json();
      console.log('History cleared successfully:', data);
      return data;
    } catch (error) {
      console.error('Error clearing history:', error);
      throw error; // Re-throw para manejar el error en el caller
    }
  };

  // Modificar handleMessageSubmit para incluir el contador y la limpieza
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOption || !message.trim() || !currentSession) return;

    // Incrementar el contador de mensajes y verificar si necesitamos limpiar el historial
    setMessageCount(prev => {
      const newCount = prev + 1;
      // Si el nuevo contador es múltiplo de 3, limpiar el historial
      if (newCount % 3 === 0) {
        console.log('Clearing history at message count:', newCount);
        clearHistory().catch(error => {
          console.error('Failed to clear history:', error);
        });
      }
      return newCount;
    });

    const userMessage: ChatMessage = { 
      role: 'user',
      content: message 
    };

    // Limpiar el mensaje inmediatamente
    const currentMessage = message;
    setMessage('');

    // Añadir el mensaje del usuario al chat inmediatamente
    setChatHistory(prev => [...prev, userMessage]);

    if (selectedOption === 'text') {
      try {
        // Primera respuesta para el chat
        const processingMessage: ChatMessage = {
          role: 'assistant',
          content: 'I am processing your request...'
        };
        setChatHistory(prev => [...prev, processingMessage]);

        // Primera llamada para el chat
        const response = await handleSendMessage(currentMessage);
        const assistantResponse: ChatMessage = { 
          role: 'assistant',
          content: response 
        };
        
        // Actualizar el chat reemplazando el mensaje de procesamiento
        setChatHistory(prev => [...prev.slice(0, -1), assistantResponse]);

        // Segunda llamada para contenido detallado (asíncrona)
        fetch('/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Please elaborate and provide more details about this topic: ${response}`,
            learning_type: 'text',
            format: 'markdown'
          }),
        }).then(async (detailedResponse) => {
          const detailedData = await detailedResponse.json();
          setDetailedContent(detailedData.response || '');
          setShowDetailedContent(true);
        }).catch(error => {
          console.error('Error getting detailed content:', error);
        });

      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage: ChatMessage = {
          role: 'system',
          content: 'Error: Failed to get response'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } else if (selectedOption === 'video') {
      // Si es video, añadir mensaje de procesamiento y comenzar generación
      const processingMessage: ChatMessage = {
        role: 'assistant',
        content: 'I am processing your request. The video will be generated in the right panel.'
      };
      setChatHistory(prev => [...prev, processingMessage]);
      
      // Iniciar la generación del video
      generateVideo(message).catch(error => {
        console.error('Error generating video:', error);
        const errorMessage: ChatMessage = {
          role: 'system',
          content: 'There was an error generating the video. Please try again.'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      });
    } else if (selectedOption === 'puzzle') {
      // Si es sopa de letras, añadir mensaje y comenzar generación
      const processingMessage: ChatMessage = {
        role: 'assistant',
        content: 'I am generating a word search puzzle based on your topic. It will appear in the right panel.'
      };
      setChatHistory(prev => [...prev, processingMessage]);
      
      generateWordSearch(message).catch(error => {
        console.error('Error generating word search:', error);
        const errorMessage: ChatMessage = {
          role: 'system',
          content: 'There was an error generating the word search puzzle. Please try again.'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      });
    } else if (selectedOption === 'flashcards') {
      // Si son flashcards, añadir mensaje y comenzar generación
      const processingMessage: ChatMessage = {
        role: 'assistant',
        content: 'I am generating flashcards based on your topic. They will appear in the right panel.'
      };
      setChatHistory(prev => [...prev, processingMessage]);
      
      generateFlashcards(message).catch(error => {
        console.error('Error generating flashcards:', error);
        const errorMessage: ChatMessage = {
          role: 'system',
          content: 'There was an error generating the flashcards. Please try again.'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      });
    } else if (selectedOption === 'mindmap') {
      // Si es mindmap, añadir mensaje y comenzar generación
      const processingMessage: ChatMessage = {
        role: 'assistant',
        content: 'I am generating a mind map based on your topic. It will appear in the right panel.'
      };
      setChatHistory(prev => [...prev, processingMessage]);
      
      generateMindMap(message).catch(error => {
        console.error('Error generating mind map:', error);
        const errorMessage: ChatMessage = {
          role: 'system',
          content: 'There was an error generating the mind map. Please try again.'
        };
        setChatHistory(prev => [...prev, errorMessage]);
      });
    }
  };

  // Update the handleSendMessage function to return the response
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          learning_type: selectedOption,
          format: 'markdown'
        }),
      });

      const data = await response.json();
      
      if (selectedOption === 'text') {
        return data.response || 'No response received';
      }
      return '';
      
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Error: Failed to get response';
    }
  };

  // Add this helper function to get content for history
  const getAssistantResponse = (optionId: string): string => {
    switch (optionId) {
      case 'text':
        return "I'll explain this concept through text. What would you like to learn about?";
      case 'puzzle':
        return "Let's learn through this interactive word puzzle! Find all the hidden words related to the topic in the grid.";
      case 'flashcards':
        return "Let's study with flashcards! Click on a card to flip it and rate your recall.";
      case 'mindmap':
        return "Here's a mind map to help you visualize the concepts!";
      case 'video':
        return "I'll prepare an educational video for you. Please wait while I process the content...";
      default:
        return "Let's start learning!";
    }
  };

  // Add this function to create a new session
  const createNewSession = () => {
    const newSession: Session = {
      id: Date.now().toString(),
      name: `Session ${sessions.length + 1}`,
      timestamp: new Date(),
      chatHistory: [],
      contentHistory: []
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
    // Reset all states for new session
    setChatHistory([]);
    setContentHistory([]);
    setShowWordSearch(false);
    setShowFlashcards(false);
    setShowVideo(false);
    setShowMindMap(false);
  };

  useEffect(() => {
    // Create default session if no sessions exist
    if (sessions.length === 0) {
      const defaultSession: Session = {
        id: Date.now().toString(),
        name: "Default Session",
        timestamp: new Date(),
        chatHistory: [],
        contentHistory: []
      };
      setSessions([defaultSession]);
      setCurrentSession(defaultSession);
    }
  }, [sessions.length]); // Add sessions.length to dependency array

  // Add these new handlers for touch events
  const handleTouchStart = (row: number, col: number) => {
    setIsSelecting(true);
    setSelectedCells([[row, col]]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSelecting) return;
    
    // Prevent scrolling while selecting
    e.preventDefault();
    
    // Get touch position
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Check if we're still over a cell and get its coordinates
    if (element?.getAttribute('data-cell')) {
      const [touchRow, touchCol] = element
        .getAttribute('data-cell')!
        .split(',')
        .map(Number);
      
      // Only add cell if it's different from the last selected cell
      const lastCell = selectedCells[selectedCells.length - 1];
      if (lastCell[0] !== touchRow || lastCell[1] !== touchCol) {
        setSelectedCells(prev => [...prev, [touchRow, touchCol]]);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsSelecting(false);
    checkSelectedWord();
  };

  useEffect(() => {
    const defaultOption = learningOptions.find(opt => opt.isDefault);
    if (defaultOption) {
      setSelectedOption(defaultOption.id);
      // Focus the input field after setting the default option
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, []); // Run once on mount

  // Add a new ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Add this function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  // Add useEffect to scroll when chat history updates
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Añadir estado para el tiempo estimado
  const [estimatedMinutes, setEstimatedMinutes] = useState(2);

  // Añadir estado para los datos de la sopa de letras
  const [wordSearchData, setWordSearchData] = useState<{
    grid: string[][];
    answers: {
      word: string;
      start: [number, number];
      end: [number, number];
    }[];
  } | null>(null);

  // Agregar estos estados para el manejo del micrófono
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  // Agregar estado para el idioma actual
  const [currentLanguage, setCurrentLanguage] = useState<string>(getBrowserLanguage());

  // Modificar el useEffect del reconocimiento de voz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = currentLanguage; // Usar el idioma detectado

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          const lastResult = event.results[event.results.length - 1];
          if (lastResult.isFinal) {
            const transcript = lastResult[0].transcript;
            setMessage(prev => prev + ' ' + transcript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          let errorMessage = 'Unknown speech recognition error';
          
          switch (event.error) {
            case 'network':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone access was denied.';
              break;
            case 'no-speech':
              errorMessage = 'No speech was detected.';
              break;
            case 'aborted':
              errorMessage = 'Speech recognition was aborted.';
              break;
          }
          
          console.error('Speech recognition error:', errorMessage);
          setIsListening(false);
          
          setChatHistory(prev => [...prev, {
            role: 'system',
            content: `🎤 ${errorMessage}`
          }]);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognition);
      } else {
        const errorMessage = '🎤 Speech recognition is not available in this browser. Please use Chrome or Edge.';
        console.warn('Speech recognition is not supported in this browser');
        setChatHistory(prev => [...prev, {
          role: 'system',
          content: errorMessage
        }]);
      }
    }
  }, [currentLanguage]); // Agregar currentLanguage como dependencia

  // Modificar toggleListening para incluir mensajes según el idioma
  const toggleListening = () => {
    if (!recognition) {
      const errorMessage = 'Speech recognition is not supported in this browser';
      console.error(errorMessage);
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        const feedbackMessage = '🎤 Listening... Speak now.';
        
        setChatHistory(prev => [...prev, {
          role: 'system',
          content: feedbackMessage
        }]);
      }
      setIsListening(!isListening);
    } catch (error) {
      console.error('Microphone toggle error:', error);
      setIsListening(false);
      
      const errorMessage = '🎤 Error starting speech recognition. Please try again.';
      
      setChatHistory(prev => [...prev, {
        role: 'system',
        content: errorMessage
      }]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-gray-100 p-2 sm:p-4 gap-2 sm:gap-4">
      {/* Session List - Ajustado para estar colapsado por defecto */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          isSessionListOpen 
            ? 'lg:w-72 w-full' 
            : 'w-0 lg:w-16'
        }`}
      >
        <Card className="h-full overflow-hidden">
          <div className="flex items-center justify-between p-3 border-b bg-gradient-to-r from-indigo-600 to-violet-600">
            <h2 className={`font-semibold text-white transition-opacity duration-200 ${
              !isSessionListOpen ? 'opacity-0 lg:hidden' : 'opacity-100'
            }`}>
              Learning Sessions
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={createNewSession}
                className={`text-white hover:bg-indigo-500 transition-opacity duration-200 ${
                  !isSessionListOpen ? 'opacity-0 lg:hidden' : 'opacity-100'
                }`}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Session
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSessionListOpen(!isSessionListOpen)}
                className="text-white hover:bg-indigo-500"
              >
                {isSessionListOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className={`overflow-y-auto transition-opacity duration-200 ${
            !isSessionListOpen ? 'opacity-0 lg:hidden' : 'opacity-100'
          }`}>
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <FolderPlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No sessions yet</p>
                <p className="text-sm">Create a new session to get started</p>
              </div>
            ) : (
              sessions.map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start p-3 gap-3 ${
                      currentSession?.id === session.id 
                        ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setCurrentSession(session);
                      setChatHistory(session.chatHistory);
                      setContentHistory(session.contentHistory);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        currentSession?.id === session.id 
                          ? 'bg-indigo-600' 
                          : 'bg-gray-300'
                      }`} />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{session.name}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(session.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col lg:flex-row gap-2 sm:gap-4">
        <Card className="w-full lg:w-1/3 h-full overflow-hidden flex flex-col">
          <CardContent 
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-2 sm:p-4 scroll-smooth"
          >
            {chatHistory.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`mb-4 ${
                  message.role === 'user' 
                    ? 'text-right' 
                    : message.role === 'system'
                    ? 'text-left font-mono text-sm'
                    : 'text-left'
                }`}
              >
                <div className={`inline-block p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-indigo-600 text-white' 
                    : message.role === 'system'
                    ? 'bg-gray-800 text-gray-200 font-mono'
                    : 'bg-violet-100 text-gray-800'
                }`}>
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({ node, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return (
                              <code
                                className={`${isInline ? 'bg-gray-200 text-gray-800 px-1 rounded' : 'block bg-gray-800 text-white p-2 rounded'}`}
                                {...props}
                              >
                                {children}
                              </code>
                            );
                            
                          },
                          p: ({ children }) => <p className="mb-1">{children}</p>,
                          ul: ({ children }) => <ul className="mb-1 list-disc pl-4">{children}</ul>,
                          ol: ({ children }) => <ol className="mb-1 list-decimal pl-4">{children}</ol>,
                          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-md font-bold mb-1">{children}</h3>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    message.content
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
          <CardContent className="p-2 sm:p-4 border-t">
            <div className="flex flex-col gap-2 sm:gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5">
                {learningOptions.map((option) => (
                  <Button
                    key={option.id}
                    variant={selectedOption === option.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleOptionSelect(option.id)}
                    className={`flex items-center gap-1 p-1.5 min-h-[36px] ${
                      selectedOption === option.id 
                        ? 'ring-1 ring-primary bg-indigo-600 text-white' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-1 w-full">
                      <div className="shrink-0">
                        {option.icon}
                      </div>
                      <div className="flex flex-col items-start min-w-0 gap-0">
                        <span className="font-medium text-[11px] truncate w-full leading-none">
                          {option.name}
                        </span>
                        <span className={`text-[9px] truncate w-full leading-tight ${
                          selectedOption === option.id 
                            ? 'text-indigo-100 block' 
                            : 'text-gray-500'
                        }`}>
                          {option.description}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>

              <form onSubmit={handleMessageSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={selectedOption 
                    ? `Type your message...` 
                    : "Select a learning option above..."
                  }
                  className="flex-grow text-sm sm:text-base"
                  disabled={!selectedOption}
                  autoFocus
                />
                <Button 
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={toggleListening}
                  className={`${isListening ? 'bg-red-100 text-red-600 hover:bg-red-200' : ''}`}
                  disabled={!selectedOption}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={!selectedOption || !message.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        
        <div className="w-full lg:w-2/3 h-full flex flex-col">
          <Card className="flex-grow">
            <CardContent className="relative h-full flex flex-col items-center justify-center p-2 sm:p-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="absolute top-4 right-4 z-10 flex items-center gap-2"
              >
                {showHistory ? (
                  <>
                    <X className="h-4 w-4" />
                    Hide History
                  </>
                ) : (
                  <>
                    <Clock className="h-4 w-4" />
                    Show History
                  </>
                )}
              </Button>

              <AnimatePresence mode="wait">
                {showHistory ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full overflow-y-auto"
                  >
                    <div className="space-y-4">
                      {contentHistory.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {item.type === 'puzzle' && <PuzzleIcon className="h-5 w-5 text-blue-500" />}
                              {item.type === 'flashcards' && <CreditCard className="h-5 w-5 text-green-500" />}
                              {item.type === 'mindmap' && <Brain className="h-5 w-5 text-purple-500" />}
                              {item.type === 'video' && <Video className="h-5 w-5 text-red-500" />}
                              <h3 className="font-medium">{item.title}</h3>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setShowHistory(false);
                              // Restore the content based on type
                              switch (item.type) {
                                case 'puzzle':
                                  setShowWordSearch(true);
                                  setShowFlashcards(false);
                                  setShowVideo(false);
                                  setShowMindMap(false);
                                  break;
                                case 'flashcards':
                                  setShowFlashcards(true);
                                  setShowWordSearch(false);
                                  setShowVideo(false);
                                  setShowMindMap(false);
                                  break;
                                case 'mindmap':
                                  if (item.content.mindMapData) {
                                    const { nodes: newNodes, edges: newEdges } = generateNodePositions(item.content.mindMapData);
                                    setNodes(newNodes);
                                    setEdges(newEdges);
                                    setShowMindMap(true);
                                  }
                                  break;
                                case 'video':
                                  simulateLoading();
                                  break;
                              }
                            }}
                          >
                            View Again
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {showWordSearch && wordSearchData && (
                      <motion.div
                        key="word-search"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center p-4 overflow-hidden"
                      >
                        <div className="flex flex-col h-full w-full max-w-6xl gap-4">
                          {/* Grid Container - Centrado y tamaño controlado */}
                          <div className="flex-shrink-0 flex justify-center items-center">
                            <motion.div 
                              className="relative bg-white rounded-xl p-4 shadow-lg"
                              variants={gridVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              <div className="grid gap-1">
                                {wordSearchData.grid.map((row, rowIndex) => (
                                  <motion.div 
                                    key={rowIndex} 
                                    className="flex gap-1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: rowIndex * 0.1 }}
                                  >
                                    {row.map((cell, colIndex) => (
                                      <motion.button
                                        key={`${rowIndex}-${colIndex}`}
                                        variants={cellVariants}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        data-cell={`${rowIndex},${colIndex}`}
                                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                                        onMouseUp={handleCellMouseUp}
                                        onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                                        onTouchMove={handleTouchMove}
                                        onTouchEnd={handleTouchEnd}
                                        className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-sm sm:text-base font-bold 
                                          select-none touch-none transition-all duration-200
                                          ${isCellFound(rowIndex, colIndex) 
                                            ? 'bg-green-500 text-white scale-105 shadow-lg' 
                                            : isCellSelected(rowIndex, colIndex) 
                                            ? 'bg-blue-300' 
                                            : 'bg-gray-50 hover:bg-gray-100'}`}
                                      >
                                        {cell}
                                      </motion.button>
                                    ))}
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          </div>

                          {/* Words Lists Container - Ajustado para usar el espacio restante */}
                          <div className="flex-1 min-h-0 overflow-auto">
                            <motion.div 
                              className="grid grid-cols-2 gap-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              {/* Found Words */}
                              <div className="bg-white rounded-lg p-4 shadow-md overflow-auto">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800 sticky top-0 bg-white pb-2">
                                  Found Words: ({foundWords.length}/{wordSearchData.answers.length})
                                </h3>
                                <div className="space-y-2">
                                  {foundWords.map((word, index) => (
                                    <motion.div
                                      key={word}
                                      initial={{ opacity: 0, x: -20 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="flex items-center gap-2"
                                    >
                                      <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">
                                        ✓
                                      </span>
                                      <span className="text-green-600 font-medium">{word}</span>
                                    </motion.div>
                                  ))}
                                </div>
                              </div>

                              {/* Words to Find */}
                              <div className="bg-white rounded-lg p-4 shadow-md overflow-auto">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800 sticky top-0 bg-white pb-2">
                                  Words to Find: ({wordSearchData.answers.length - foundWords.length} remaining)
                                </h3>
                                <div className="space-y-2">
                                  {wordSearchData.answers
                                    .filter(answer => !foundWords.includes(answer.word))
                                    .map((answer, index) => (
                                      <motion.div
                                        key={answer.word}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2"
                                      >
                                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm">
                                          {index + 1}
                                        </span>
                                        <span className="text-gray-600">{answer.word}</span>
                                      </motion.div>
                                    ))}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>

                        {/* Confetti y celebración */}
                        {celebration && (
                          <>
                            <Confetti
                              width={window.innerWidth}
                              height={window.innerHeight}
                              recycle={false}
                              numberOfPieces={200}
                              gravity={0.3}
                              initialVelocityY={10}
                              tweenDuration={1500}
                            />
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: [1, 1.2, 1],
                                opacity: [0, 1, 0]
                              }}
                              transition={{ duration: 1.5 }}
                              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
                            >
                              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-center">
                                <motion.div
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="text-2xl font-bold mb-1"
                                >
                                  Found!
                                </motion.div>
                                <motion.div
                                  initial={{ y: 10, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="text-lg"
                                >
                                  {celebration.word}
                                </motion.div>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    )}
                    {showFlashcards && (
                      <motion.div
                        key="flashcards"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 overflow-hidden"
                      >
                        {/* Stats Card - Make it scrollable on mobile */}
                        <div className="w-full max-w-2xl overflow-x-auto">
                          <Card>
                            <CardContent className="p-4">
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 min-w-[600px] sm:min-w-0">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-green-600">{recallStats.easy}</div>
                                  <div className="text-sm text-gray-500">Easy</div>
                                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                                    <div 
                                      className="h-full bg-green-500 rounded-full"
                                      style={{ 
                                        width: `${(recallStats.easy / (recallStats.easy + recallStats.medium + recallStats.hard + recallStats.again || 1)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-yellow-600">{recallStats.medium}</div>
                                  <div className="text-sm text-gray-500">Medium</div>
                                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                                    <div 
                                      className="h-full bg-yellow-500 rounded-full"
                                      style={{ 
                                        width: `${(recallStats.medium / (recallStats.easy + recallStats.medium + recallStats.hard + recallStats.again || 1)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-orange-600">{recallStats.hard}</div>
                                  <div className="text-sm text-gray-500">Hard</div>
                                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                                    <div 
                                      className="h-full bg-orange-500 rounded-full"
                                      style={{ 
                                        width: `${(recallStats.hard / (recallStats.easy + recallStats.medium + recallStats.hard + recallStats.again || 1)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-red-600">{recallStats.again}</div>
                                  <div className="text-sm text-gray-500">Again</div>
                                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                                    <div 
                                      className="h-full bg-red-500 rounded-full"
                                      style={{ 
                                        width: `${(recallStats.again / (recallStats.easy + recallStats.medium + recallStats.hard + recallStats.again || 1)) * 100}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Flashcard Container - Adjust size for mobile */}
                        <div className="flex items-center gap-2 sm:gap-4 w-full max-w-[600px]">
                          <Button
                            onClick={previousCard}
                            variant="outline"
                            size="icon"
                            className="rounded-full shrink-0"
                          >
                            ←
                          </Button>
                          
                          <div 
                            className="w-full aspect-[3/2] sm:aspect-[3/2] relative perspective-1000"
                            style={{ maxHeight: '60vh' }}
                            onClick={() => setIsFlipped(!isFlipped)}
                          >
                            <div
                              className="w-full h-full absolute preserve-3d transition-transform duration-500"
                              style={{
                                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                              }}
                            >
                              {/* Front of card */}
                              <Card className="w-full h-full absolute backface-hidden">
                                <CardContent className="p-4 sm:p-8 h-full">
                                  <div className="flex flex-col h-full">
                                    <div className="flex justify-between mb-2 sm:mb-4 text-sm">
                                      <span className={`px-2 py-1 rounded ${
                                        mathData.flashcards[currentCardIndex].difficulty === 'Easy' 
                                          ? 'bg-green-100 text-green-700'
                                          : mathData.flashcards[currentCardIndex].difficulty === 'Medium'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {mathData.flashcards[currentCardIndex].difficulty}
                                      </span>
                                      <span className="text-gray-500">
                                        {mathData.flashcards[currentCardIndex].category}
                                      </span>
                                    </div>
                                    <div className="flex-grow flex items-center justify-center text-base sm:text-xl font-semibold text-center p-2">
                                      {mathData.flashcards[currentCardIndex].front}
                                    </div>
                                    <div className="flex gap-1 sm:gap-2 flex-wrap">
                                      {mathData.flashcards[currentCardIndex].tags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs sm:text-sm">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Back of card */}
                              <Card 
                                className="w-full h-full absolute backface-hidden rotate-y-180"
                                style={{ transform: "rotateY(180deg)" }}
                              >
                                <CardContent className="p-4 sm:p-8 h-full flex items-center justify-center">
                                  <p className="text-base sm:text-xl font-semibold text-center">
                                    {mathData.flashcards[currentCardIndex].back}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>

                          <Button
                            onClick={nextCard}
                            variant="outline"
                            size="icon"
                            className="rounded-full shrink-0"
                          >
                            →
                          </Button>
                        </div>

                        {/* Recall Buttons - Make them more compact on mobile */}
                        {isFlipped && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-wrap justify-center gap-2 sm:gap-4 px-4"
                          >
                            <Button
                              onClick={() => handleRecallFeedback('again')}
                              className="bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base"
                            >
                              Again
                            </Button>
                            <Button
                              onClick={() => handleRecallFeedback('hard')}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base"
                            >
                              Hard
                            </Button>
                            <Button
                              onClick={() => handleRecallFeedback('medium')}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm sm:text-base"
                            >
                              Medium
                            </Button>
                            <Button
                              onClick={() => handleRecallFeedback('easy')}
                              className="bg-green-500 hover:bg-green-600 text-white text-sm sm:text-base"
                            >
                              Easy
                            </Button>
                          </motion.div>
                        )}

                        <div className="text-center text-gray-500 text-sm">
                          Card {currentCardIndex + 1} of {mathData.flashcards.length}
                        </div>
                      </motion.div>
                    )}
                    {showMindMap && (
                      <ReactFlowProvider>
                        <div className="w-full h-full min-h-[300px]">
                          <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            fitView
                            className="bg-gray-50"
                            defaultEdgeOptions={{
                              type: 'bezier',
                              animated: true,
                            }}
                            connectionMode={ConnectionMode.Loose}
                            nodesDraggable={true}
                            nodesConnectable={false}
                            elementsSelectable={true}
                            panOnDrag={true}
                            minZoom={0.5}
                            maxZoom={2}
                          >
                            <Background 
                              variant={BackgroundVariant.Dots}
                              gap={12} 
                              size={1} 
                            />
                            <Controls />
                          </ReactFlow>
                        </div>
                      </ReactFlowProvider>
                    )}
                    {showVideo && !isLoading && (
                      <motion.div
                        key="video"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center gap-6 p-4 overflow-y-auto"
                      >
                        {/* Title and description */}
                        <div className="w-full max-w-4xl space-y-4">
                          <h2 className="text-2xl font-bold text-gray-800 text-center">
                            {currentVideo?.title || "Educational Video"}
                          </h2>
                          <p className="text-gray-600 text-center leading-relaxed">
                            {currentVideo?.content || "Educational content generated for you"}
                          </p>
                        </div>

                        {/* Video Container with shadow and rounded corners */}
                        <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-xl">
                          <iframe
                            className="w-full h-full"
                            src="/video_demo.mp4"
                            title="Educational Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        {/* Additional information */}
                        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Key points from the video:
                          </h3>
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>
                              {currentVideo?.content || ""}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    {isLoading && selectedOption === 'video' && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full flex flex-col items-center justify-center p-8 space-y-8"
                      >
                        <h2 className="text-2xl font-bold text-gray-800 text-center">
                          Generating your educational video
                        </h2>

                        {/* Barra de progreso mejorada */}
                        <div className="w-full max-w-2xl">
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-blue-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ 
                                width: `${loadingProgress}%`,
                                opacity: [0.5, 1, 0.5][loadingPhase] // Efecto de pulso
                              }}
                              transition={{ 
                                width: { duration: 0.5, ease: "easeInOut" },
                                opacity: { duration: 0.8, ease: "easeInOut" }
                              }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-2">
                              <motion.span
                                animate={{ 
                                  scale: [1, 1.2, 1][loadingPhase],
                                  opacity: [0.7, 1, 0.7][loadingPhase]
                                }}
                                transition={{ duration: 0.8 }}
                                className="inline-block w-2 h-2 bg-blue-500 rounded-full"
                              />
                              {Math.round(loadingProgress)}% completed
                            </span>
                            <span>
                              Estimated time: {Math.max(0, estimatedMinutes - Math.round((loadingProgress * estimatedMinutes) / 100))} min
                            </span>
                          </div>
                        </div>

                        {/* Pasos de carga con animaciones mejoradas */}
                        <div className="w-full max-w-2xl space-y-4">
                          {loadingSteps.map((step, index) => {
                            const isActive = (loadingProgress / 100) * loadingSteps.length > index;
                            return (
                              <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0,
                                  scale: isActive ? [1, 1.02, 1][loadingPhase] : 1
                                }}
                                transition={{ 
                                  duration: 0.5,
                                  delay: index * 0.1
                                }}
                                className="flex items-center gap-3"
                              >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                                  ${step.completed 
                                    ? 'bg-green-500 text-white' 
                                    : isActive
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-400'}`}
                                >
                                  {step.completed ? (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                      ✓
                                    </motion.span>
                                  ) : isActive ? (
                                    <motion.span
                                      animate={{ rotate: 360 }}
                                      transition={{ 
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                      }}
                                    >
                                      ⟳
                                    </motion.span>
                                  ) : (
                                    step.id
                                  )}
                                </div>
                                <span className={`flex-grow ${
                                  step.completed 
                                    ? 'text-green-600' 
                                    : isActive
                                    ? 'text-blue-600'
                                    : 'text-gray-600'
                                }`}>
                                  {step.message}
                                </span>
                                {step.completed && (
                                  <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm text-green-500"
                                  >
                                    Completed
                                  </motion.span>
                                )}
                              </motion.div>
                            );
                          })}
                        </div>

                        {/* Mensaje de espera con animación */}
                        <motion.p 
                          className="text-center text-gray-500 italic"
                          animate={{ 
                            opacity: [0.5, 1, 0.5][loadingPhase]
                          }}
                          transition={{ duration: 0.8 }}
                        >
                          This process may take up to {estimatedMinutes} minutes. 
                          We are generating a high-quality video for you.
                        </motion.p>
                      </motion.div>
                    )}
                    {!showWordSearch && !showFlashcards && !showVideo && !showMindMap && 
                      (!isLoading || selectedOption !== 'video') && (
                      <>
                        {showDetailedContent ? (
                          <motion.div
                            key="detailed-content"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex items-center justify-center p-6"
                          >
                            <Card className="w-full max-w-4xl h-[80vh]">
                              <CardContent className="h-full flex flex-col p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex-shrink-0">
                                  Detailed Explanation
                                </h2>
                                <div className="overflow-y-auto flex-grow pr-4">
                                  <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                                    <ReactMarkdown>
                                      {detailedContent}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-gray-500"
                          >
                            Select a learning option and type your question to begin!
                          </motion.div>
                        )}
                      </>
                    )}
                  </>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
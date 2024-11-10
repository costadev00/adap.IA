'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Brain, 
  Puzzle, 
  Video, 
  CreditCard, 
  Clock, 
  Target, 
  Award,
  Calendar
} from 'lucide-react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard() {
  // Mock data for learning progress
  const learningStats = {
    totalSessions: 42,
    hoursSpent: 28,
    completionRate: 78,
    streakDays: 15,
    flashcardStats: {
      total: 250,
      mastered: 175,
      reviewing: 50,
      learning: 25,
      accuracy: 85,
    },
    puzzleStats: {
      completed: 30,
      averageTime: "4:30",
      accuracy: 92,
    },
    mindMapStats: {
      created: 12,
      connections: 145,
      concepts: 89,
    },
    videoStats: {
      watched: 24,
      totalMinutes: 360,
      completionRate: 88,
    }
  }

  // Data for weekly progress chart
  const weeklyProgressData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Minutes Studied',
        data: [45, 60, 30, 90, 45, 75, 60],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
      }
    ]
  }

  // Data for learning methods distribution
  const learningMethodsData = {
    labels: ['Flashcards', 'Puzzles', 'Mind Maps', 'Videos'],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(196, 181, 253, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(139, 92, 246)',
          'rgb(167, 139, 250)',
          'rgb(196, 181, 253)',
        ],
        borderWidth: 1,
      }
    ]
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Learning Dashboard</h1>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Time</p>
              <h3 className="text-2xl font-bold">{learningStats.hoursSpent}h</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-violet-100 p-3 rounded-full">
              <Target className="h-6 w-6 text-violet-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <h3 className="text-2xl font-bold">{learningStats.completionRate}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <h3 className="text-2xl font-bold">{learningStats.streakDays} days</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-pink-100 p-3 rounded-full">
              <Award className="h-6 w-6 text-pink-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sessions</p>
              <h3 className="text-2xl font-bold">{learningStats.totalSessions}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={weeklyProgressData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning Methods Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut 
              data={learningMethodsData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'bottom' as const,
                  },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Flashcards Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Cards</span>
                <span className="font-bold">{learningStats.flashcardStats.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mastered</span>
                <span className="text-green-600 font-bold">{learningStats.flashcardStats.mastered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Accuracy</span>
                <span className="text-indigo-600 font-bold">{learningStats.flashcardStats.accuracy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Puzzle Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Word Puzzles</CardTitle>
            <Puzzle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Completed</span>
                <span className="font-bold">{learningStats.puzzleStats.completed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg. Time</span>
                <span className="text-indigo-600 font-bold">{learningStats.puzzleStats.averageTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Accuracy</span>
                <span className="text-green-600 font-bold">{learningStats.puzzleStats.accuracy}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mind Maps Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mind Maps</CardTitle>
            <Brain className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Created</span>
                <span className="font-bold">{learningStats.mindMapStats.created}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Connections</span>
                <span className="text-violet-600 font-bold">{learningStats.mindMapStats.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Concepts</span>
                <span className="text-purple-600 font-bold">{learningStats.mindMapStats.concepts}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Watched</span>
                <span className="font-bold">{learningStats.videoStats.watched}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Total Minutes</span>
                <span className="text-pink-600 font-bold">{learningStats.videoStats.totalMinutes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Completion</span>
                <span className="text-indigo-600 font-bold">{learningStats.videoStats.completionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
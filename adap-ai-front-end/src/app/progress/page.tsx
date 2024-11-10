'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */
import { Award } from 'lucide-react'
import { BarChart } from 'lucide-react'
import { Calendar } from 'lucide-react'
import { Target } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Activity,
  Brain,
  Clock,
  CreditCard,
  Flame,
  Puzzle,
  Timer,
  Trophy,
  Video
} from 'lucide-react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

export default function Progress() {
  // Mock data for learning analytics
  const learningData = {
    streak: 15,
    totalHours: 42,
    averageDaily: 1.5,
    completionRate: 78,
    totalSessions: 28,
    achievements: 12,
    weeklyProgress: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        label: 'Hours Studied',
        data: [2.5, 1.8, 2.1, 1.5, 2.8, 1.2, 2.0],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
      }]
    },
    methodBreakdown: {
      labels: ['Flashcards', 'Puzzles', 'Mind Maps', 'Videos'],
      datasets: [{
        label: 'Time Spent (hours)',
        data: [15, 10, 8, 9],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(167, 139, 250, 0.8)',
          'rgba(196, 181, 253, 0.8)',
        ],
      }]
    },
    recentAchievements: [
      { id: 1, title: "7-Day Streak", icon: <Flame className="h-5 w-5 text-orange-500" />, date: "2024-03-08" },
      { id: 2, title: "100 Flashcards Mastered", icon: <CreditCard className="h-5 w-5 text-green-500" />, date: "2024-03-07" },
      { id: 3, title: "Mind Map Master", icon: <Brain className="h-5 w-5 text-purple-500" />, date: "2024-03-06" },
      { id: 4, title: "Quick Learner", icon: <Timer className="h-5 w-5 text-blue-500" />, date: "2024-03-05" },
    ],
    methodStats: {
      flashcards: { completed: 250, accuracy: 85, streak: 12 },
      puzzles: { completed: 45, accuracy: 92, avgTime: "4:30" },
      mindMaps: { created: 15, connections: 180, concepts: 95 },
      videos: { watched: 28, totalTime: "12:45", completionRate: 94 }
    }
  }

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Learning Progress</h1>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-orange-100 p-3 rounded-full">
              <Flame className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <h3 className="text-2xl font-bold">{learningData.streak} days</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-blue-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <h3 className="text-2xl font-bold">{learningData.totalHours}h</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Daily Average</p>
              <h3 className="text-2xl font-bold">{learningData.averageDaily}h</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="bg-purple-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Achievements</p>
              <h3 className="text-2xl font-bold">{learningData.achievements}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Line 
              data={learningData.weeklyProgress}
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
            <Bar 
              data={learningData.methodBreakdown}
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

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {learningData.recentAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="flex items-center p-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    {achievement.icon}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{achievement.title}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Method Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold">{learningData.methodStats.flashcards.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Accuracy</span>
              <span className="text-green-600 font-bold">{learningData.methodStats.flashcards.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Best Streak</span>
              <span className="text-orange-600 font-bold">{learningData.methodStats.flashcards.streak}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Word Puzzles</CardTitle>
            <Puzzle className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold">{learningData.methodStats.puzzles.completed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Accuracy</span>
              <span className="text-green-600 font-bold">{learningData.methodStats.puzzles.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avg. Time</span>
              <span className="text-blue-600 font-bold">{learningData.methodStats.puzzles.avgTime}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mind Maps</CardTitle>
            <Brain className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Created</span>
              <span className="font-bold">{learningData.methodStats.mindMaps.created}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Connections</span>
              <span className="text-purple-600 font-bold">{learningData.methodStats.mindMaps.connections}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Concepts</span>
              <span className="text-indigo-600 font-bold">{learningData.methodStats.mindMaps.concepts}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Videos</CardTitle>
            <Video className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Watched</span>
              <span className="font-bold">{learningData.methodStats.videos.watched}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Total Time</span>
              <span className="text-pink-600 font-bold">{learningData.methodStats.videos.totalTime}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Completion</span>
              <span className="text-green-600 font-bold">{learningData.methodStats.videos.completionRate}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
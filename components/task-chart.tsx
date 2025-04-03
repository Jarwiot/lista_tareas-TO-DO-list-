"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

// Language dictionaries for the chart
const translations = {
  en: {
    completed: "Completed",
    pending: "Pending",
  },
  es: {
    completed: "Completadas",
    pending: "Pendientes",
  },
}

interface TaskChartProps {
  completedTasks: number
  pendingTasks: number
  language: "en" | "es"
}

export default function TaskChart({ completedTasks, pendingTasks, language }: TaskChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const t = translations[language]

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: [t.completed, t.pending],
        datasets: [
          {
            data: [completedTasks, pendingTasks],
            backgroundColor: [
              "rgba(72, 187, 120, 0.7)", // green for completed
              "rgba(159, 122, 234, 0.7)", // purple for pending
            ],
            borderColor: ["rgba(72, 187, 120, 1)", "rgba(159, 122, 234, 1)"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
              },
            },
          },
        },
        cutout: "70%",
        animation: {
          animateScale: true,
          animateRotate: true,
        },
      },
    })

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [completedTasks, pendingTasks, language, t])

  // If there are no tasks, show a placeholder message
  if (completedTasks === 0 && pendingTasks === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          {language === "en" ? "Add tasks to see statistics" : "Agrega tareas para ver estadísticas"}
        </p>
      </div>
    )
  }

  return (
    <div className="h-[200px] relative">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}


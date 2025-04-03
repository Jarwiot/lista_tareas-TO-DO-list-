"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Moon, Sun, BarChart } from "lucide-react"
import { useTheme } from "next-themes"
import TaskChart from "@/components/task-chart"

// Language dictionaries
const translations = {
  en: {
    title: "Task List",
    addTask: "Add Task",
    taskPlaceholder: "Enter a new task...",
    deleteTask: "Delete",
    noTasks: "No tasks yet. Add one!",
    language: "Language",
    completed: "completed",
    pending: "pending",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    statistics: "Task Statistics",
    completedTasks: "Completed Tasks",
    pendingTasks: "Pending Tasks",
    totalTasks: "Total Tasks",
    progress: "Progress",
  },
  es: {
    title: "Lista de Tareas",
    addTask: "Agregar Tarea",
    taskPlaceholder: "Ingresa una nueva tarea...",
    deleteTask: "Eliminar",
    noTasks: "No hay tareas aún. ¡Agrega una!",
    language: "Idioma",
    completed: "completada",
    pending: "pendiente",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    statistics: "Estadísticas de Tareas",
    completedTasks: "Tareas Completadas",
    pendingTasks: "Tareas Pendientes",
    totalTasks: "Total de Tareas",
    progress: "Progreso",
  },
}

interface Task {
  id: number
  text: string
  completed: boolean
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [language, setLanguage] = useState<"en" | "es">("en")
  const { theme, setTheme } = useTheme()
  const t = translations[language]

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedLanguage = localStorage.getItem("language")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "es")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
      }
      setTasks([...tasks, newTaskObj])
      setNewTask("")
    }
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const completedTasksCount = tasks.filter((task) => task.completed).length
  const pendingTasksCount = tasks.length - completedTasksCount

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8 px-4 transition-colors duration-200">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Task List Card */}
        <Card className="lg:col-span-2 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-700 dark:to-pink-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold text-white">{t.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="sr-only">{theme === "dark" ? t.lightMode : t.darkMode}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleLanguage}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  {language === "en" ? "Español" : "English"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex gap-2 mb-6">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t.taskPlaceholder}
                className="flex-1 border-2 focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:border-gray-700"
              />
              <Button
                onClick={addTask}
                className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-700 dark:hover:bg-purple-800"
              >
                <Plus className="h-5 w-5 mr-1" />
                {t.addTask}
              </Button>
            </div>

            <div className="space-y-3 mt-4">
              {tasks.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-700">
                  <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">{t.noTasks}</p>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-4 border-l-4 rounded-md shadow-sm transition-all ${
                      task.completed
                        ? "bg-gray-50 dark:bg-gray-800/50 border-green-500"
                        : "bg-white dark:bg-gray-800 border-purple-500"
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        id={`task-${task.id}`}
                        className="border-2 h-5 w-5"
                      />
                      <label
                        htmlFor={`task-${task.id}`}
                        className={`flex-1 ${task.completed ? "line-through text-gray-500 dark:text-gray-400" : "dark:text-gray-200"}`}
                      >
                        {task.text}
                      </label>
                      <Badge
                        variant={task.completed ? "success" : "secondary"}
                        className={
                          task.completed
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                        }
                      >
                        {task.completed ? t.completed : t.pending}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 ml-2"
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">{t.deleteTask}</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <div className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-700 dark:to-cyan-700">
              <CardTitle className="text-xl font-bold text-white">{t.statistics}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <TaskChart completedTasks={completedTasksCount} pendingTasks={pendingTasksCount} language={language} />
              </div>

              <div className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg text-center">
                    <p className="text-green-800 dark:text-green-400 font-medium">{t.completedTasks}</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">{completedTasksCount}</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                    <p className="text-purple-800 dark:text-purple-400 font-medium">{t.pendingTasks}</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">{pendingTasksCount}</p>
                  </div>
                </div>

                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg text-center">
                  <p className="text-blue-800 dark:text-blue-400 font-medium">{t.totalTasks}</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{tasks.length}</p>
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{t.progress}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 h-4 rounded-full transition-all duration-500"
                      style={{ width: tasks.length ? `${(completedTasksCount / tasks.length) * 100}%` : "0%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


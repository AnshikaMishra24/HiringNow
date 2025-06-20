"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Briefcase,
  FileText,
  Upload,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Target,
  Zap,
  Activity,
  Bell,
  Settings,
  Download,
  Share2,
} from "lucide-react"

interface Application {
  id: string
  jobTitle: string
  company: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedDate: string
  logo: string
}

interface SavedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  savedDate: string
  logo: string
}

interface UserProfile {
  name: string
  email: string
  phone: string
  location: string
  title: string
  summary: string
  skills: string[]
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    year: string
  }>
  avatar: string
}

export default function Dashboard() {
  const [user, setUser] = useState<UserProfile>({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Full Stack Developer",
    summary:
      "Experienced developer with 5+ years in React, Node.js, and cloud technologies. Passionate about building scalable applications and leading development teams.",
    skills: ["JavaScript", "React.js", "Node.js", "Python", "AWS", "MongoDB", "TypeScript", "Docker"],
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Tech Solutions Inc.",
        duration: "2021 - Present",
        description:
          "Led development of scalable web applications using React and Node.js. Managed a team of 4 developers and improved system performance by 40%.",
      },
      {
        title: "Full Stack Developer",
        company: "StartupCorp",
        duration: "2019 - 2021",
        description:
          "Developed and maintained multiple client projects using MERN stack. Implemented CI/CD pipelines and reduced deployment time by 60%.",
      },
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        school: "University of California",
        year: "2019",
      },
    ],
    avatar: "/placeholder.svg?height=150&width=150",
  })

  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      jobTitle: "Senior Full Stack Developer",
      company: "TechCorp Inc.",
      status: "pending",
      appliedDate: "2024-01-15",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      jobTitle: "Lead Developer",
      company: "InnovateCorp",
      status: "reviewed",
      appliedDate: "2024-01-12",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "3",
      jobTitle: "Software Architect",
      company: "CloudTech Solutions",
      status: "accepted",
      appliedDate: "2024-01-10",
      logo: "/placeholder.svg?height=50&width=50",
    },
  ])

  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([
    {
      id: "1",
      title: "Product Manager",
      company: "StartupHub",
      location: "Remote",
      salary: "$120,000 - $160,000",
      savedDate: "2024-01-14",
      logo: "/placeholder.svg?height=50&width=50",
    },
    {
      id: "2",
      title: "DevOps Engineer",
      company: "CloudFirst",
      location: "Austin, TX",
      salary: "$110,000 - $150,000",
      savedDate: "2024-01-13",
      logo: "/placeholder.svg?height=50&width=50",
    },
  ])

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isParsingResume, setIsParsingResume] = useState(false)
  const [parseProgress, setParseProgress] = useState(0)

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter((app) => app.status === "pending").length,
    acceptedApplications: applications.filter((app) => app.status === "accepted").length,
    profileViews: 234,
    savedJobs: savedJobs.length,
    profileCompletion: 85,
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setResumeFile(file)
    setIsParsingResume(true)
    setParseProgress(0)

    // Simulate parsing progress
    const interval = setInterval(() => {
      setParseProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsParsingResume(false)
          return 100
        }
        return prev + 10
      })
    }, 200)

    try {
      const formData = new FormData()
      formData.append("resume", file)

      const response = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        // Update user profile with parsed data
        setUser((prev) => ({
          ...prev,
          name: data.data.name || prev.name,
          email: data.data.email || prev.email,
          phone: data.data.phone || prev.phone,
          location: data.data.location || prev.location,
          summary: data.data.summary || prev.summary,
          skills: data.data.skills || prev.skills,
          experience: data.data.experience || prev.experience,
          education: data.data.education || prev.education,
        }))
      }
    } catch (error) {
      console.error("Resume parsing error:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
      case "reviewed":
        return "bg-blue-500/20 text-blue-300 border-blue-400/40"
      case "accepted":
        return "bg-green-500/20 text-green-300 border-green-400/40"
      case "rejected":
        return "bg-red-500/20 text-red-300 border-red-400/40"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-400/40"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "reviewed":
        return <Eye className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 relative overflow-hidden">
      {/* 3D Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-sm text-purple-200">Manage your job search</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-400"
                />
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-purple-200">{user.title}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Total Applications</p>
                  <p className="text-3xl font-bold text-white">{stats.totalApplications}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Pending</p>
                  <p className="text-3xl font-bold text-white">{stats.pendingApplications}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Accepted</p>
                  <p className="text-3xl font-bold text-white">{stats.acceptedApplications}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Profile Views</p>
                  <p className="text-3xl font-bold text-white">{stats.profileViews}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-xl">
                  <Eye className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Saved Jobs</p>
                  <p className="text-3xl font-bold text-white">{stats.savedJobs}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">Profile Complete</p>
                  <p className="text-3xl font-bold text-white">{stats.profileCompletion}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-2xl border border-white/20 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              Applications
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Saved Jobs
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
            <TabsTrigger value="resume" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Resume
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-purple-400" />
                    Recent Applications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300"
                    >
                      <img src={app.logo || "/placeholder.svg"} alt={app.company} className="w-12 h-12 rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{app.jobTitle}</h4>
                        <p className="text-sm text-purple-200">{app.company}</p>
                        <p className="text-xs text-purple-300">{new Date(app.appliedDate).toLocaleDateString()}</p>
                      </div>
                      <Badge className={`${getStatusColor(app.status)} backdrop-blur-sm`}>
                        {getStatusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Profile Completion */}
              <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center">
                    <Target className="w-5 h-5 mr-2 text-green-400" />
                    Profile Completion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-200">Overall Progress</span>
                      <span className="text-white font-semibold">{stats.profileCompletion}%</span>
                    </div>
                    <Progress value={stats.profileCompletion} className="h-3 bg-white/10" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">Basic Information</span>
                      </div>
                      <span className="text-xs text-green-400">Complete</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">Work Experience</span>
                      </div>
                      <span className="text-xs text-green-400">Complete</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white">Skills Assessment</span>
                      </div>
                      <span className="text-xs text-yellow-400">Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Briefcase className="w-6 h-6 mr-3 text-purple-400" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={app.logo || "/placeholder.svg"} alt={app.company} className="w-16 h-16 rounded-xl" />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{app.jobTitle}</h4>
                          <p className="text-purple-200">{app.company}</p>
                          <p className="text-sm text-purple-300">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getStatusColor(app.status)} backdrop-blur-sm px-3 py-2`}>
                          {getStatusIcon(app.status)}
                          <span className="ml-2 capitalize">{app.status}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <Star className="w-6 h-6 mr-3 text-yellow-400" />
                  Saved Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center space-x-4">
                        <img src={job.logo || "/placeholder.svg"} alt={job.company} className="w-16 h-16 rounded-xl" />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{job.title}</h4>
                          <p className="text-purple-200">{job.company}</p>
                          <p className="text-sm text-purple-300">
                            {job.location} • {job.salary}
                          </p>
                          <p className="text-xs text-purple-300">
                            Saved on {new Date(job.savedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          Apply Now
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <User className="w-6 h-6 mr-3 text-blue-400" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Full Name</label>
                      <Input
                        value={user.name}
                        onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
                      <Input
                        value={user.email}
                        onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Phone</label>
                      <Input
                        value={user.phone}
                        onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Location</label>
                      <Input
                        value={user.location}
                        onChange={(e) => setUser((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Professional Title</label>
                      <Input
                        value={user.title}
                        onChange={(e) => setUser((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Professional Summary</label>
                      <textarea
                        value={user.summary}
                        onChange={(e) => setUser((prev) => ({ ...prev, summary: e.target.value }))}
                        rows={4}
                        className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">Skills</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {user.skills.map((skill, index) => (
                          <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-400/40">
                            {skill}
                            <button
                              onClick={() =>
                                setUser((prev) => ({
                                  ...prev,
                                  skills: prev.skills.filter((_, i) => i !== index),
                                }))
                              }
                              className="ml-2 text-purple-300 hover:text-white"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add a skill and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const skill = e.currentTarget.value.trim()
                            if (skill && !user.skills.includes(skill)) {
                              setUser((prev) => ({ ...prev, skills: [...prev.skills, skill] }))
                              e.currentTarget.value = ""
                            }
                          }
                        }}
                        className="bg-white/10 border-white/20 text-white placeholder-purple-300"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resume" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-white flex items-center">
                  <FileText className="w-6 h-6 mr-3 text-green-400" />
                  Resume Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resume Upload */}
                <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Upload Your Resume</h3>
                      <p className="text-purple-200 mb-4">
                        Upload your resume and our AI will automatically parse and extract your information
                      </p>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                        id="resume-upload"
                      />
                      <label htmlFor="resume-upload">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white cursor-pointer">
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Resume Parsing Progress */}
                {isParsingResume && (
                  <Card className="bg-blue-500/20 border border-blue-400/40">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                          <span className="text-blue-300 font-medium">Parsing your resume...</span>
                        </div>
                        <Progress value={parseProgress} className="h-2 bg-blue-900/30" />
                        <p className="text-sm text-blue-200">
                          Our AI is extracting your professional information. This may take a few moments.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current Resume */}
                {resumeFile && (
                  <Card className="bg-green-500/20 border border-green-400/40">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-500 rounded-lg">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{resumeFile.name}</h4>
                            <p className="text-sm text-green-200">
                              Uploaded • {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-500/20 border-red-400/40 text-red-300 hover:bg-red-500/30"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Resume Tips */}
                <Card className="bg-yellow-500/20 border border-yellow-400/40">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-yellow-300 mb-3 flex items-center">
                      <Zap className="w-5 h-5 mr-2" />
                      Resume Optimization Tips
                    </h4>
                    <ul className="space-y-2 text-yellow-200 text-sm">
                      <li>• Use action verbs to describe your achievements</li>
                      <li>• Quantify your accomplishments with numbers and percentages</li>
                      <li>• Tailor your resume for each job application</li>
                      <li>• Keep your resume to 1-2 pages maximum</li>
                      <li>• Use a clean, professional format</li>
                    </ul>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <style jsx>{`
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        .animate-tilt { animation: tilt 10s infinite linear; }
      `}</style>
    </div>
  )
}

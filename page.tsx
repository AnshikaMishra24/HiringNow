"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Users,
  TrendingUp,
  Star,
  Bell,
  DollarSign,
  Send,
  CheckCircle,
  Building2,
  BarChart3,
  Database,
  Rocket,
  ArrowRight,
  Globe,
  Cpu,
  FileText,
  UserPlus,
  Eye,
  Zap,
  Network,
  MapPinIcon,
  CalendarIcon,
  Bookmark,
  Filter,
  SortDesc,
  ExternalLink,
} from "lucide-react"

interface Job {
  id: string
  title: string
  company: string
  location: string
  type: "full-time" | "part-time" | "contract" | "remote"
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  postedDate: string
  deadline: string
  category: string
  experience: string
  logo: string
  featured: boolean
  applicants: number
  trending?: boolean
  urgent?: boolean
  premium?: boolean
  companySize: string
  industry: string
  workMode: "onsite" | "remote" | "hybrid"
  applyUrl?: string
  isLive?: boolean
}

interface Company {
  id: string
  name: string
  logo: string
  industry: string
  size: string
  location: string
  founded: string
  website: string
  description: string
  employees: string
  rating: number
  reviews: number
  jobs: number
  followers: number
  isFollowing: boolean
  verified: boolean
  headquarters: string
  specialties: string[]
  recentNews?: string
}

interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "recruiter"
  avatar: string
  company?: string
  connections?: number
  profile?: {
    headline: string
    location: string
    experience: string
    skills: string[]
  }
}

export default function HiringNowJobPortal() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"jobs" | "companies">("jobs")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  // Real Indian Companies Data
  const indianCompanies: Company[] = [
    {
      id: "1",
      name: "Tata Consultancy Services",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Information Technology",
      size: "500,000+ employees",
      location: "Mumbai, Maharashtra",
      founded: "1968",
      website: "https://www.tcs.com",
      description: "Leading global IT services, consulting and business solutions organization",
      employees: "500,000+",
      rating: 4.1,
      reviews: 89000,
      jobs: 2847,
      followers: 2800000,
      isFollowing: false,
      verified: true,
      headquarters: "Mumbai, India",
      specialties: ["IT Services", "Consulting", "Digital Transformation", "Cloud Computing"],
      recentNews: "TCS announces major AI initiative for enterprise clients",
    },
    {
      id: "2",
      name: "Infosys",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Information Technology",
      size: "250,000+ employees",
      location: "Bengaluru, Karnataka",
      founded: "1981",
      website: "https://www.infosys.com",
      description: "Global leader in next-generation digital services and consulting",
      employees: "250,000+",
      rating: 4.0,
      reviews: 67000,
      jobs: 1923,
      followers: 2100000,
      isFollowing: true,
      verified: true,
      headquarters: "Bengaluru, India",
      specialties: ["Digital Services", "Consulting", "Engineering Services", "AI & Automation"],
      recentNews: "Infosys partners with Microsoft for cloud transformation",
    },
    {
      id: "3",
      name: "Wipro",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Information Technology",
      size: "200,000+ employees",
      location: "Bengaluru, Karnataka",
      founded: "1945",
      website: "https://www.wipro.com",
      description: "Leading technology services and consulting company",
      employees: "200,000+",
      rating: 3.9,
      reviews: 54000,
      jobs: 1456,
      followers: 1800000,
      isFollowing: false,
      verified: true,
      headquarters: "Bengaluru, India",
      specialties: ["IT Services", "Digital Solutions", "Cybersecurity", "Cloud Services"],
      recentNews: "Wipro acquires UK-based consulting firm",
    },
    {
      id: "4",
      name: "HCL Technologies",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Information Technology",
      size: "150,000+ employees",
      location: "Noida, Uttar Pradesh",
      founded: "1976",
      website: "https://www.hcltech.com",
      description: "Leading global technology company helping enterprises reimagine their businesses",
      employees: "150,000+",
      rating: 4.2,
      reviews: 42000,
      jobs: 1234,
      followers: 1500000,
      isFollowing: true,
      verified: true,
      headquarters: "Noida, India",
      specialties: ["Digital Transformation", "Engineering Services", "Cloud Native", "Cybersecurity"],
      recentNews: "HCL launches new AI-powered platform",
    },
    {
      id: "5",
      name: "Tech Mahindra",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Information Technology",
      size: "125,000+ employees",
      location: "Pune, Maharashtra",
      founded: "1986",
      website: "https://www.techmahindra.com",
      description: "Leading provider of digital transformation, consulting and business re-engineering services",
      employees: "125,000+",
      rating: 3.8,
      reviews: 38000,
      jobs: 987,
      followers: 1200000,
      isFollowing: false,
      verified: true,
      headquarters: "Pune, India",
      specialties: ["5G Solutions", "Digital Services", "Network Services", "Cybersecurity"],
      recentNews: "Tech Mahindra announces 5G innovation lab",
    },
    {
      id: "6",
      name: "Flipkart",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "E-commerce",
      size: "50,000+ employees",
      location: "Bengaluru, Karnataka",
      founded: "2007",
      website: "https://www.flipkart.com",
      description: "India's leading e-commerce marketplace",
      employees: "50,000+",
      rating: 4.3,
      reviews: 25000,
      jobs: 567,
      followers: 3500000,
      isFollowing: true,
      verified: true,
      headquarters: "Bengaluru, India",
      specialties: ["E-commerce", "Technology", "Logistics", "Fintech"],
      recentNews: "Flipkart expands grocery delivery to 1000+ cities",
    },
    {
      id: "7",
      name: "Zomato",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Food Technology",
      size: "5,000+ employees",
      location: "Gurugram, Haryana",
      founded: "2008",
      website: "https://www.zomato.com",
      description: "Leading food delivery and restaurant discovery platform",
      employees: "5,000+",
      rating: 4.1,
      reviews: 12000,
      jobs: 234,
      followers: 2800000,
      isFollowing: false,
      verified: true,
      headquarters: "Gurugram, India",
      specialties: ["Food Delivery", "Restaurant Technology", "Logistics", "Payments"],
      recentNews: "Zomato launches instant grocery delivery service",
    },
    {
      id: "8",
      name: "Paytm",
      logo: "/placeholder.svg?height=80&width=80",
      industry: "Fintech",
      size: "10,000+ employees",
      location: "Noida, Uttar Pradesh",
      founded: "2010",
      website: "https://paytm.com",
      description: "India's leading digital payments and financial services company",
      employees: "10,000+",
      rating: 3.9,
      reviews: 18000,
      jobs: 345,
      followers: 4200000,
      isFollowing: true,
      verified: true,
      headquarters: "Noida, India",
      specialties: ["Digital Payments", "Financial Services", "E-commerce", "Banking"],
      recentNews: "Paytm launches new UPI features for merchants",
    },
  ]

  // Real Job Categories with Indian market focus
  const categories = [
    {
      name: "Technology",
      icon: <Cpu className="w-6 h-6" />,
      count: 15420,
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      description: "Software, AI, Cloud, DevOps",
    },
    {
      name: "Finance",
      icon: <BarChart3 className="w-6 h-6" />,
      count: 8934,
      color: "from-emerald-500 to-teal-500",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      description: "Banking, Fintech, Investment",
    },
    {
      name: "Consulting",
      icon: <Building2 className="w-6 h-6" />,
      count: 6789,
      color: "from-slate-500 to-gray-500",
      bgColor: "from-slate-500/10 to-gray-500/10",
      description: "Strategy, Management, Operations",
    },
    {
      name: "Data Science",
      icon: <Database className="w-6 h-6" />,
      count: 4567,
      color: "from-orange-500 to-amber-500",
      bgColor: "from-orange-500/10 to-amber-500/10",
      description: "Analytics, ML, AI, Research",
    },
    {
      name: "Product",
      icon: <Rocket className="w-6 h-6" />,
      count: 3456,
      color: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-500/10 to-blue-500/10",
      description: "Strategy, Design, Innovation",
    },
    {
      name: "Sales & Marketing",
      icon: <TrendingUp className="w-6 h-6" />,
      count: 7890,
      color: "from-rose-500 to-pink-500",
      bgColor: "from-rose-500/10 to-pink-500/10",
      description: "Digital Marketing, Sales, Growth",
    },
  ]

  const jobTypes = [
    { value: "full-time", label: "Full Time", count: 28456, icon: <Briefcase className="w-4 h-4" /> },
    { value: "part-time", label: "Part Time", count: 5623, icon: <Clock className="w-4 h-4" /> },
    { value: "contract", label: "Contract", count: 8934, icon: <FileText className="w-4 h-4" /> },
    { value: "remote", label: "Remote", count: 12345, icon: <Globe className="w-4 h-4" /> },
  ]

  const trendingSkills = [
    { name: "React.js", demand: 95, growth: "+23%", salary: "₹8-15 LPA" },
    { name: "Python", demand: 92, growth: "+18%", salary: "₹6-12 LPA" },
    { name: "Node.js", demand: 88, growth: "+31%", salary: "₹7-14 LPA" },
    { name: "AWS", demand: 85, growth: "+27%", salary: "₹9-18 LPA" },
    { name: "Data Science", demand: 82, growth: "+15%", salary: "₹8-20 LPA" },
    { name: "DevOps", demand: 78, growth: "+22%", salary: "₹10-22 LPA" },
  ]

  // Simulated live jobs from Indian companies
  const liveJobs: Job[] = [
    {
      id: "live-1",
      title: "Senior Software Engineer - Full Stack",
      company: "Tata Consultancy Services",
      location: "Bengaluru, Karnataka",
      type: "full-time",
      salary: "₹12-18 LPA",
      description:
        "Join our digital transformation team to build next-generation applications using React, Node.js, and cloud technologies. Work with global clients on cutting-edge projects.",
      requirements: ["5+ years experience", "React.js", "Node.js", "AWS", "TypeScript", "Microservices"],
      benefits: ["Health Insurance", "Flexible Work", "Learning Budget", "Stock Options", "Relocation Support"],
      postedDate: "2024-01-20",
      deadline: "2024-02-20",
      category: "Technology",
      experience: "Senior",
      logo: "/placeholder.svg?height=80&width=80",
      featured: true,
      applicants: 234,
      trending: true,
      companySize: "500,000+",
      industry: "IT Services",
      workMode: "hybrid",
      applyUrl: "https://careers.tcs.com/apply/senior-software-engineer",
      isLive: true,
    },
    {
      id: "live-2",
      title: "Product Manager - Fintech",
      company: "Paytm",
      location: "Noida, Uttar Pradesh",
      type: "full-time",
      salary: "₹25-35 LPA",
      description:
        "Lead product strategy for our digital payments platform. Drive innovation in financial services and work with cross-functional teams to deliver exceptional user experiences.",
      requirements: [
        "MBA/Engineering",
        "5+ years PM experience",
        "Fintech knowledge",
        "Data Analytics",
        "User Research",
      ],
      benefits: ["Stock Options", "Health Insurance", "Flexible Hours", "Learning Budget", "Team Outings"],
      postedDate: "2024-01-19",
      deadline: "2024-02-15",
      category: "Product",
      experience: "Senior",
      logo: "/placeholder.svg?height=80&width=80",
      featured: true,
      applicants: 156,
      urgent: true,
      companySize: "10,000+",
      industry: "Fintech",
      workMode: "hybrid",
      applyUrl: "https://careers.paytm.com/apply/product-manager",
      isLive: true,
    },
    {
      id: "live-3",
      title: "Data Scientist - Machine Learning",
      company: "Flipkart",
      location: "Bengaluru, Karnataka",
      type: "full-time",
      salary: "₹15-25 LPA",
      description:
        "Build ML models to enhance customer experience and optimize our recommendation systems. Work with large-scale data to drive business insights.",
      requirements: ["MS/PhD in relevant field", "Python/R", "Machine Learning", "Deep Learning", "SQL", "Statistics"],
      benefits: ["Stock Options", "Health Coverage", "Learning Budget", "Flexible Work", "Innovation Time"],
      postedDate: "2024-01-18",
      deadline: "2024-02-25",
      category: "Data Science",
      experience: "Mid-Senior",
      logo: "/placeholder.svg?height=80&width=80",
      featured: false,
      applicants: 189,
      trending: true,
      companySize: "50,000+",
      industry: "E-commerce",
      workMode: "hybrid",
      applyUrl: "https://careers.flipkart.com/apply/data-scientist",
      isLive: true,
    },
    {
      id: "live-4",
      title: "Frontend Developer - React",
      company: "Zomato",
      location: "Gurugram, Haryana",
      type: "full-time",
      salary: "₹8-14 LPA",
      description:
        "Create amazing user interfaces for our food delivery platform. Work on mobile-first designs and optimize for performance at scale.",
      requirements: [
        "3+ years experience",
        "React.js",
        "JavaScript",
        "CSS",
        "Mobile-first design",
        "Performance optimization",
      ],
      benefits: ["Food Allowance", "Health Insurance", "Flexible Hours", "Learning Budget", "Team Events"],
      postedDate: "2024-01-17",
      deadline: "2024-02-10",
      category: "Technology",
      experience: "Mid-level",
      logo: "/placeholder.svg?height=80&width=80",
      featured: false,
      applicants: 298,
      companySize: "5,000+",
      industry: "Food Tech",
      workMode: "hybrid",
      applyUrl: "https://careers.zomato.com/apply/frontend-developer",
      isLive: true,
    },
    {
      id: "live-5",
      title: "DevOps Engineer - Cloud Infrastructure",
      company: "HCL Technologies",
      location: "Chennai, Tamil Nadu",
      type: "full-time",
      salary: "₹10-16 LPA",
      description:
        "Manage cloud infrastructure and CI/CD pipelines for enterprise clients. Work with cutting-edge DevOps tools and practices.",
      requirements: ["4+ years experience", "AWS/Azure", "Docker", "Kubernetes", "CI/CD", "Infrastructure as Code"],
      benefits: ["Health Insurance", "Certification Support", "Flexible Work", "Career Growth", "Global Exposure"],
      postedDate: "2024-01-16",
      deadline: "2024-02-18",
      category: "Technology",
      experience: "Mid-Senior",
      logo: "/placeholder.svg?height=80&width=80",
      featured: true,
      applicants: 167,
      companySize: "150,000+",
      industry: "IT Services",
      workMode: "remote",
      applyUrl: "https://careers.hcltech.com/apply/devops-engineer",
      isLive: true,
    },
  ]

  useEffect(() => {
    // Initialize with live jobs and companies
    setJobs(liveJobs)
    setCompanies(indianCompanies)

    // Check for existing auth token
    const token = localStorage.getItem("token")
    if (token) {
      setUser({
        id: "1",
        name: "Rahul Sharma",
        email: "rahul.sharma@example.com",
        role: "candidate",
        avatar: "/placeholder.svg?height=100&width=100",
        connections: 847,
        profile: {
          headline: "Senior Software Engineer at Tech Mahindra",
          location: "Bengaluru, Karnataka",
          experience: "5+ years",
          skills: ["React.js", "Node.js", "AWS", "Python", "MongoDB"],
        },
      })
    }

    // Mouse tracking for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Scroll tracking for parallax effects
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    filterJobs()
  }, [jobs, searchTerm, locationFilter, typeFilter, categoryFilter])

  const filterJobs = () => {
    let filtered = jobs

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (locationFilter) {
      filtered = filtered.filter((job) => job.location.toLowerCase().includes(locationFilter.toLowerCase()))
    }

    if (typeFilter) {
      filtered = filtered.filter((job) => job.type === typeFilter)
    }

    if (categoryFilter) {
      filtered = filtered.filter((job) => job.category === categoryFilter)
    }

    setFilteredJobs(filtered)
  }

  const handleAuth = async (formData: any) => {
    setIsLoading(true)
    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (data.success) {
        localStorage.setItem("token", data.token)
        setUser(data.user)
        setShowAuthModal(false)
      }
    } catch (error) {
      console.error("Auth error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleJobApplication = async (job: Job) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (job.isLive && job.applyUrl) {
      // Open external application URL for live jobs
      window.open(job.applyUrl, "_blank")
    } else {
      // Handle internal application
      try {
        const response = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: job.id,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            resume: "resume-url",
            coverLetter: "Cover letter content",
          }),
        })

        const data = await response.json()
        if (data.success) {
          alert("Application submitted successfully!")
        }
      } catch (error) {
        console.error("Application error:", error)
      }
    }
  }

  const handleFollowCompany = (companyId: string) => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === companyId
          ? {
              ...company,
              isFollowing: !company.isFollowing,
              followers: company.isFollowing ? company.followers - 1 : company.followers + 1,
            }
          : company,
      ),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Sophisticated Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Gradient Orbs */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 animate-pulse-slow"
          style={{
            background: `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)`,
            left: `${mousePosition.x * 0.01}px`,
            top: `${mousePosition.y * 0.01 - scrollY * 0.05}px`,
            transform: `translate(-50%, -50%) scale(${1 + Math.sin(Date.now() * 0.001) * 0.05})`,
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 animate-pulse-slow delay-1000"
          style={{
            background: `radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(59, 130, 246, 0.1) 50%, transparent 70%)`,
            right: `${mousePosition.x * 0.008}px`,
            top: `${mousePosition.y * 0.008 - scrollY * 0.03}px`,
            transform: `translate(50%, -50%) scale(${1 + Math.cos(Date.now() * 0.0012) * 0.08})`,
          }}
        />

        {/* Floating Geometric Elements */}
        <div className="absolute top-20 left-20 w-24 h-24 border border-blue-200/30 rotate-45 animate-spin-ultra-slow"></div>
        <div className="absolute top-40 right-32 w-16 h-16 border border-teal-200/30 rotate-12 animate-bounce-ultra-slow"></div>
        <div className="absolute bottom-40 left-40 w-12 h-12 bg-gradient-to-r from-blue-200/20 to-teal-200/20 rounded-full animate-float-slow"></div>

        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-glow"></div>
      </div>

      {/* Professional Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-white/30 to-teal-50/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl shadow-lg transform group-hover:scale-105 transition-all duration-300">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  CareerConnect
                </h1>
                <p className="text-sm text-gray-600 font-medium">Professional Network & Jobs</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              {["Jobs", "Companies", "Network", "Learning"].map((item, index) => (
                <a
                  key={item}
                  href="#"
                  className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 group font-medium"
                >
                  <span className="relative z-10">{item}</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 group-hover:w-full transition-all duration-300"></div>
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    className="bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 transition-all duration-300"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Notifications</span>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  </Button>
                  <div className="flex items-center space-x-3 p-2 rounded-xl bg-white/70 border border-gray-200 hover:bg-white transition-all duration-300">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-9 h-9 rounded-full border-2 border-blue-200"
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.connections} connections</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    className="bg-white/70 border-gray-200 text-gray-700 hover:bg-white hover:border-blue-300 transition-all duration-300"
                    onClick={() => {
                      setAuthMode("login")
                      setShowAuthModal(true)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setAuthMode("register")
                      setShowAuthModal(true)
                    }}
                  >
                    Join Now
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div ref={heroRef} className="text-center mb-16 relative">
          <div className="relative space-y-8">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-teal-100 border border-blue-200/50 mb-8">
              <Network className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Connect. Discover. Grow.</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-6xl md:text-7xl font-black text-gray-800 mb-6 leading-tight">
              Your Professional{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Network</span>
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Awaits
              </span>
            </h2>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Connect with India's top companies and professionals. Discover opportunities that{" "}
              <span className="text-blue-600 font-semibold">accelerate careers</span> and{" "}
              <span className="text-teal-600 font-semibold">build networks</span>.
            </p>

            {/* Advanced Search Bar */}
            <div className="max-w-5xl mx-auto mb-12">
              <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-teal-50/50"></div>
                <CardContent className="p-6 relative">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Job title, skills, or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-12 bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Location"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="pl-12 h-12 bg-white/80 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:ring-blue-400 rounded-xl"
                      />
                    </div>
                    <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl">
                      <Search className="w-5 h-5 mr-2" />
                      Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trending Skills */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200/50 p-4">
              <div className="flex items-center space-x-4 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Trending in India</span>
              </div>
              <div className="flex animate-scroll-left space-x-4">
                {[...trendingSkills, ...trendingSkills].map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 bg-white/80 rounded-full px-4 py-2 whitespace-nowrap border border-gray-200/50"
                  >
                    <span className="text-gray-700 font-medium">{skill.name}</span>
                    <Badge className="bg-green-100 text-green-700 text-xs">{skill.growth}</Badge>
                    <span className="text-xs text-gray-500">{skill.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="mb-8">
          <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl p-1 w-fit">
            <Button
              variant={activeTab === "jobs" ? "default" : "ghost"}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "jobs"
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("jobs")}
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs ({filteredJobs.length})
            </Button>
            <Button
              variant={activeTab === "companies" ? "default" : "ghost"}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === "companies"
                  ? "bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("companies")}
            >
              <Building2 className="w-4 h-4 mr-2" />
              Companies ({companies.length})
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Categories */}
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-3 text-blue-600" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      categoryFilter === category.name
                        ? `bg-gradient-to-r ${category.bgColor} border border-blue-200`
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setCategoryFilter(categoryFilter === category.name ? "" : category.name)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-gradient-to-r ${category.color} rounded-lg text-white`}>
                          {category.icon}
                        </div>
                        <div>
                          <span className="text-gray-800 font-medium">{category.name}</span>
                          <p className="text-gray-500 text-xs">{category.description}</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">{category.count.toLocaleString()}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Job Types */}
            <Card className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <Clock className="w-5 h-5 mr-3 text-teal-600" />
                  Work Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {jobTypes.map((type, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      typeFilter === type.value
                        ? "bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setTypeFilter(typeFilter === type.value ? "" : type.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg text-white">
                          {type.icon}
                        </div>
                        <span className="text-gray-800 font-medium">{type.label}</span>
                      </div>
                      <Badge className="bg-teal-100 text-teal-700">{type.count.toLocaleString()}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "jobs" ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{filteredJobs.length} Live Opportunities</h3>
                    <p className="text-gray-600">From India's leading companies</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-green-100 text-green-700 px-3 py-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Live Jobs
                    </Badge>
                    <Button variant="outline" className="bg-white/80 border-gray-200">
                      <SortDesc className="w-4 h-4 mr-2" />
                      Sort
                    </Button>
                  </div>
                </div>

                {/* Job Listings */}
                <div className="space-y-6">
                  {filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                      onClick={() => setSelectedJob(job)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Job Badges */}
                      <div className="absolute top-4 right-4 flex space-x-2 z-10">
                        {job.isLive && (
                          <Badge className="bg-green-100 text-green-700 animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                            Live
                          </Badge>
                        )}
                        {job.featured && (
                          <Badge className="bg-amber-100 text-amber-700">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                        {job.trending && (
                          <Badge className="bg-red-100 text-red-700">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Trending
                          </Badge>
                        )}
                        {job.urgent && (
                          <Badge className="bg-orange-100 text-orange-700 animate-bounce">
                            <Zap className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-6 relative">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <img
                              src={job.logo || "/placeholder.svg"}
                              alt={job.company}
                              className="w-16 h-16 rounded-xl border border-gray-200 shadow-sm"
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                                {job.title}
                              </h4>
                              <p className="text-lg text-gray-600 font-medium">{job.company}</p>
                            </div>

                            <div className="flex items-center space-x-4 text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-4 h-4" />
                                <span className="capitalize">{job.type.replace("-", " ")}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold text-green-600">{job.salary}</span>
                              </div>
                            </div>

                            <p className="text-gray-600 line-clamp-2">{job.description}</p>

                            <div className="flex flex-wrap gap-2">
                              {job.requirements.slice(0, 4).map((req, index) => (
                                <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 4 && (
                                <Badge className="bg-gray-100 text-gray-600">+{job.requirements.length - 4} more</Badge>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-3">
                              <div className="flex items-center space-x-4 text-gray-500 text-sm">
                                <div className="flex items-center space-x-1">
                                  <Users className="w-4 h-4" />
                                  <span>{job.applicants} applicants</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <CalendarIcon className="w-4 h-4" />
                                  <span>{new Date(job.postedDate).toLocaleDateString()}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-white/80 border-gray-200 hover:bg-gray-50"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Bookmark className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleJobApplication(job)
                                  }}
                                >
                                  {job.isLive ? (
                                    <>
                                      <ExternalLink className="w-4 h-4 mr-1" />
                                      Apply Now
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4 mr-1" />
                                      Apply
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              /* Companies Tab */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">{companies.length} Top Companies</h3>
                    <p className="text-gray-600">India's leading employers</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {companies.map((company) => (
                    <Card
                      key={company.id}
                      className="bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer relative overflow-hidden group"
                      onClick={() => setSelectedCompany(company)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-teal-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardContent className="p-6 relative">
                        <div className="flex items-start space-x-4">
                          <div className="relative">
                            <img
                              src={company.logo || "/placeholder.svg"}
                              alt={company.name}
                              className="w-16 h-16 rounded-xl border border-gray-200 shadow-sm"
                            />
                            {company.verified && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-3">
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{company.name}</h4>
                              <p className="text-gray-600">{company.industry}</p>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{company.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{company.size}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="font-medium">{company.rating}</span>
                                <span className="text-gray-500">({company.reviews.toLocaleString()} reviews)</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{company.jobs} open positions</span>
                              <span>•</span>
                              <span>{company.followers.toLocaleString()} followers</span>
                            </div>

                            <div className="flex items-center justify-between pt-3">
                              <div className="flex flex-wrap gap-2">
                                {company.specialties.slice(0, 2).map((specialty, index) => (
                                  <Badge key={index} className="bg-gray-100 text-gray-600 text-xs">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`transition-all duration-300 ${
                                    company.isFollowing
                                      ? "bg-blue-50 border-blue-200 text-blue-700"
                                      : "bg-white/80 border-gray-200 hover:bg-gray-50"
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleFollowCompany(company.id)
                                  }}
                                >
                                  <UserPlus className="w-4 h-4 mr-1" />
                                  {company.isFollowing ? "Following" : "Follow"}
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // View jobs at this company
                                    setCategoryFilter("")
                                    setSearchTerm(company.name)
                                    setActiveTab("jobs")
                                  }}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Jobs
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <Card className="bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800 text-center">
                {authMode === "login" ? "Welcome Back" : "Join CareerConnect"}
              </CardTitle>
              <p className="text-gray-600 text-center">
                {authMode === "login" ? "Continue your professional journey" : "Start building your network"}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const data = Object.fromEntries(formData.entries())
                  handleAuth(data)
                }}
              >
                {authMode === "register" && (
                  <Input
                    name="name"
                    placeholder="Full Name"
                    required
                    className="h-12 bg-white/80 border-gray-200 rounded-xl"
                  />
                )}
                <Input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="h-12 bg-white/80 border-gray-200 rounded-xl"
                />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="h-12 bg-white/80 border-gray-200 rounded-xl"
                />
                {authMode === "register" && (
                  <>
                    <select
                      name="role"
                      required
                      className="w-full h-12 p-3 rounded-xl bg-white/80 border border-gray-200 text-gray-800"
                    >
                      <option value="candidate">Job Seeker</option>
                      <option value="recruiter">Recruiter</option>
                    </select>
                    <Input
                      name="company"
                      placeholder="Company (for recruiters)"
                      className="h-12 bg-white/80 border-gray-200 rounded-xl"
                    />
                  </>
                )}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl"
                >
                  {isLoading ? "Processing..." : authMode === "login" ? "Sign In" : "Create Account"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </form>
              <div className="text-center">
                <button
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                >
                  {authMode === "login" ? "Don't have an account? Join now" : "Already have an account? Sign in"}
                </button>
              </div>
              <Button
                variant="outline"
                className="w-full h-12 bg-white/80 border-gray-200 rounded-xl"
                onClick={() => setShowAuthModal(false)}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <Card className="bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-gray-200/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedJob.logo || "/placeholder.svg"}
                    alt={selectedJob.company}
                    className="w-20 h-20 rounded-xl border border-gray-200"
                  />
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-gray-800">{selectedJob.title}</h3>
                    <p className="text-xl text-gray-600 font-medium">{selectedJob.company}</p>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{selectedJob.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span className="capitalize">{selectedJob.type.replace("-", " ")}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-semibold text-green-600">{selectedJob.salary}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {selectedJob.isLive && (
                        <Badge className="bg-green-100 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          Live Job
                        </Badge>
                      )}
                      {selectedJob.featured && (
                        <Badge className="bg-amber-100 text-amber-700">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="bg-white/80 border-gray-200" onClick={() => setSelectedJob(null)}>
                  ✕
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="max-h-[60vh]">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Job Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    Requirements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedJob.requirements.map((req, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Benefits & Perks
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedJob.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50">
                        <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{selectedJob.applicants} applicants</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Deadline: {new Date(selectedJob.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="bg-white/80 border-gray-200">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save Job
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6"
                      onClick={() => handleJobApplication(selectedJob)}
                    >
                      {selectedJob.isLive ? (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Apply on Company Site
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}

      {/* Company Detail Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4">
          <Card className="bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-gray-200/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <img
                    src={selectedCompany.logo || "/placeholder.svg"}
                    alt={selectedCompany.name}
                    className="w-20 h-20 rounded-xl border border-gray-200"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-3xl font-bold text-gray-800">{selectedCompany.name}</h3>
                      {selectedCompany.verified && <CheckCircle className="w-6 h-6 text-blue-500" />}
                    </div>
                    <p className="text-xl text-gray-600">{selectedCompany.industry}</p>
                    <div className="flex items-center space-x-4 text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{selectedCompany.headquarters}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{selectedCompany.size}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Founded {selectedCompany.founded}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedCompany.rating}</span>
                        <span className="text-gray-500">({selectedCompany.reviews.toLocaleString()} reviews)</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{selectedCompany.followers.toLocaleString()} followers</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="bg-white/80 border-gray-200"
                  onClick={() => setSelectedCompany(null)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <ScrollArea className="max-h-[60vh]">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">About</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedCompany.description}</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-gray-800 mb-3">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCompany.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-blue-50 text-blue-700 border-blue-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedCompany.recentNews && (
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">Recent News</h4>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-gray-700">{selectedCompany.recentNews}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{selectedCompany.jobs}</p>
                      <p className="text-sm text-gray-600">Open Jobs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-800">{selectedCompany.followers.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Followers</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="outline"
                      className={`transition-all duration-300 ${
                        selectedCompany.isFollowing
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white/80 border-gray-200"
                      }`}
                      onClick={() => handleFollowCompany(selectedCompany.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {selectedCompany.isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6"
                      onClick={() => {
                        setSelectedCompany(null)
                        setCategoryFilter("")
                        setSearchTerm(selectedCompany.name)
                        setActiveTab("jobs")
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View All Jobs
                    </Button>
                    {selectedCompany.website && (
                      <Button
                        variant="outline"
                        className="bg-white/80 border-gray-200"
                        onClick={() => window.open(selectedCompany.website, "_blank")}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </ScrollArea>
          </Card>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-ultra-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes bounce-ultra-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        @keyframes grid-glow {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.04; }
        }
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-spin-ultra-slow { animation: spin-ultra-slow 25s linear infinite; }
        .animate-bounce-ultra-slow { animation: bounce-ultra-slow 3s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-grid-glow { animation: grid-glow 3s ease-in-out infinite; }
        .animate-scroll-left { animation: scroll-left 25s linear infinite; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

import { type NextRequest, NextResponse } from "next/server"

// Mock job data (same as in jobs/route.ts)
const jobs = [
  {
    id: "1",
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "full-time",
    salary: "$120,000 - $180,000",
    description:
      "We are looking for a Senior Full Stack Developer to join our innovative team. You will be responsible for developing and maintaining web applications using modern technologies.",
    requirements: ["5+ years experience", "React.js", "Node.js", "MongoDB", "TypeScript"],
    benefits: ["Health Insurance", "401k", "Remote Work", "Flexible Hours"],
    postedDate: "2024-01-15",
    deadline: "2024-02-15",
    category: "Technology",
    experience: "Senior",
    logo: "/placeholder.svg?height=80&width=80",
    featured: true,
    applicants: 45,
  },
  // ... other jobs
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const job = jobs.find((j) => j.id === params.id)

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      job,
    })
  } catch (error) {
    console.error("Job fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

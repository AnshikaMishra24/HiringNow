import { type NextRequest, NextResponse } from "next/server"

interface Application {
  id: string
  jobId: string
  userId: string
  userName: string
  userEmail: string
  resume: string
  coverLetter: string
  status: "pending" | "reviewed" | "accepted" | "rejected"
  appliedDate: string
}

const applications: Application[] = []

export async function POST(request: NextRequest) {
  try {
    const applicationData = await request.json()

    const newApplication: Application = {
      id: Date.now().toString(),
      ...applicationData,
      status: "pending",
      appliedDate: new Date().toISOString(),
    }

    applications.push(newApplication)

    return NextResponse.json({
      success: true,
      application: newApplication,
    })
  } catch (error) {
    console.error("Application error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const jobId = searchParams.get("jobId")

    let filteredApplications = applications

    if (userId) {
      filteredApplications = filteredApplications.filter((app) => app.userId === userId)
    }

    if (jobId) {
      filteredApplications = filteredApplications.filter((app) => app.jobId === jobId)
    }

    return NextResponse.json({
      success: true,
      applications: filteredApplications,
    })
  } catch (error) {
    console.error("Applications fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

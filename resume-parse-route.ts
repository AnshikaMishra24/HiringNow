import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("resume") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate resume parsing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock parsed data
    const parsedData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      summary:
        "Experienced Full Stack Developer with 5+ years of experience in React, Node.js, and cloud technologies.",
      skills: ["JavaScript", "React.js", "Node.js", "Python", "AWS", "MongoDB", "TypeScript"],
      experience: [
        {
          title: "Senior Software Engineer",
          company: "Tech Solutions Inc.",
          duration: "2021 - Present",
          description: "Led development of scalable web applications using React and Node.js",
        },
        {
          title: "Full Stack Developer",
          company: "StartupCorp",
          duration: "2019 - 2021",
          description: "Developed and maintained multiple client projects using MERN stack",
        },
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          school: "University of California",
          year: "2019",
        },
      ],
      confidence: 92,
    }

    return NextResponse.json({
      success: true,
      data: parsedData,
    })
  } catch (error) {
    console.error("Resume parsing error:", error)
    return NextResponse.json({ error: "Failed to parse resume" }, { status: 500 })
  }
}

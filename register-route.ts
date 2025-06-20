import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

interface RegisterRequest {
  name: string
  email: string
  password: string
  role: "candidate" | "recruiter"
  company?: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, company }: RegisterRequest = await request.json()

    // Simulate user creation
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
      company: role === "recruiter" ? company : undefined,
      avatar: "/placeholder.svg?height=100&width=100",
      createdAt: new Date(),
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      token,
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

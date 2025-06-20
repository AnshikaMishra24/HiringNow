import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

interface LoginRequest {
  email: string
  password: string
}

// Mock user database
const users = [
  {
    id: "1",
    email: "john@example.com",
    password: "password123",
    name: "John Doe",
    role: "candidate",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    email: "recruiter@company.com",
    password: "recruiter123",
    name: "Sarah Wilson",
    role: "recruiter",
    company: "TechCorp Inc.",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

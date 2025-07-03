import { type NextRequest, NextResponse } from "next/server"
import { API_URL } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const response = await fetch(`${API_URL}/auth/token`, {
      method: "POST",
      body: formData,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

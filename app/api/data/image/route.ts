import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const authHeader = request.headers.get("authorization")

    // Get the name parameter from the URL
    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
    }

    // Create new FormData for the backend request
    const backendFormData = new FormData()
    const file = formData.get("file") as File
    if (file) {
      backendFormData.append("file", file)
    }

    // Replace with your actual API URL
    const response = await fetch(`http://localhost:8000/data/image?name=${encodeURIComponent(name)}`, {
      method: "POST",
      headers: {
        Authorization: authHeader || "",
      },
      body: backendFormData,
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

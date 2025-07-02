import { type NextRequest, NextResponse } from "next/server"
import { API_URL } from "@/lib/constants"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const authHeader = request.headers.get("authorization")

    const url = new URL(request.url)
    const name = url.searchParams.get("name")

    if (!name) {
      return NextResponse.json({ error: "Name parameter is required" }, { status: 400 })
    }

    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "File parameter is required" }, { status: 400 })
    }

    const backendFormData = new FormData()
    backendFormData.append("file", file)


    const response = await fetch(`${API_URL}/data/image?name=${encodeURIComponent(name)}`, {
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

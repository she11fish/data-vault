import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { file_id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")

    // Replace with your actual API URL
    const response = await fetch(`http://localhost:8000/data/convert/${params.file_id}`, {
      headers: {
        Authorization: authHeader || "",
      },
    })

    const data = await response.json()

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

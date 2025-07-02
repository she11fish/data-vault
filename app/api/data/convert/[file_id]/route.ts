import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { file_id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const { file_id } = await params

    // Replace with your actual API URL
    const response = await fetch(`http://localhost:8000/data/convert/${file_id}`, {
      headers: {
        Authorization: authHeader || "",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to convert PDF" }, { status: response.status })
    }

    const data = await response.blob()

    return new NextResponse(data, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="document.pdf"',
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

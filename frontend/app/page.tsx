import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, FileText, Lock, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <Database className="h-6 w-6 mr-2" />
          <span className="font-bold text-xl">DataVault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4">
            Login
          </Link>
          <Link href="/register" className="text-sm font-medium hover:underline underline-offset-4">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Data Management
                  <span className="block text-primary">Made Simple</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Store, manage, and convert your data with enterprise-grade security. Access your information anywhere,
                  anytime with our powerful API.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Everything you need to manage your data efficiently and securely.
              </p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <Lock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Secure Authentication</CardTitle>
                  <CardDescription>OAuth2 password flow with JWT tokens for maximum security</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your data is protected with industry-standard authentication protocols.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Database className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Create, read, update, and delete your data with ease</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Full CRUD operations with a clean, intuitive interface.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>PDF Conversion</CardTitle>
                  <CardDescription>Convert your data to PDF format instantly</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Generate professional PDF documents from your stored data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                  Join thousands of users who trust DataVault with their data management needs.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button size="lg" className="h-12 px-8">
                    <Zap className="mr-2 h-4 w-4" />
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2024 DataVault. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}

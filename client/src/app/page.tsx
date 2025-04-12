"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Link2, ArrowRight, Zap, BarChart3, Globe2, Layers, Scissors, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkAuth } from "@/lib/auth"

export default function HomePage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuthentication = async () => {
      const authStatus = await checkAuth()
      setIsAuthenticated(authStatus)
    }

    checkAuthentication()
  }, [])

  const handleUrlShortenerClick = () => {
    if (isAuthenticated) {
      router.push("/url-shortener")
    } else {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/3 -left-20 w-60 h-60 bg-indigo-300 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-1/4 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Animated geometric shapes */}
        <div className="absolute top-1/4 right-1/4 w-20 h-20 border-4 border-indigo-400 opacity-20 rounded-lg animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 border-4 border-purple-400 opacity-20 rounded-full animate-bounce-slow"></div>
        <div className="absolute top-2/3 right-1/3 w-24 h-24 border-4 border-pink-400 opacity-20 rotate-45 animate-float"></div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 relative">
            <div className="flex justify-center mb-6 animate-float">
              <div className="p-5 bg-white rounded-full shadow-lg relative">
                <Link2 className="h-20 w-20 text-indigo-600" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-30 blur-md animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-7xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 animate-gradient-x">
              URL Shortener
            </h1>
            <p className="text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
              Transform long, unwieldy URLs into concise, shareable links with our powerful, easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleUrlShortenerClick}
                className="px-8 py-6 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {isAuthenticated === null ? (
                  "Loading..."
                ) : (
                  <>
                    {isAuthenticated ? "Start Shortening URLs" : "Get Started for Free"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.scrollTo({ top: 800, behavior: "smooth" })}
                className="px-8 py-6 text-lg rounded-xl font-medium border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Animated URL Shortening Illustration */}
          <div className="mb-24 max-w-4xl mx-auto relative">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-indigo-100 overflow-hidden">
              <div className="relative h-64 flex items-center justify-center">
                {/* Long URL */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-100 rounded-lg p-4 max-w-xs animate-slide-right">
                  <div className="flex items-center">
                    <Globe2 className="h-6 w-6 text-gray-500 mr-2" />
                    <div className="text-gray-800 font-mono text-sm truncate w-56">
                      https://example.com/very/long/path/to/some/resource?param=value&another=something
                    </div>
                  </div>
                </div>

                {/* Scissors animation */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Scissors className="h-10 w-10 text-purple-600" />
                  </div>
                </div>

                {/* Short URL */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-100 rounded-lg p-4 animate-slide-left">
                  <div className="flex items-center">
                    <Link2 className="h-6 w-6 text-indigo-600 mr-2" />
                    <div className="text-indigo-800 font-mono text-sm">https://short.url/a1b2c3</div>
                  </div>
                </div>

                {/* Connecting arrows */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" />
                    </marker>
                  </defs>
                  <path
                    d="M120,80 C200,20 280,140 360,80"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8,8"
                    markerEnd="url(#arrowhead)"
                    className="animate-dash"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border border-indigo-200 group">
              <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-indigo-50">
                <Zap className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 text-lg">
                Create short links in seconds. Our platform is optimized for speed and efficiency.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border border-purple-200 group">
              <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-purple-50">
                <BarChart3 className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Detailed Analytics</h3>
              <p className="text-gray-600 text-lg">
                Track performance with comprehensive analytics on clicks, geographic data, and referrers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-500/10 to-pink-500/20 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border border-pink-200 group">
              <div className="bg-white p-4 rounded-2xl w-fit mb-6 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:bg-pink-50">
                <Share2 className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Easy Sharing</h3>
              <p className="text-gray-600 text-lg">
                Share your links across all platforms with our simple, intuitive interface.
              </p>
            </div>
          </div>

          {/* How It Works Section with Flow Diagram */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-24 border border-indigo-100">
            <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              How It Works
            </h2>
            <div className="relative">
              {/* Flow diagram */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 transform -translate-y-1/2 rounded-full"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Paste Your URL</h3>
                  <p className="text-gray-600 text-lg">Enter your long URL into our intuitive shortener input field.</p>
                  <div className="mt-6 flex justify-center">
                    <Layers className="h-16 w-16 text-indigo-300 animate-float" />
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Generate Short Link</h3>
                  <p className="text-gray-600 text-lg">Click the shorten button to instantly create your short URL.</p>
                  <div className="mt-6 flex justify-center">
                    <Scissors className="h-16 w-16 text-purple-300 animate-float" style={{ animationDelay: "0.5s" }} />
                  </div>
                </div>

                <div className="text-center relative z-10">
                  <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg transform transition-transform duration-500 hover:scale-110 hover:rotate-12">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Share & Track</h3>
                  <p className="text-gray-600 text-lg">
                    Share your link and monitor its performance with our analytics.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <Share2 className="h-16 w-16 text-pink-300 animate-float" style={{ animationDelay: "1s" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Demo */}
          <div className="bg-gradient-to-br from-indigo-600/90 to-purple-600/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 mb-24 text-white overflow-hidden relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-white/10 bg-grid"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-60 h-60 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-center mb-8">Ready to Try It Out?</h2>

              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="url"
                    placeholder="Enter your long URL here..."
                    className="flex-1 px-6 py-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-lg"
                    disabled
                  />
                  <button
                    className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:scale-105 transition-all duration-300"
                    onClick={handleUrlShortenerClick}
                  >
                    <Scissors className="h-5 w-5" />
                    Shorten URL
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-white/80">Sign up now to start shortening URLs and tracking their performance!</p>
                </div>
              </div>

              <div className="mt-10 text-center">
                <Button
                  onClick={handleUrlShortenerClick}
                  className="px-10 py-6 text-xl bg-white text-indigo-600 rounded-xl font-medium hover:bg-white/90 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {isAuthenticated === null ? (
                    "Loading..."
                  ) : (
                    <>
                      {isAuthenticated ? "Go to URL Shortener" : "Create Your Account"}
                      <ArrowRight className="ml-2 h-6 w-6" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

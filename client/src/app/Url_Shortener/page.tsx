"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  Link2,
  ExternalLink,
  Loader2,
  BarChart3,
  TrendingUp,
  Clock,
  Trash2,
  Copy,
  Share2,
  ImageIcon,
} from "lucide-react"
import { Toaster, toast } from "react-hot-toast"
import { checkAuth } from "@/lib/auth"

interface UrlData {
  _id: string
  LongUrl: string
  ShortUrl: string
  Clicks: number
  typeStamp: string
  __v: number
}

export default function UrlShortenerPage() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortenedUrls, setShortenedUrls] = useState<UrlData[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const API_BASE_URL = "http://localhost:8000"

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth()
      if (!isAuthenticated) {
        router.push("/login")
        return
      }

      fetchShortenedUrls()
      const interval = setInterval(fetchShortenedUrls, 1000)
      return () => clearInterval(interval)
    }

    verifyAuth()
  }, [router])

  const fetchShortenedUrls = async () => {
    setIsFetching(true)
    try {
      const response = await axios.get(`${API_BASE_URL}/Url/show`)
      // Normalize the data structure from backend
      const normalizedData = response.data.map((item: any) => ({
        _id: item._id || item.id,
        LongUrl: item.LongUrl || item.originalUrl || item.longUrl,
        ShortUrl: item.ShortUrl || item.shortUrl,
        Clicks: item.Clicks || item.clicks || 0,
        typeStamp: item.typeStamp || item.createdAt || new Date().toISOString(),
        __v: item.__v || 0,
      }))
      setShortenedUrls(normalizedData)
    } catch (error) {
      toast.error("Failed to fetch shortened URLs")
      console.error("Fetch error:", error)
    } finally {
      setIsFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      toast.error("Please enter a URL")
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/URL`, { URL: url })
      console.log(response)
      // Normalize the response data
      const newUrl: UrlData = {
        _id: response.data._id || response.data.id,
        LongUrl: response.data.LongUrl || response.data.originalUrl || url,
        ShortUrl: response.data.ShortUrl || response.data.shortUrl,
        Clicks: response.data.Clicks || response.data.clicks || 0,
        typeStamp: response.data.typeStamp || response.data.createdAt || new Date().toISOString(),
        __v: response.data.__v || 0,
      }

      setShortenedUrls((prevUrls) => [newUrl, ...prevUrls])
      setUrl("")
      toast.success("URL shortened successfully!")
    } catch (error) {
      toast.error("Failed to shorten URL")
      console.error("Shorten error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/urls/${id}`)
      setShortenedUrls((prevUrls) => prevUrls.filter((url) => url._id !== id))
      toast.success("URL deleted successfully")
    } catch (error) {
      toast.error("Failed to delete URL")
    }
  }

  const handleCopy = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(`${API_BASE_URL}/${shortUrl}`)
      toast.success("URL copied to clipboard")
    } catch (error) {
      toast.error("Failed to copy URL")
    }
  }

  const handleShare = async (shortUrl: string, longUrl: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Shared Short URL",
          text: `Check out this link: ${longUrl}`,
          url: `${API_BASE_URL}/${shortUrl}`,
        })
        toast.success("URL shared successfully")
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Failed to share URL")
        }
      }
    } else {
      handleCopy(shortUrl)
    }
  }

  const getClicksColor = (clicks: number) => {
    if (clicks > 1000) return "text-green-600"
    if (clicks > 500) return "text-blue-600"
    if (clicks > 100) return "text-yellow-600"
    return "text-gray-600"
  }

  const getFaviconUrl = (url: string) => {
    try {
      const urlObject = new URL(url)
      return `https://www.google.com/s2/favicons?sz=64&domain=${urlObject.hostname}`
    } catch {
      return null
    }
  }

  // Helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return "Invalid Date"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 animate-gradient-x">
      <Toaster position="top-right" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 transform hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white rounded-full shadow-lg">
                <Link2 className="h-16 w-16 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              URL Shortener
            </h1>
            <p className="text-xl text-gray-600">Transform your long URLs into powerful, trackable short links</p>
          </div>

          {/* URL Input Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-8 mb-12 transform hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter your long URL here..."
                className="flex-1 px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg transition-all duration-300"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transform hover:scale-105 transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <TrendingUp className="h-6 w-6" />
                    Shorten URL
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 transition-all duration-300">
              <div>
                <p className="text-gray-500 text-sm">Total Links</p>
                <p className="text-3xl font-bold text-gray-900">{shortenedUrls.length}</p>
              </div>
              <Link2 className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 transition-all duration-300">
              <div>
                <p className="text-gray-500 text-sm">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {shortenedUrls.reduce((sum, url) => sum + (url.Clicks || 0), 0)}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between transform hover:scale-105 transition-all duration-300">
              <div>
                <p className="text-gray-500 text-sm">Average Clicks</p>
                <p className="text-3xl font-bold text-gray-900">
                  {shortenedUrls.length > 0
                    ? Math.round(shortenedUrls.reduce((sum, url) => sum + (url.Clicks || 0), 0) / shortenedUrls.length)
                    : 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </div>

          {/* Shortened URLs List */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-indigo-600" />
              Your Links & Analytics
            </h2>
            {isFetching && shortenedUrls.length === 0 ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {shortenedUrls.map((item) => {
                  const shortUrl = item.ShortUrl || item.shortUrl
                  const fullShortUrl = `${API_BASE_URL}/${shortUrl}`

                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-102 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-white shadow-md flex items-center justify-center overflow-hidden">
                          {getFaviconUrl(item.LongUrl) ? (
                            <img
                              src={getFaviconUrl(item.LongUrl) || "/placeholder.svg"}
                              alt="Website favicon"
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate mb-1">{item.LongUrl}</p>
                          <a
                            href={fullShortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1 mb-2"
                          >
                            {fullShortUrl}
                            <ExternalLink className="h-4 w-4" />
                          </a>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              {formatDate(item.typeStamp)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end mr-6">
                          <div className={`text-2xl font-bold ${getClicksColor(item.Clicks || 0)}`}>
                            {item.Clicks || 0}
                          </div>
                          <div className="text-sm text-gray-500">clicks</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCopy(shortUrl)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Copy URL"
                          >
                            <Copy className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleShare(shortUrl, item.LongUrl)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                            title="Share URL"
                          >
                            <Share2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete URL"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
                {shortenedUrls.length === 0 && !isFetching && (
                  <div className="text-center py-12 text-gray-500">
                    <Link2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg">No shortened URLs yet. Create your first one above!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

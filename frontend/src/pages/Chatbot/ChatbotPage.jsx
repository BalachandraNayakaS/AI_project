import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FiCheck, FiCopy, FiCpu, FiMessageSquare, FiSend, FiUser, FiZap } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import chatService from '../../services/chatService'

// Helper function to format Markdown-like text into styled React elements
function FormatMarkdown({ text }) {
  const lines = text.split('\n')

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        let trimmed = line.trim()
        if (!trimmed) return <div key={idx} className="h-1" />

        // Bullet point lines
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
          const content = trimmed.replace(/^[•\-*]\s*/, '')
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-2 my-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
              <span>{parseInline(content)}</span>
            </div>
          )
        }

        // Numbered list lines (e.g., "1. ")
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^(\d+\.)\s/)[1]
          const content = trimmed.replace(/^\d+\.\s/, '')
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 my-1">
              <span className="font-semibold text-indigo-600 shrink-0">{num}</span>
              <span>{parseInline(content)}</span>
            </div>
          )
        }

        // Section header lines (e.g. 📊 **Title**)
        if (trimmed.startsWith('#') || trimmed.includes('**')) {
          return <div key={idx} className="font-medium text-slate-900 my-1">{parseInline(trimmed)}</div>
        }

        return <p key={idx} className="my-1">{parseInline(trimmed)}</p>
      })}
    </div>
  )
}

// Inline parser for **bold** and *italic*
function parseInline(text) {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic text-slate-700">{part.slice(1, -1)}</em>
    }
    return part
  })
}

export default function ChatbotPage() {
  const location = useLocation()
  const chatBottomRef = useRef(null)

  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: '✨ **Welcome to Gemini AI Business Copilot**!\n\nI can analyze live revenue trends, summarize open support tickets, rank qualified leads, or give deep account insights.\n\nTry clicking a prompt below or type your question!',
    },
  ])
  const [sending, setSending] = useState(false)

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending])

  useEffect(() => {
    if (location.state?.initialPrompt) {
      sendPrompt(location.state.initialPrompt)
    }
  }, [location.state])

  const sendPrompt = async (promptText) => {
    if (!promptText || sending) return
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: promptText,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await chatService.sendMessage(promptText)
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'assistant', text: response.data.response }])
    } catch (error) {
      toast.error('Unable to reach AI assistant.')
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 2, sender: 'assistant', text: '⚠️ Connection issue. Please ensure the backend server is running.' },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return
    await sendPrompt(input.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Response copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Banner */}
      <div className="flex items-center justify-between rounded-[28px] border border-slate-200/80 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
            <FiCpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">Gemini AI Business Copilot</h1>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">v2.5 Live</span>
            </div>
            <p className="mt-1 text-xs text-slate-300">Powered by FastAPI, SQLAlchemy & NLP Intelligence Engine</p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        
        {/* Left Suggestions & Quick Prompts Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-soft">
            <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FiZap className="text-indigo-600" />
              Suggested Prompts
            </h2>
            <p className="mt-1 text-xs text-slate-500">Click any prompt to query Gemini Copilot.</p>

            <div className="mt-4 space-y-2.5">
              <button
                type="button"
                onClick={() => sendPrompt('Sales opportunity summary')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                📊 Sales opportunity summary
              </button>
              <button
                type="button"
                onClick={() => sendPrompt('Support ticket analysis')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                🛠️ Support ticket analysis
              </button>
              <button
                type="button"
                onClick={() => sendPrompt('Lead prioritization')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                🎯 Lead prioritization matrix
              </button>
              <button
                type="button"
                onClick={() => sendPrompt('Tell me about Globex Corporation')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                👤 Search Globex Corporation
              </button>
            </div>
          </div>
        </aside>

        {/* Right Chat Stream Section */}
        <section className="flex flex-col rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-soft min-h-[580px]">
          
          {/* Scrollable Messages Stream */}
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 max-h-[500px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3.5 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* Assistant Avatar */}
                {message.sender === 'assistant' && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                    <FiCpu className="h-4 w-4" />
                  </div>
                )}

                {/* Message Bubble Container */}
                <div
                  className={`group relative max-w-[85%] rounded-[24px] px-5 py-4 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20'
                      : 'border border-slate-200/80 bg-slate-50/80 text-slate-900 shadow-sm'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <p className="text-sm font-medium leading-relaxed">{message.text}</p>
                  ) : (
                    <div>
                      <FormatMarkdown text={message.text} />
                      
                      {/* Copy Action Button */}
                      <button
                        type="button"
                        onClick={() => copyToClipboard(message.id, message.text)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        title="Copy response"
                      >
                        {copiedId === message.id ? (
                          <>
                            <FiCheck className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <FiCopy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* User Avatar */}
                {message.sender === 'user' && (
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-700 font-semibold text-sm">
                    <FiUser className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {/* Gemini Thinking Animation */}
            {sending && (
              <div className="flex items-center gap-3.5 justify-start">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white animate-pulse">
                  <FiCpu className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-3.5">
                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-xs font-medium text-slate-500">Gemini is generating response...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Floating Prompt Bar */}
          <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-slate-100">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask Gemini AI Copilot anything... (Press Enter to send)"
                className="w-full min-h-[72px] resize-none rounded-3xl border border-slate-200/80 bg-slate-50 py-3.5 pl-5 pr-14 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="absolute right-3.5 grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiSend className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Gemini AI Business Copilot can analyze live database models & generate business insights.
            </p>
          </form>

        </section>
      </div>
    </div>
  )
}

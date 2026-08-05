import { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import chatService from '../../services/chatService'

export default function ChatbotPage() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Welcome to AI Chatbot. Ask about customer insights, sales, or support workflows.' },
  ])
  const [sending, setSending] = useState(false)

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input.trim(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const response = await chatService.sendMessage(userMessage.text)
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'assistant', text: response.data.response }])
    } catch (error) {
      toast.error('Unable to reach the chatbot. Please try again.')
      setMessages((prev) => [...prev, { id: Date.now() + 2, sender: 'assistant', text: 'There was an issue processing your request.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-semibold text-slate-900">AI Chatbot</h1>
        <p className="mt-2 text-sm text-slate-500">Use the AI assistant to answer customer questions, summarize conversations, and generate follow-up recommendations.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-soft">
          <h2 className="text-sm font-semibold text-slate-900">Conversation feeds</h2>
          <p className="mt-2 text-sm text-slate-500">Review recent conversations and quick prompts.</p>
          <div className="mt-6 space-y-3">
            <button type="button" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Sales opportunity summary
            </button>
            <button type="button" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Support ticket analysis
            </button>
            <button type="button" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100">
              Lead prioritization
            </button>
          </div>
        </aside>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Chat session</h2>
              <p className="mt-1 text-sm text-slate-500">Chat with the AI assistant in real time.</p>
            </div>
          </div>

          <div className="mb-6 max-h-[520px] space-y-4 overflow-y-auto rounded-[24px] bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`rounded-3xl p-4 ${message.sender === 'assistant' ? 'bg-white text-slate-900' : 'ml-auto bg-indigo-600 text-white'}`}
              >
                <p className="text-sm leading-6">{message.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex flex-col gap-3 md:flex-row">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={2}
              placeholder="Type your message..."
              className="min-h-[88px] flex-1 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center justify-center rounded-3xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FiSend className="mr-2 h-4 w-4" />
              {sending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

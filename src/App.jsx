import { useState } from 'react'
import './App.css'
import { URL } from './constants'
import Answer from './components/Answer'

function App() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const conversationHistory = history.map(item => `
    Q: ${item.question}\nA: ${item.answer}
    `).join('\n\n')

  const payload = {
    "contents": [
      {
        "parts": [
          {
            "text": conversationHistory + `\n\nQ: ${question}\nA:`,
          }
        ]
      }
    ]
  }

  const askQuestion = async () => {
    let response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })

    response = await response.json()
    let dataString = response.candidates[0].content.parts[0].text

    if (!question.trim()) return;
    setHistory((prev) => [...prev, {
      question: question.trim(),
      answer: dataString.trim()
    }])

    setQuestion('')
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('qaHistory')
    console.log("Cleared history")
    window.location.reload()
    alert("Chat history cleared!")
  }

  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100 sm:text-xs">
      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-zinc-800 p-4 transform transition-transform duration-300 z-40
          flex flex-col justify-between
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `
        }
      >
        <div className="font-bold text-lg">Uthai K. 
          <span className="text-pink-400"> AI Chatbot</span>
          <div className="text-sm text-zinc-300 flex flex-col gap-2 mt-4">
            <p>History</p>
            <p>Settings</p>
          </div>
        </div>
        
        <div>
          <button className='relative w-full hover:bg-zinc-600 hover:cursor-pointer p-2 text-red-500
            font-semibold rounded-lg rainbow-hover px-4 py-2
          '
            onClick={clearHistory}
          >
            <span className='relative z-10'>Clear chat</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col w-full sm:w-full h-full`}
        onClick={() => setIsSidebarOpen(false)}
      >
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto over px-4 py-6">
          {history.map((msg, i) => (
            <div
              key={i}
              className="flex flex-col"
            >
              {/* User Bubble */}
              <div className="flex justify-end mb-1">
                <div className="p-3 rounded-2xl text-sm bg-pink-500 text-white max-w-[75%]">
                  {msg.question}
                </div>
              </div>

              {/* Assistant Bubble */}
              <div className="flex w-full sm:w-[100%]">
                <div className="p-3 text-sm bg-zinc-800 text-zinc-100 break-words whitespace-pre-wrap w-full max-w-full sm:max-w-full">
                  <Answer question={msg.question} ans={msg.answer} />
                </div>
              </div>
            </div>
          ))}
          
        </div>

        {/* Input Section (sticky bottom like ChatGPT) */}
        <div className="p-3 border-t border-zinc-700 bg-zinc-900 sticky bottom-0">
          <div className="flex items-center gap-2">
            <textarea
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 p-2 text-sm sm:text-base bg-zinc-800 rounded-2xl resize-none outline-none"
            />
            <button
              onClick={askQuestion}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-2xl transition"
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {/* Toggle Sidebar (mobile only) */}
      <button
        className={`md:hidden fixed top-4 left-4 z-50 bg-zinc-700 p-2 rounded-lg ${isSidebarOpen ? "hidden" : ""}`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        ☰
      </button>
    </div>
  )
}

export default App

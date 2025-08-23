import { useState } from 'react'
import './App.css'
import { URL } from './constants'
import Answer from './components/Answer'

function App() {
  const [question, setQuestion] = useState('')
  const [history, setHistory] = useState([])
  const conversationHistory = history.map(item => `
    Q: ${item.question}\nA: ${item.ansawer}
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

    const newEntry = {question, answer: dataString}
    
    // Save as array (each whole answer as one element)
    setHistory(prev => [...prev, newEntry])
    setQuestion('')
  }

  return (
    <div className='grid grid-cols-5 h-screen bg-zinc-900'>
      <div className='col-span-1 bg-zinc-800'></div>
      <div className='col-span-4'>
        <div className={`container h-150 text-white ${history.length ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          <div className='text-white p-10 text-left'>
            {history.map((item, index) => (
                <div key={index} className='mb-5 flex-col'>
                  {/* แสดง Question */}
                  <div className='flex justify-end'>
                    <div className='max-w-md bg-zinc-400 p-2 rounded-2xl
                        '>
                      <p>{item.question}</p>
                    </div>
                  </div>
                  
                  <Answer question={item.question} ans={item.answer}/>
                </div>
            ))}
          </div>
        </div>
        <div className='bg-zinc-800 w-1/2 text-white m-auto rounded-4xl border border-zinc-400 flex pr-5 p-1'>
          <textarea 
            rows={1} 
            placeholder='Ask me anything' 
            className='w-full h-full p-3 outline-none'
            onChange={(e) => setQuestion(e.target.value)}
            value={question}/>
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  )
}

export default App

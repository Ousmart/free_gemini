import React, { useEffect } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"

const parseBold = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

const Answer = ({ question, ans }) => {
  useEffect(() => {
    if (!question || !ans) return

    const saved = JSON.parse(localStorage.getItem('qaHistory')) || []
    const newEntry = { question, answer: ans }

    localStorage.setItem("qaHistory", JSON.stringify([...saved, newEntry]))
    console.log("Local storage data", JSON.parse(localStorage.getItem('qaHistory')))
  }, [question, ans])

  // Split answer into text/code blocks
  const parts = ans.split("```")

  return (
    <div className="mb-4">
      {parts.map((block, i) => {
        // Odd indexes are code blocks
        if (i % 2 === 1) {
          // Check if code starts with "python\n" etc.
          const firstLineBreak = block.indexOf("\n")
          let lang = "text"
          let code = block

          if (firstLineBreak !== -1) {
            lang = block.slice(0, firstLineBreak).trim() || "text"
            code = block.slice(firstLineBreak + 1)
          }

          return (
            <SyntaxHighlighter key={i} language={lang} style={dracula}>
              {code}
            </SyntaxHighlighter>
          )
        }
        
        const cleanText = block.replace(/\*\*/g, "")
        // Normal text
        return (
          <p key={i} className="text-white mb-2 whitespace-pre-wrap">
            {parseBold(block.trim())}
          </p>
        )
      })}
    </div>
  )
}

export default Answer

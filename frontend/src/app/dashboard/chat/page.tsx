// src/app/dashboard/chat/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Mhoroi! I'm Zoe — your personal life and career guide. Ask me anything about your future: career paths, your exam results, universities, vocational training, or just what steps to take next. I'm here for you. 🌱",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tokensLeft, setTokensLeft] = useState(20);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || isLoading) return;
    if (tokensLeft <= 0) {
      setError("You've used all your chat tokens today. Earn more by completing activities!");
      return;
    }

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.slice(-8),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error ?? "Failed to get response");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "model" as const,
          content: data.response,
          timestamp: new Date().toISOString(),
        },
      ]);
      if (data.tokensLeft !== undefined) setTokensLeft(data.tokensLeft);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      {/* Header */}
      <div className="p-4 bg-white border-b border-[#EDE3DC] flex items-center gap-3 flex-shrink-0">
        <div className="relative">
          <div className="w-10 h-10 bg-[#0D4429] rounded-full flex items-center justify-center">
            <i className="fa-solid fa-brain text-white"></i>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-[#0D4429]">Zoe</p>
          <p className="text-xs text-gray-500">AI Career &amp; Life Guide · Online</p>
        </div>
        <div className="flex items-center gap-1.5 bg-[#E8F4EE] text-[#0D4429] text-xs font-semibold px-3 py-1.5 rounded-full">
          <i className="fa-solid fa-comment-dots"></i>
          {tokensLeft} tokens left
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFDF9]">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} page-enter`}
          >
            {msg.role === "model" && (
              <div className="w-7 h-7 bg-[#0D4429] rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <i className="fa-solid fa-brain text-white text-xs"></i>
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#0D4429] text-white rounded-tr-sm"
                  : "bg-white text-gray-800 rounded-tl-sm border border-[#EDE3DC] shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start page-enter">
            <div className="w-7 h-7 bg-[#0D4429] rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-1">
              <i className="fa-solid fa-brain text-white text-xs zoe-thinking"></i>
            </div>
            <div className="bg-white border border-[#EDE3DC] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#0D4429] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-[#0D4429] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-[#0D4429] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Token Warning */}
      {tokensLeft <= 3 && tokensLeft > 0 && (
        <div className="px-4 py-2 bg-[#FEF3C7] border-t border-[#FDE68A] flex items-center gap-2 text-xs text-[#D97706] font-medium">
          <i className="fa-solid fa-triangle-exclamation"></i>
          Only {tokensLeft} token{tokensLeft === 1 ? "" : "s"} left today. Complete activities to earn more!
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-[#EDE3DC] flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Zoe anything about your career or future..."
            rows={1}
            className="flex-1 resize-none px-4 py-3 rounded-xl border border-[#EDE3DC] focus:outline-none focus:border-[#0D4429] bg-[#FFFDF9] text-sm transition-colors max-h-32"
            style={{ minHeight: "48px" }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading || tokensLeft <= 0}
            className="w-12 h-12 bg-[#0D4429] text-white rounded-xl hover:bg-[#155E38] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center flex-shrink-0"
          >
            <i className={`fa-solid ${isLoading ? "fa-spinner fa-spin" : "fa-paper-plane"}`}></i>
          </button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
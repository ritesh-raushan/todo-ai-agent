import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Maximize2, Minimize2 } from 'lucide-react'


export function ChatBox() {
    const [isOpen, setIsOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            content: 'How can I help you today?',
            timestamp: Date.now()
        }
    ])
    const [isTyping, setIsTyping] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isTyping])

    // Auto-focus input when chat opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        }
    }, [isOpen])

    // Simple focus maintenance after sending message
    useEffect(() => {
        if (isOpen && !isTyping && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen, isTyping])

    const handleSendMessage = (e) => {
        e.preventDefault()

        if (!inputValue.trim() || isTyping) return

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI response after 1 second
        setTimeout(() => {
            const aiMessage = {
                id: Date.now() + 1,
                type: 'ai',
                content: 'How can I help you today?',
                timestamp: Date.now()
            }
            setMessages(prev => [...prev, aiMessage])
            setIsTyping(false)
        }, 1000)
    }

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded)
    }

    // Chat window dimensions and positioning based on expanded state
    const chatDimensions = isExpanded
        ? {
            width: 'w-[500px]',
            height: 'h-[600px]',
            position: 'bottom-24 right-6',
            maxWidth: 'max-w-[90vw]',
            maxHeight: 'max-h-[80vh]'
        }
        : {
            width: 'w-80',
            height: 'h-96',
            position: 'bottom-24 right-6',
            maxWidth: '',
            maxHeight: ''
        }

    return (
        <>
            {/* Chat Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-violet-600 hover:bg-violet-700 rounded-full shadow-lg flex items-center justify-center text-white z-40"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <X size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="chat"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCircle size={20} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        layout
                        className={`fixed ${chatDimensions.position} ${chatDimensions.width} ${chatDimensions.height} ${chatDimensions.maxWidth} ${chatDimensions.maxHeight} bg-zinc-900/72 backdrop-blur-sm border border-white/12 rounded-xl shadow-2xl flex flex-col z-30`}
                        style={{
                            background: 'rgba(26,26,34,0.72)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.30), 0 18px 36px rgba(124,58,237,0.15)'
                        }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-semibold text-sm">AI Assistant</span>
                            </div>

                            {/* Expand/Collapse Button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleExpanded}
                                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                                title={isExpanded ? 'Minimize chat' : 'Expand chat'}
                            >
                                <AnimatePresence mode="wait">
                                    {isExpanded ? (
                                        <motion.div
                                            key="minimize"
                                            initial={{ rotate: 180, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -180, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Minimize2 size={16} className="text-gray-400" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="maximize"
                                            initial={{ rotate: -180, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 180, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Maximize2 size={16} className="text-gray-400" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((message) => (
                                <ChatMessage key={message.id} message={message} isExpanded={isExpanded} />
                            ))}
                            {isTyping && <TypingIndicator />}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={isTyping ? "AI is typing..." : (isExpanded ? "Type a message to your AI assistant..." : "Ask me anything...")}
                                    className="flex-1 rounded-lg px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 text-white"
                                    style={{
                                        background: 'rgba(26,26,34,0.50)',
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        transition: 'border-color 160ms ease, box-shadow 160ms ease'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                                        e.target.style.boxShadow = '0 0 0 2px rgba(124,58,237,0.20)'
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = 'rgba(255,255,255,0.10)'
                                        e.target.style.boxShadow = 'none'
                                    }}
                                    disabled={isTyping}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="w-10 h-10 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-colors"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

function ChatMessage({ message, isExpanded }) {
    const isUser = message.type === 'user'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
        >
            <div
                className={`${isExpanded ? 'max-w-[85%]' : 'max-w-[75%]'} px-3 py-2 rounded-lg text-sm ${isUser
                        ? 'bg-violet-600 text-white'
                        : 'text-gray-100'
                    }`}
                style={!isUser ? {
                    background: 'rgba(26,26,34,0.72)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.20)'
                } : {}}
            >
                {message.content.split('\n').map((line, index) => (
                    <div key={index} className={isExpanded ? 'leading-relaxed' : ''}>{line}</div>
                ))}
                <div className={`text-xs mt-1 opacity-60 ${isUser ? 'text-violet-200' : 'text-gray-400'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </motion.div>
    )
}

function TypingIndicator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
        >
            <div
                className="px-3 py-2 rounded-lg"
                style={{
                    background: 'rgba(26,26,34,0.72)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.20)'
                }}
            >
                <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-1 bg-gray-400 rounded-full"
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-2">AI is typing...</span>
                </div>
            </div>
        </motion.div>
    )
}

export default ChatBox
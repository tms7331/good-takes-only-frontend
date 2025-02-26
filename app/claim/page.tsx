"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"



async function getResponseGet(message: string) {
    const encodedMessage = encodeURIComponent(message);
    const response = await fetch(`/api/chat?message=${encodedMessage}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    const data = await response.json();
    console.log("data", data)
    return data.response;
}

async function getResponsePost(message: string) {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.response;
}


export default function Chat() {
    const [input, setInput] = useState("")
    const [response, setResponse] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitted(true)
        setIsLoading(true)
        try {
            const response = await getResponseGet(input)
            setResponse(response)
        } catch (error) {
            console.error("Error:", error)
            setResponse("Sorry, there was an error processing your request.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-100 tracking-tight">Good Takes Only</h1>

                <Card className="w-full max-w-2xl border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-8">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Share your take</h2>
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="min-h-[200px] resize-none text-lg p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-900"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-6 rounded-xl text-lg font-medium transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!input.trim()}
                                    >
                                        Send Message
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="prose prose-lg dark:prose-invert max-w-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed">
                                            {response}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

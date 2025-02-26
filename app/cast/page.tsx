"use client"
import { Navbar } from "@/components/navbar"


export default function CreateCast() {
    return (
        <>
            <Navbar />
        </>
    )
}


/*
export const dynamic = "force-dynamic";

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { hashString } from "@/lib/hashfunc"
import { checkApproved } from "@/lib/prove"

async function publishCast(msg: string) {
    const url = "https://api.neynar.com/v2/farcaster/cast"

    const options = {
        method: "POST",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_NEYNAR_KEY!,
        },
        body: JSON.stringify({
            signer_uuid: process.env.NEXT_PUBLIC_NEYNAR_SIGNER_UUID,
            text: msg,
        }),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    // If cast failed - return error
    if (!data.success) {
        throw new Error("Cast failed")
    }
    // If cast succeeded - return the cast hash
    // {
    //     "success": true,
    //         "cast": {
    //         "hash": "0x608cc477dcc114ef8c331c51be0182da809af08e",
    if (!data.success || !data.cast || !data.cast.hash) {
        console.error("Invalid API response:", data);
        throw new Error("Cast failed or missing hash in response.");
    }

    //const truncatedHash = data.cast.hash.slice(0, 10)
    const truncatedHash = data.cast.hash;
    return truncatedHash
}

export default function CreateCast() {
    const [input, setInput] = useState("")
    const [response, setResponse] = useState("")
    const [isLink, setIsLink] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()


        setIsSubmitted(true)
        setIsLoading(true)
        try {
            const hash = await hashString(password)
            console.log("hash", hash)
            const approved = await checkApproved(hash)
            console.log("approved", approved)
            if (!approved) {
                throw new Error("Invalid password");
            }

            const truncatedHash = await publishCast(input)
            const link = `https://warpcast.com/deepspeak/${truncatedHash}`
            setResponse(link)
            setIsLink(true)
        } catch (error) {
            console.error("Error:", error)
            setResponse(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-100 tracking-tight">Create Cast</h1>

                <Card className="w-full max-w-xl border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <AnimatePresence mode="wait">
                            {!isSubmitted ? (
                                <motion.form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                                        What&apos;s your anonymous crypto take?
                                    </h2>
                                    <div className="space-y-2">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter password"
                                            className="w-full text-base p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-900"
                                        />
                                    </div>
                                    <Textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        className="min-h-[100px] resize-none text-base p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-600 dark:focus:border-blue-500 transition-all duration-200 bg-white dark:bg-gray-900"
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-4 rounded-xl text-base font-medium transition-all duration-200 shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!input.trim()}
                                    >
                                        Create DeepSpeak Cast
                                    </Button>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                                        </div>
                                    ) : (
                                        <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-relaxed text-lg">
                                            {isLink ? (
                                                <a href={response} target="_blank" rel="noopener noreferrer">
                                                    {response}
                                                </a>
                                            ) : (
                                                response
                                            )}
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


*/
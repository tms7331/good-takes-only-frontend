"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { callProver, getWebProof, verifyProof } from "@/lib/prove"
import { WebProofRequest } from '@vlayer/sdk'
import { useState } from "react"


export default function Claim() {

  const handleClaim = async () => {
    try {
      console.log("Claim button clicked")
      const webProof = await getWebProof()
      console.log("WebProof:", webProof)
      const proof = await callProver(webProof)
      console.log("Proof:", proof)
      await verifyProof(proof, "abckasdf023")
    } catch (error) {
      console.error("Error in claim process:", error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-100 tracking-tight">Claim Your Rewards</h1>

        <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <Button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-8 text-xl font-medium transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
            >
              Claim
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


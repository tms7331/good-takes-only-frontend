"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { callProver, getWebProof, verifyProof } from "@/lib/prove"
import { hashString } from "@/lib/hashfunc"
import { WebProofRequest } from '@vlayer/sdk'
import { useState } from "react"


export default function Claim() {
  const [proofState, setProofState] = useState<'initial' | 'building' | 'proving' | 'ready' | 'verified'>('initial')
  const [proof, setProof] = useState<any>(null)
  const [password, setPassword] = useState('')

  const handleClaim = async () => {
    try {
      setProofState('building')
      const webProof = await getWebProof()

      setProofState('proving')
      const generatedProof = await callProver(webProof)
      setProof(generatedProof)
      setProofState('ready')
    } catch (error) {
      console.error("Error in claim process:", error)
      setProofState('initial')
    }
  }

  const handleVerify = async () => {
    const hashedPass = await hashString(password)
    console.log("Hashed password:", hashedPass)
    try {
      await verifyProof(proof, hashedPass)
      setProofState('verified')
    } catch (error) {
      console.error("Error in verification:", error)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-blue-900 dark:text-blue-100 tracking-tight">Claim Your Rewards</h1>

        <Card className="w-full max-w-md border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-4">
            {proofState === 'initial' && (
              <Button
                onClick={handleClaim}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-8 text-xl font-medium transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
              >
                Claim
              </Button>
            )}

            {proofState === 'building' && (
              <div className="text-center py-8 text-xl">Building proof...</div>
            )}

            {proofState === 'proving' && (
              <div className="text-center py-8 text-xl">Proving...</div>
            )}

            {proofState === 'ready' && (
              <>
                <input
                  type="password"
                  placeholder="Choose password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border rounded-lg mb-4"
                />
                <Button
                  onClick={handleVerify}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white py-8 text-xl font-medium transition-all duration-200 shadow-md hover:shadow-xl active:scale-95"
                >
                  Verify Proof and Claim Cast Privileges
                </Button>
              </>
            )}

            {proofState === 'verified' && (
              <a
                href="/cast"
                className="block w-full text-center py-8 text-xl text-blue-600 hover:text-blue-800 underline"
              >
                Go to Cast Page
              </a>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}


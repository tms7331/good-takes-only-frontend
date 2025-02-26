import { createVlayerClient, WebProofRequest, WebProofRequestInput } from '@vlayer/sdk'
import {
    createWebProofRequest,
    startPage,
    expectUrl,
    notarize,
    createExtensionWebProofProvider,
} from '@vlayer/sdk/web_proof'

// import { proverAbi } from './WebProofProver.json'
import webProofProver from "./WebProofProver.json";
import webProofVerifier from "./WebProofVerifier.json";
import { sepolia, anvil } from 'viem/chains'

const VERIFIER_ADDRESS = "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707";
const RPC_URL = "http://127.0.0.1:8545";

import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Hex, Abi } from "viem";

const walletClient = createWalletClient({
    chain: anvil,
    transport: http(RPC_URL),
    account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as Hex),
});

const publicClient = createPublicClient({
    chain: anvil,
    transport: http(RPC_URL),
});


export async function getWebProof() {

    const provider = createExtensionWebProofProvider({
        wsProxyUrl: "http://localhost:55688",
        notaryUrl: "http://127.0.0.1:7047"
    })
    const webProofRequest = await provider.getWebProof({
        logoUrl: "http://twitterswap.com/logo.png",
        steps: [
            startPage('http://localhost:3000', 'Go to Good Takes submission page'),
            expectUrl('http://localhost:3000', 'Submit a good take'),
            notarize('https://api.openai.com/v1/chat/completions', 'POST', 'Generate Proof of good take'),
        ],
        // Don't actually use it but type system complains without it
        proverCallCommitment: {
            address: "0x0" as `0x${string}`,
            proverAbi: webProofProver.abi as Abi,
            chainId: 31337,
            functionName: 'main',
            commitmentArgs: [] as never,
        },
    });
    return webProofRequest
}

export async function callProver(webProofRequest: WebProofRequestInput) {
    const PROVER_ADDRESS = "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6"
    const vlayer = createVlayerClient()
    const hashedPass = "abckasdf023";
    const hash = await vlayer.proveWeb({
        address: PROVER_ADDRESS,
        proverAbi: webProofProver.abi as Abi,
        functionName: 'main',
        args: [webProofRequest, hashedPass],
        chainId: 31337,
    })
    return hash
}

export async function verifyProof(proof, hashedPass: string) {
    console.log("Getting verified...")
    await new Promise(resolve => setTimeout(resolve, 2000));
    const txHash = await walletClient.writeContract({
        address: VERIFIER_ADDRESS as `0x${string}`,
        abi: webProofVerifier.abi as Abi,
        functionName: "verifyT",
        args: ["good", hashedPass],
        chain: anvil,
        // account: walletClient.account,
    });
    console.log("Tx hash:", txHash)

    const verification = await publicClient.waitForTransactionReceipt({
        hash: txHash,
        confirmations: 1,
        retryCount: 60,
        retryDelay: 1000,
    });
    console.log("Verified!", verification);
};

export async function checkApproved(hashedPass: string): Promise<boolean> {
    const approved = await publicClient.readContract({
        address: VERIFIER_ADDRESS as `0x${string}`,
        abi: webProofVerifier.abi as Abi,
        functionName: "approved",
        args: [hashedPass],
    });

    return approved as boolean;
}

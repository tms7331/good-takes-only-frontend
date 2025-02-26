import { createVlayerClient, WebProofRequest, WebProofRequestInput } from '@vlayer/sdk'
import {
    createWebProofRequest,
    startPage,
    expectUrl,
    notarize,
    createExtensionWebProofProvider,
} from '@vlayer/sdk/web_proof'
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { Hex, Abi } from "viem";

import webProofProver from "./WebProofProver.json";
import webProofVerifier from "./WebProofVerifier.json";
import { sepolia, anvil } from 'viem/chains'



const VERIFIER_ADDRESS = process.env.VITE_VERIFIER_ADDRESS as `0x${string}`;
const PROVER_ADDRESS = process.env.VITE_PROVER_ADDRESS as `0x${string}`;
const RPC_URL = "http://127.0.0.1:8545";


const walletClient = createWalletClient({
    chain: anvil,
    transport: http(RPC_URL),
    account: privateKeyToAccount(process.env.NEXT_PUBLIC_PRIVATE_KEY as Hex),
});

const publicClient = createPublicClient({
    chain: anvil,
    transport: http(RPC_URL),
});


const proverCallCommitment = {
    address: PROVER_ADDRESS,
    proverAbi: webProofProver.abi as Abi,
    chainId: 31337,
    functionName: 'main',
    commitmentArgs: [] as never,
};


export async function getWebProof() {

    const provider = createExtensionWebProofProvider({
        wsProxyUrl: "http://localhost:55688",
        notaryUrl: "http://127.0.0.1:7047"
    })

    // startPage('http://localhost:3000', 'Go to Good Takes submission page'),
    // expectUrl('http://localhost:3000', 'Submit a good take'),
    // notarize('https://api.openai.com/v1/chat/completions', 'POST', 'Generate Proof of good take'),
    const webProofRequest = await provider.getWebProof({
        logoUrl: "http://twitterswap.com/logo.png",
        steps: [
            startPage('https://good-takes-only-frontend.vercel.app/claim', 'Go to Good Takes submission page'),
            expectUrl('https://good-takes-only-frontend.vercel.app/claim', 'Submit a good take'),
            notarize('https://good-takes-only-frontend.vercel.app/api/chat', 'GET', 'Generate Proof of good take'),
        ],
        // Don't actually use it but type system complains without it
        proverCallCommitment: proverCallCommitment,
    });
    return webProofRequest
}

export async function callProver(webProof: any, hashedPass: string) {
    // all args required by prover contract function except webProof itself
    const commitmentArgs = [hashedPass]
    const vlayer = createVlayerClient()
    const hash = await vlayer.prove({
        ...proverCallCommitment,
        args: [webProof, ...commitmentArgs],
    })

    // const PROVER_ADDRESS = "0x2279b7a0a67db372996a5fab50d91eaa73d2ebe6"
    // const vlayer = createVlayerClient()
    // const hashedPass = "abckasdf023";
    // const hash = await vlayer.proveWeb({
    //     address: PROVER_ADDRESS,
    //     proverAbi: webProofProver.abi as Abi,
    //     functionName: 'main',
    //     args: [webProof, hashedPass],
    //     chainId: 31337,
    // })
    return hash
}

export async function verifyProof(proof: any, hashedPass: string) {
    console.log("Getting verified...")
    await new Promise(resolve => setTimeout(resolve, 2000));
    const txHash = await walletClient.writeContract({
        address: VERIFIER_ADDRESS as `0x${string}`,
        abi: webProofVerifier.abi as Abi,
        functionName: "verify",
        args: [proof, hashedPass],
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


export async function verifyProofFake(hashedPass: string) {
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
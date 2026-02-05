"use client";
export const dynamic = "force-dynamic";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChatBubble } from "@/components/bubble";
import { PromptBox } from "@/components/chatgpt-prompt-input";

type ChatMessage = {
    role: "user" | "assistant";
    content: string;
    };

    const API_URL = "https://autoplastic-mario-peakless.ngrok-free.dev/ask";

    export default function Page1() {
    const searchParams = useSearchParams();
    const initialMessage = searchParams.get("message");

    const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>(() =>
        initialMessage ? [{ role: "user", content: initialMessage }] : []
    );

    const bottomRef = React.useRef<HTMLDivElement>(null);

    // auto-scroll on new messages
    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    async function sendMessage(message: string) {
        // add user message immediately
        setChatHistory((prev) => [
        ...prev,
        { role: "user", content: message },
        ]);

        try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            message: message, // ✅ matches schema exactly
            }),
        });

        const data = await response.json();

        // backend returns a plain string (same as Streamlit)
        setChatHistory((prev) => [
            ...prev,
            { role: "assistant", content: data.response },
        ]);
        } catch (error) {
        setChatHistory((prev) => [
            ...prev,
            {
            role: "assistant",
            content: "⚠️ Unable to reach the server. Please try again.",
            },
        ]);
        }
    }

    return (
        <div className="relative flex min-h-screen flex-col bg-background px-20 py-6">
        {/* CHAT HISTORY */}
        <div
            className={cn(
            "flex-1 overflow-y-auto px-4 py-6 rounded-3xl overflow-hidden",
            "bg-[#212121]"
            )}
        >
            <div className="mx-auto max-w-3xl space-y-4">
            {chatHistory.map((msg, i) => (
                <ChatBubble key={i} role={msg.role}>
                {msg.content}
                </ChatBubble>
            ))}
            <div ref={bottomRef} />
            </div>
        </div>

        {/* PROMPT BOX */}
        <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur">
            <div className="mx-auto max-w-3xl p-4">
            <PromptBox
                placeholder="Message..."
                onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const value = (e.target as HTMLTextAreaElement).value.trim();
                    if (!value) return;

                    sendMessage(value);
                    (e.target as HTMLTextAreaElement).value = "";
                }
                }}
            />
            </div>
        </div>
        </div>
    );
}

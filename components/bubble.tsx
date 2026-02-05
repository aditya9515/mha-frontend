import { cn } from "@/lib/utils";

export function ChatBubble({
    role,
    children,
    }: {
    role: "user" | "assistant";
    children: React.ReactNode;
    }) {
    const isUser = role === "user";

    return (
        <div
        className={cn(
            "flex w-full",
            isUser ? "justify-end" : "justify-start"
        )}
        >
        <div
            className={cn(
            "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
            isUser
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-card text-card-foreground dark:bg-[#303030]"
            )}
        >
            {children}
        </div>
        </div>
    );
}

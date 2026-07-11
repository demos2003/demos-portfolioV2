import { getContactSubmissions } from "@/lib/data/contact"
import { MessageCard } from "./message-card"

export default async function AdminMessagesPage() {
  const submissions = await getContactSubmissions()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">Messages</h1>

      <div className="space-y-4">
        {submissions.length === 0 && (
          <p className="text-muted-foreground">No messages yet.</p>
        )}
        {submissions.map((submission) => (
          <MessageCard key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { getAboutStats, getAboutBio, getContactInfo } from "@/lib/data/about"
import { BioForm } from "./bio-form"
import { ContactInfoForm } from "./contact-info-form"
import { StatsList } from "./stats-list"
import { StatFormDialog } from "./stat-form-dialog"

export default async function AdminAboutPage() {
  const [stats, bio, contactInfo] = await Promise.all([
    getAboutStats(),
    getAboutBio(),
    getContactInfo(),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif">About &amp; Contact</h1>

      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <BioForm paragraphs={bio} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Info</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactInfoForm contactInfo={contactInfo} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Stats</CardTitle>
          <StatFormDialog
            trigger={
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add Stat
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          <StatsList stats={stats} />
        </CardContent>
      </Card>
    </div>
  )
}

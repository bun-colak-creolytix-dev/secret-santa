import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/room/$id')({
  component: RoomPage,
})

function RoomPage() {
  const { id } = Route.useParams()

  return (
    <div className="min-h-screen p-4 bg-accent/20">
      <div className="max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader className="border-l-secondary bg-secondary/5">
            <CardTitle className="text-3xl text-primary">
              🎅 Secret Santa Room 🎄
            </CardTitle>
            <CardDescription>
              Room ID: <span className="font-mono font-semibold text-primary">{id}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-lg">
                Welcome to your Secret Santa room! This is where you'll manage
                your event.
              </p>

              <div className="border-2 border-l-4 border-l-secondary rounded-lg p-4 bg-secondary/10">
                <h3 className="font-semibold mb-3 text-secondary-foreground flex items-center gap-2 bg-secondary text-white px-3 py-2 rounded-md -mx-1 -mt-1">
                  <span className="text-xl">🎁</span>
                  <span>Coming Soon</span>
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Add participants to your Secret Santa
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Set spending limits and rules
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Generate and send assignments
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Track who has confirmed their participation
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

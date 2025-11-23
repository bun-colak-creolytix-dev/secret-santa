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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-green-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="shadow-xl border-2 border-red-200/50 bg-white/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl font-serif text-red-700">
              Secret Santa Room
            </CardTitle>
            <CardDescription className="text-base">
              Room ID: <span className="font-mono font-semibold">{id}</span>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Welcome to your Secret Santa room! This is where you'll manage
                your event.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">
                  🎁 Coming Soon
                </h3>
                <ul className="space-y-1 text-sm text-green-800">
                  <li>• Add participants to your Secret Santa</li>
                  <li>• Set spending limits and rules</li>
                  <li>• Generate and send assignments</li>
                  <li>• Track who has confirmed their participation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getAdminRoom } from '@/functions/rooms'
import { toast } from 'sonner'
import { Share2, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/room/$id/x/$adminKey')({
  component: AdminRoomPage,
  loader: async ({ params }) => {
    try {
      const data = await getAdminRoom({
        // @ts-ignore - TanStack Start types issue
        data: { roomId: params.id, adminKey: params.adminKey },
      })
      return data
    } catch (error) {
      // If admin key is invalid, return null to show error state
      return null
    }
  },
})

function AdminRoomPage() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const navigate = useNavigate()
  const [isSharing, setIsSharing] = useState(false)

  // If loader returned null, the admin key is invalid
  if (!loaderData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              ⚠️ Access Denied
            </CardTitle>
            <CardDescription>
              The admin link you're trying to access is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: `/room/${id}` })}
              className="w-full"
            >
              Go to Participant View
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const participantUrl = `${window.location.origin}/room/${id}`

  const handleShare = async () => {
    setIsSharing(true)
    try {
      await navigator.clipboard.writeText(participantUrl)
      toast.success('🔗 Participant link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('Failed to copy link. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const handleDrawNames = () => {
    console.log('Drawing names...')
    toast.info('🎲 Drawing names feature coming soon!')
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="min-h-screen p-4 bg-accent/20">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Participants List Card */}
        <Card>
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-2xl">👥 Participants</CardTitle>
            <CardDescription>
              {loaderData.participants.length === 0
                ? 'No participants yet - share the link below!'
                : `${loaderData.participants.length} ${
                    loaderData.participants.length === 1 ? 'person' : 'people'
                  } participating`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loaderData.participants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">
                  🎄 Waiting for participants to join...
                </p>
                <p className="text-sm mt-2">
                  Share the link below to invite others!
                </p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {loaderData.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="size-12 bg-primary/10 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                          {getInitials(participant.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg">
                          {participant.name}
                        </p>
                        <p className="text-sm text-muted-foreground break-all">
                          {participant.email}
                        </p>
                        {participant.note && (
                          <div className="mt-2 p-2 bg-background/50 rounded text-sm">
                            <p className="text-muted-foreground font-medium">
                              Gift preferences:
                            </p>
                            <p className="mt-1 whitespace-pre-wrap">
                              {participant.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Participant Link Display */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg">Participant Link</CardTitle>
            <CardDescription>
              Share this link with people you want to invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={participantUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md text-sm font-mono"
                onClick={(e) => e.currentTarget.select()}
              />
              <Button
                onClick={handleShare}
                disabled={isSharing}
                variant="outline"
                className="shrink-0"
              >
                <Share2 className="size-4 mr-2" />
                {isSharing ? 'Copying...' : 'Copy Link'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleDrawNames}
          className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90"
          size="lg"
        >
          <Sparkles className="size-5 mr-2" />
          Draw Names
        </Button>
      </div>
    </div>
  )
}

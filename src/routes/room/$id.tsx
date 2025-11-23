import { createFileRoute, useRouter, Outlet, useMatches } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getRoomWithParticipants, joinRoom } from '@/functions/rooms'
import { toast } from 'sonner'
import { Share2, CheckCircle2 } from 'lucide-react'

const SITE_URL = 'https://your-domain.com'
const OG_IMAGE = '/og-image.png'
const SITE_NAME = 'Secret Santa'

export const Route = createFileRoute('/room/$id')({
  component: RoomPage,
  loader: async ({ params }) => {
    const data = await getRoomWithParticipants({
      // @ts-ignore - TanStack Start types issue
      data: { roomId: params.id },
    })
    return data
  },
  head: ({ loaderData, location }) => {
    const roomName = loaderData.room.name
    const participantCount = loaderData.participants.length
    const roomTitle = `${roomName} - Secret Santa Exchange`
    const roomDescription = `Join the ${roomName} Secret Santa exchange! ${participantCount} ${participantCount === 1 ? 'person has' : 'people have'} joined. Create your holiday gift exchange group and let the elves handle the matching.`
    const roomUrl = `${SITE_URL}${location.pathname}`

    return {
      meta: [
        {
          title: roomTitle,
        },
        {
          name: 'description',
          content: roomDescription,
        },
        {
          property: 'og:title',
          content: roomTitle,
        },
        {
          property: 'og:description',
          content: roomDescription,
        },
        {
          property: 'og:image',
          content: `${SITE_URL}${OG_IMAGE}`,
        },
        {
          property: 'og:url',
          content: roomUrl,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:title',
          content: roomTitle,
        },
        {
          name: 'twitter:description',
          content: roomDescription,
        },
        {
          name: 'twitter:image',
          content: `${SITE_URL}${OG_IMAGE}`,
        },
      ],
      links: [
        {
          rel: 'canonical',
          href: roomUrl,
        },
      ],
    }
  },
})

function RoomPage() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)
  const [hasJoined, setHasJoined] = useState(false)
  const [userParticipation, setUserParticipation] = useState<{
    name: string
    email: string
    note: string | null
  } | null>(null)

  // Check localStorage to see if user has already joined this room
  useEffect(() => {
    const checkParticipation = () => {
      try {
        const rooms = JSON.parse(
          localStorage.getItem('secretSanta_rooms') || '[]',
        )
        const participation = rooms.find(
          (room: { roomId: string; email: string; name: string }) =>
            room.roomId === id,
        )
        if (participation) {
          setHasJoined(true)
          // Find full participant data from loaderData
          const fullData = loaderData.participants.find(
            (p) => p.email === participation.email,
          )
          if (fullData) {
            setUserParticipation(fullData)
          }
        }
      } catch (error) {
        console.error('Error checking localStorage:', error)
      }
    }
    checkParticipation()
  }, [id, loaderData.participants])

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      note: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await joinRoom({
          // @ts-ignore - TanStack Start types issue
          data: {
            roomId: id,
            name: value.name,
            email: value.email,
            note: value.note,
          },
        })

        // Save to localStorage
        try {
          const rooms = JSON.parse(
            localStorage.getItem('secretSanta_rooms') || '[]',
          )
          rooms.push({ roomId: id, email: value.email, name: value.name })
          localStorage.setItem('secretSanta_rooms', JSON.stringify(rooms))
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }

        // Clear the form
        form.reset()

        // Invalidate the loader to refetch the room data
        router.invalidate()

        // Update state to show joined view
        setHasJoined(true)
        setUserParticipation({
          name: value.name,
          email: value.email,
          note: value.note || null,
        })

        toast.success('🎉 Successfully joined the exchange!')
      } catch (error) {
        console.error('Failed to join room:', error)
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to join room. Please try again.',
        )
      }
    },
  })

  const handleShare = async () => {
    setIsSharing(true)
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('🔗 Link copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy link:', error)
      toast.error('Failed to copy link. Please try again.')
    } finally {
      setIsSharing(false)
    }
  }

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase()
  }

  const matches = useMatches()
  const hasChildRoute = matches.some(match => match.id.includes('/x/'))

  // If a child route is active (admin page), just render the Outlet
  if (hasChildRoute) {
    return <Outlet />
  }

  return (
    <div className="min-h-screen p-4 bg-accent/20">
      <div className="max-w-4xl mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🎅 {loaderData.room.name} 🎄
          </h1>
          <p className="text-muted-foreground">
            Organized by {loaderData.room.organizerEmail}
          </p>
        </div>

        {/* Join Form Card or Already Joined Message */}
        {hasJoined && userParticipation ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="bg-secondary/5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-6 text-primary" />
                <CardTitle className="text-2xl">
                  ✨ You're Already Participating!
                </CardTitle>
              </div>
              <CardDescription>
                You've successfully joined this Secret Santa exchange
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Your Name</Label>
                  <p className="font-medium text-lg">{userParticipation.name}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Your Email</Label>
                  <p className="font-medium">{userParticipation.email}</p>
                </div>

                {userParticipation.note && (
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">
                      Your Gift Preferences
                    </Label>
                    <div className="p-3 bg-background/50 rounded-md">
                      <p className="whitespace-pre-wrap">
                        {userParticipation.note}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 text-sm text-muted-foreground">
                  🎄 Sit tight! You'll be notified when names are drawn.
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="bg-secondary/5">
              <CardTitle className="text-2xl">✨ Enter the Circle</CardTitle>
              <CardDescription>
                Join the exchange and share your wishlist with your Secret Santa
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  await form.handleSubmit()
                }}
                className="space-y-4"
              >
                <form.Field
                  name="name"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || value.length < 2) {
                        return 'Name must be at least 2 characters'
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="e.g., Rudolph"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field
                  name="email"
                  validators={{
                    onChange: ({ value }) => {
                      if (!value || !value.includes('@')) {
                        return 'Please enter a valid email address'
                      }
                      return undefined
                    },
                  }}
                >
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="email">Your Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., rudolph@northpole.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-sm text-destructive">
                          {String(field.state.meta.errors[0])}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>

                <form.Field name="note">
                  {(field) => (
                    <div className="space-y-2">
                      <Label htmlFor="note">
                        Dear Santa (Gift Ideas & Notes)
                      </Label>
                      <Textarea
                        id="note"
                        placeholder="e.g., I love books, coffee, and cozy socks! Please avoid anything with peanuts."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={4}
                      />
                      <p className="text-xs text-muted-foreground">
                        Share your interests, hobbies, or gift preferences to
                        help your Secret Santa!
                      </p>
                    </div>
                  )}
                </form.Field>

                <Button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6"
                  disabled={form.state.isSubmitting}
                >
                  {form.state.isSubmitting
                    ? 'Joining...'
                    : '🎁 Join the Exchange'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Participants List Card */}
        <Card>
          <CardHeader className="bg-accent/5">
            <CardTitle className="text-2xl">👥 Who's Joining</CardTitle>
            <CardDescription>
              {loaderData.participants.length === 0
                ? 'Be the first to join!'
                : `${loaderData.participants.length} ${
                    loaderData.participants.length === 1
                      ? 'person has'
                      : 'people have'
                  } joined so far`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loaderData.participants.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg">🎄 Waiting for the first elf to join...</p>
                <p className="text-sm mt-2">
                  Share the link below to invite others!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {loaderData.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
                  >
                    <Avatar className="size-10 bg-primary/10">
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {getInitials(participant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{participant.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleShare}
          disabled={isSharing}
          variant="outline"
          className="w-full py-6 text-lg font-semibold"
        >
          <Share2 className="size-5 mr-2" />
          {isSharing ? 'Copying...' : 'Share Invite Link'}
        </Button>
      </div>
    </div>
  )
}

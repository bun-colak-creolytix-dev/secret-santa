import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
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
import { Share2, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/room/$id')({
  component: RoomPage,
  loader: async ({ params }) => {
    const data = await getRoomWithParticipants({
      // @ts-ignore - TanStack Start types issue
      data: { roomId: params.id },
    })
    return data
  },
})

function RoomPage() {
  const { id } = Route.useParams()
  const loaderData = Route.useLoaderData()
  const router = useRouter()
  const [isSharing, setIsSharing] = useState(false)

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

        // Clear the form
        form.reset()

        // Invalidate the loader to refetch the room data
        router.invalidate()

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
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🎅 {loaderData.room.name} 🎄
          </h1>
          <p className="text-muted-foreground">
            Organized by {loaderData.room.organizerEmail}
          </p>
        </div>

        {/* Join Form Card */}
        <Card>
          <CardHeader className="bg-secondary/5">
            <CardTitle className="text-2xl">✨ Enter the Circle</CardTitle>
            <CardDescription>
              Join the exchange and share your wishlist with your Secret Santa
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
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
                    <Label htmlFor="note">Dear Santa (Gift Ideas & Notes)</Label>
                    <Textarea
                      id="note"
                      placeholder="e.g., I love books, coffee, and cozy socks! Please avoid anything with peanuts."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      Share your interests, hobbies, or gift preferences to help
                      your Secret Santa!
                    </p>
                  </div>
                )}
              </form.Field>

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting ? 'Joining...' : '🎁 Join the Exchange'}
              </Button>
            </form>
          </CardContent>
        </Card>

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

          <CardContent className="pt-6">
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
                      <p className="text-sm text-muted-foreground truncate">
                        {participant.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleShare}
            disabled={isSharing}
            variant="outline"
            className="flex-1 py-6 text-lg font-semibold"
          >
            <Share2 className="size-5 mr-2" />
            {isSharing ? 'Copying...' : 'Share Invite Link'}
          </Button>

          <Button
            onClick={handleDrawNames}
            className="flex-1 py-6 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            <Sparkles className="size-5 mr-2" />
            Draw Names
          </Button>
        </div>
      </div>
    </div>
  )
}

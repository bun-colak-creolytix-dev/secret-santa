import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { createRoom } from '@/functions/rooms'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
      organizerName: '',
      organizerEmail: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const room = await createRoom({
          // @ts-ignore - TanStack Start types issue
          data: {
            name: value.name,
            organizerName: value.organizerName,
            organizerEmail: value.organizerEmail,
          },
        })
        
        // Save creator's participation to localStorage
        try {
          const rooms = JSON.parse(
            localStorage.getItem('secretSanta_rooms') || '[]',
          )
          rooms.push({
            roomId: room.id,
            email: value.organizerEmail,
            name: value.organizerName,
          })
          localStorage.setItem('secretSanta_rooms', JSON.stringify(rooms))
        } catch (error) {
          console.error('Failed to save to localStorage:', error)
        }
        
        // Navigate to the admin page with the admin key
        await navigate({ to: `/room/${room.id}/x/${room.adminKey}` })
      } catch (error) {
        console.error('Failed to create room:', error)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-accent/20">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2 border-l-secondary bg-secondary/5">
          <CardTitle className="text-4xl md:text-5xl text-primary">
            🎅 Secret Santa 🎄
          </CardTitle>
          <CardDescription>
            Create a group, invite friends, and let the elves handle the
            matching.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
            className="space-y-6"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  if (!value || value.length < 3) {
                    return 'Room name must be at least 3 characters'
                  }
                  return undefined
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="name">Room Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Acme Design Team"
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
              name="organizerName"
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
                  <Label htmlFor="organizerName">Your Name</Label>
                  <Input
                    id="organizerName"
                    type="text"
                    placeholder="e.g., Santa Claus"
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
              name="organizerEmail"
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
                  <Label htmlFor="organizerEmail">Your Email</Label>
                  <Input
                    id="organizerEmail"
                    type="email"
                    placeholder="e.g., santa@northpole.com"
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

            <Button
              type="submit"
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting
                ? 'Creating...'
                : '🎄 Create Holiday Room'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

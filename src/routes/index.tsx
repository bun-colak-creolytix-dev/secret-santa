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
      organizerEmail: '',
    },
    onSubmit: async ({ value }) => {
      try {
        const room = await createRoom({
          // @ts-ignore - TanStack Start types issue
          data: {
            name: value.name,
            organizerEmail: value.organizerEmail,
          },
        })
        // Navigate to the newly created room
        await navigate({ to: `/room/${room.id}` })
      } catch (error) {
        console.error('Failed to create room:', error)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-green-50 to-red-50">
      <Card className="w-full max-w-md shadow-xl border-2 border-red-200/50 bg-white/95 backdrop-blur">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl md:text-5xl font-serif text-red-700 tracking-tight">
            Secret Santa 2024
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
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
                    <p className="text-sm text-red-600">
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
                    <p className="text-sm text-red-600">
                      {String(field.state.meta.errors[0])}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <Button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
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

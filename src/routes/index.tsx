import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
 return (
  <div>
    <Button>hello</Button>
    <h1 className='text-2xl font-bold'>Hello World</h1>
  </div>
 )
}

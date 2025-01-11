import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
    <p className='text-2xl font-medium text-sky-700'>
        Home
    </p>

    <Button variant={"destructive"}>
      Click me
    </Button>
    </div>

  )
}

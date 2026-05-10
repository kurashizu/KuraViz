import { SlidePlayer } from '@/components/player/slide-player'
import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense fallback={null}>
      <SlidePlayer />
    </Suspense>
  )
}

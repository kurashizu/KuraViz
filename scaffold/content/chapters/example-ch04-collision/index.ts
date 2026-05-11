import Pg01Overlap from './pg-01-overlap'
import Pg02CanvasOverflow from './pg-02-canvas-overflow'
import Pg03ParentOverflow from './pg-03-parent-overflow'
import Pg04Clean from './pg-04-clean'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'example-ch04-collision',
  title: 'Collision Detection Tests',
  pages: [
    { id: 'pg-01-overlap', component: Pg01Overlap },
    { id: 'pg-02-canvas-overflow', component: Pg02CanvasOverflow },
    { id: 'pg-03-parent-overflow', component: Pg03ParentOverflow },
    { id: 'pg-04-clean', component: Pg04Clean },
  ],
}

export default chapter

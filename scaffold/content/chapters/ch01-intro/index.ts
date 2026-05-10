import Pg01Title from './pg-01-title'
import Pg02Overview from './pg-02-overview'
import Pg03Charts from './pg-03-charts'
import Pg04Showcase from './pg-04-showcase'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch01-intro',
  title: 'Introduction',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-overview', component: Pg02Overview },
    { id: 'pg-03-charts', component: Pg03Charts },
    { id: 'pg-04-showcase', component: Pg04Showcase },
  ],
}

export default chapter

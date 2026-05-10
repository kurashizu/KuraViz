import Pg01Title from './pg-01-title'
import Pg02Overview from './pg-02-overview'
import Pg03Charts from './pg-03-charts'
import Pg04Showcase from './pg-04-showcase'
import Pg05Flowchart from './pg-05-flowchart'
import Pg06Sequence from './pg-06-sequence'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch01-intro',
  title: 'Introduction',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-overview', component: Pg02Overview },
    { id: 'pg-03-charts', component: Pg03Charts },
    { id: 'pg-04-showcase', component: Pg04Showcase },
    { id: 'pg-05-flowchart', component: Pg05Flowchart },
    { id: 'pg-06-sequence', component: Pg06Sequence },
  ],
}

export default chapter

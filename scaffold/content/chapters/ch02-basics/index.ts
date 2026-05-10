import Pg01Title from './pg-01-title'
import Pg02CoreConcept from './pg-02-core-concept'
import Pg03Summary from './pg-03-summary'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch02-basics',
  title: 'Core Concepts',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-core-concept', component: Pg02CoreConcept },
    { id: 'pg-03-summary', component: Pg03Summary },
  ],
}

export default chapter

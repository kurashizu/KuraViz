import Pg01Title from './pg-01-title'
import Pg02Overview from './pg-02-overview'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch01-intro',
  title: 'Introduction',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-overview', component: Pg02Overview },
  ],
}

export default chapter

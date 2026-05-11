import Pg01Title from './pg-01-title'
import Pg02Section from './pg-02-section'
import Pg03Fullwidth from './pg-03-fullwidth'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch01-title-content',
  title: 'Title & Content Pages',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-section', component: Pg02Section },
    { id: 'pg-03-fullwidth', component: Pg03Fullwidth },
  ],
}

export default chapter

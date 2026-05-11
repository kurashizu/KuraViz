import Pg01Title from './pg-01-title'
import Pg02MainSide from './pg-02-main-side'
import Pg03EqualSplit from './pg-03-equal-split'
import Pg04Checklist from './pg-04-checklist'
import Pg05ChecklistContinue from './pg-05-checklist-continue'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'example-ch02-columns-lists',
  title: 'Columns & Lists',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-main-side', component: Pg02MainSide },
    { id: 'pg-03-equal-split', component: Pg03EqualSplit },
    { id: 'pg-04-checklist', component: Pg04Checklist },
    { id: 'pg-05-checklist-continue', component: Pg05ChecklistContinue },
  ],
}

export default chapter

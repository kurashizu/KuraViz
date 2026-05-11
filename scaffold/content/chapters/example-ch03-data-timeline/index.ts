import Pg01Title from './pg-01-title'
import Pg02Chart from './pg-02-chart'
import Pg03Timeline from './pg-03-timeline'
import Pg04Markdown from './pg-04-markdown'
import Pg05MarkdownContinue from './pg-05-markdown-continue'
import Pg06Mermaid from './pg-06-mermaid'
import Pg07SequenceContinue from './pg-07-sequence-continue'
import Pg08MindmapContinue from './pg-08-mindmap-continue'
import Pg09GanttContinue from './pg-09-gantt-continue'
import Pg10ChecklistContinue from './pg-10-checklist-continue'
import type { ChapterDef } from '@/lib/types'

const chapter: ChapterDef = {
  id: 'ch03-data-timeline',
  title: 'Data & Timeline',
  pages: [
    { id: 'pg-01-title', component: Pg01Title },
    { id: 'pg-02-chart', component: Pg02Chart },
    { id: 'pg-03-timeline', component: Pg03Timeline },
    { id: 'pg-04-markdown', component: Pg04Markdown },
    { id: 'pg-05-markdown-continue', component: Pg05MarkdownContinue },
    { id: 'pg-06-mermaid', component: Pg06Mermaid },
    { id: 'pg-07-sequence-continue', component: Pg07SequenceContinue },
    { id: 'pg-08-mindmap-continue', component: Pg08MindmapContinue },
    { id: 'pg-09-gantt-continue', component: Pg09GanttContinue },
    { id: 'pg-10-checklist-continue', component: Pg10ChecklistContinue },
  ],
}

export default chapter

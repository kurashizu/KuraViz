'use client'

import { Anim } from '@/components/anim'
import { Text } from '@/components/text'
import { Cardbox } from '@/components/cardbox'
import { Mermaid } from '@/components/markdown/mermaid'
import { colors } from '@/components/theme'
import { useNarration } from '@/components/player/narration-context'

export default function Pg07SequenceContinue() {
  const { script } = useNarration()
  return (
    <>
      <Anim type="fade-in" delay={0} x={100} y={80} w={1100} h={920}>
        <Cardbox variant="default" x={0} y={0} w={1100} h={920}>
          <Mermaid x={20} y={20} w={1060} h={880} chart={`
sequenceDiagram
    participant U as User
    participant A as App
    participant D as Database
    U->>A: Submit request
    A->>D: Save data
    alt Success
        D-->>A: OK
        A-->>U: Success page
    else Error
        D-->>A: Error
        A-->>U: Error message
    end
          `} />
        </Cardbox>
      </Anim>

      <Anim type="fade-in" delay={200} x={1260} y={80} w={560} h={920}>
        <Cardbox variant="default" x={0} y={0} w={560} h={920}>
          <Text variant="body" x={20} y={25} w={520} style={{ fontWeight: 600, color: colors.brand.accent }}>
            Arrow Types
          </Text>

          <Text variant="caption" x={20} y={80} w={520}>
            Solid arrow (synchronous call):{'\n'}User submits request to App, App saves to Database.
          </Text>

          <Text variant="caption" x={20} y={200} w={520}>
            Dashed arrow (asynchronous response):{'\n'}Database responds with OK, App returns result.
          </Text>

          <Text variant="body" x={20} y={320} w={520} style={{ fontWeight: 600, color: colors.brand.accent }}>
            alt / else Block
          </Text>

          <Text variant="caption" x={20} y={375} w={520} style={{ lineHeight: 1.7 }}>
            The alt/else block shows conditional branching:{'\n'}
            - Success path: Database returns OK, App shows success page{'\n'}
            - Error path: Database returns error, App shows error message
          </Text>

          <Text variant="body" x={20} y={520} w={520} style={{ fontWeight: 600, color: colors.brand.accent }}>
            Participants
          </Text>

          <Text variant="caption" x={20} y={575} w={520} style={{ lineHeight: 1.7 }}>
            Three participants interact:{'\n'}
            - <Text variant="body" as="span" style={{ fontWeight: 600 }}>User</Text> — the end user initiating the request{'\n'}
            - <Text variant="body" as="span" style={{ fontWeight: 600 }}>App</Text> — the application handling logic{'\n'}
            - <Text variant="body" as="span" style={{ fontWeight: 600 }}>Database</Text> — persistent data storage
          </Text>
        </Cardbox>
      </Anim>

      <Text variant="caption" x={360} y={1027} w={1200} style={{ textAlign: 'center' }}>{script}</Text>
    </>
  )
}

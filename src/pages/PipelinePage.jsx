import { Link } from "react-router-dom"

import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import PageHeader from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import ContentFilters from "@/features/contents/ContentFilters"
import KanbanBoard from "@/features/contents/KanbanBoard"
import { useContentFilters } from "@/features/contents/useContentFilters.js"
import { useChannels } from "@/hooks/useChannels.js"
import { useContents } from "@/hooks/useContents.js"
import { brandBtn } from "@/lib/styles.js"

export default function PipelinePage() {
  const { filters, setFilter, params } = useContentFilters()
  const { data: channels } = useChannels()
  // Pipeline menampilkan semua status, jadi filter status tidak dipakai.
  const { data: contents, loading, error, reload } = useContents({
    ...params,
    status: undefined,
  })

  return (
    <>
      <PageHeader title="Pipeline" subtitle="Pantau alur produksi dari ide sampai tayang">
        <Button asChild className={brandBtn}><Link to="/content/new">+ Ide Baru</Link></Button>
      </PageHeader>

      <ContentFilters filters={filters} setFilter={setFilter} channels={channels} showStatus={false} />

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <LoadingBlock className="h-96" />
      ) : contents.length === 0 ? (
        <EmptyState title="Belum ada konten" description="Mulai dengan menambahkan ide pertamamu.">
          <Button asChild className={brandBtn}><Link to="/content/new">+ Ide Baru</Link></Button>
        </EmptyState>
      ) : (
        <KanbanBoard contents={contents} />
      )}
    </>
  )
}

import { Link } from "react-router-dom"

import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingBlock from "@/components/common/LoadingBlock"
import { Button } from "@/components/ui/button"
import { STATUSES } from "@/constant/status.js"
import ContentFilters from "@/features/contents/ContentFilters"
import KanbanBoard from "@/features/contents/KanbanBoard"
import { useContentFilters } from "@/features/contents/useContentFilters.js"
import { useAuth } from "@/hooks/useAuth.js"
import { useChannels } from "@/hooks/useChannels.js"
import { useContents } from "@/hooks/useContents.js"
import { canCreateContent, visibleStatuses } from "@/lib/permissions.js"
import { brandBtn } from "@/lib/styles.js"

export default function PipelinePage() {
  const { user } = useAuth()
  const { filters, setFilter, params } = useContentFilters()
  const { data: channels } = useChannels()
  const { data: contents, loading, error, reload } = useContents({
    ...params,
    status: undefined,
  })

  // Kolom yang tampil mengikuti status yang boleh dilihat role ini.
  const columns = STATUSES.filter((status) => visibleStatuses(user?.role).includes(status.value))

  return (
    <>
      <ContentFilters filters={filters} setFilter={setFilter} channels={channels} showStatus={false} />

      {error ? (
        <ErrorState onRetry={reload} />
      ) : loading ? (
        <LoadingBlock className="h-96" />
      ) : contents.length === 0 ? (
        <EmptyState title="Belum ada konten" description="Belum ada konten yang bisa kamu lihat di pipeline ini.">
          {canCreateContent(user) && (
            <Button nativeButton={false} render={<Link to="/content/new" />} className={brandBtn}>
              + Ide Baru
            </Button>
          )}
        </EmptyState>
      ) : (
        <KanbanBoard contents={contents} statuses={columns} />
      )}
    </>
  )
}

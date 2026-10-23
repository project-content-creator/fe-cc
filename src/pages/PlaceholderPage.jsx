import PageHeader from "@/components/common/PageHeader"
import EmptyState from "@/components/common/EmptyState"

export default function PlaceholderPage({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState title="Halaman ini belum dibuat" description="Akan dikerjakan pada tiket berikutnya." />
    </>
  )
}

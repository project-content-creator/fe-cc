import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FORMATS } from "@/constant/formats"
import { PLATFORMS } from "@/constant/platforms"
import { STATUSES } from "@/constant/status"
import { filterTriggerClass } from "@/lib/styles"

function FilterSelect({ label, value, onChange, allLabel, options }) {
  return (
    <Select value={value || "all"} onValueChange={onChange}>
      <SelectTrigger aria-label={label} className={filterTriggerClass}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default function ContentFilters({ filters, setFilter, channels, showStatus = true }) {
  const channelOptions = channels.map((channel) => ({
    value: String(channel.id),
    label: `${PLATFORMS[channel.platform]?.label} - ${channel.handle_name}`,
  }))

  return (
    <div className="mb-5 flex flex-wrap gap-2.5">
      {showStatus && (
        <FilterSelect
          label="Filter status"
          allLabel="Semua status"
          value={filters.status}
          onChange={(value) => setFilter("status", value)}
          options={STATUSES}
        />
      )}
      <FilterSelect
        label="Filter channel"
        allLabel="Semua channel"
        value={filters.channel_id}
        onChange={(value) => setFilter("channel_id", value)}
        options={channelOptions}
      />
      <FilterSelect
        label="Filter format"
        allLabel="Semua format"
        value={filters.format_type}
        onChange={(value) => setFilter("format_type", value)}
        options={FORMATS}
      />
    </div>
  )
}

export const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]
export const PRIORITY_VALUES = PRIORITIES.map((p) => p.value)
export const PRIORITY_MAP = Object.fromEntries(PRIORITIES.map((p) => [p.value, p]))

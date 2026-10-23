// Memetakan error 422 dari server ke field form. Asumsi: { errors: { field: ["pesan"] } }
export function applyServerErrors(error, setError, fallbackMessage) {
  const response = error.response
  if (response?.status === 422 && response.data?.errors) {
    Object.entries(response.data.errors).forEach(([field, messages]) => {
      setError(field, {
        type: "server",
        message: Array.isArray(messages) ? messages[0] : messages,
      })
    })
    return
  }
  setError("root.server", { type: "server", message: fallbackMessage })
}

// Memetakan error 422 dari server ke field form. 
// Asumsi: { errors: { field: ["pesan"] } }
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

  // Backend be-cc mengirim { status: false, message } untuk error 4xx; tampilkan pesannya.
  const serverMessage = response && response.status < 500 ? response.data?.message : null
  setError("root.server", { type: "server", message: serverMessage ?? fallbackMessage })
}

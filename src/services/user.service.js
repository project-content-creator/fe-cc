import api from "@/lib/api.js"
import { getList, mapConflictToField } from "@/services/helpers.js"

// Semua endpoint ini hanya untuk admin (backend membalas 403 untuk role lain).

// GET /api/v1/user
export const fetchUsers = () => getList("/user")

// POST /api/v1/user { name, email, password, role }
export async function createUser(payload) {
  try {
    await api.post("/user", payload)
  } catch (error) {
    throw mapConflictToField(error, "email")
  }
}

// PUT /api/v1/user/:id { name, email, role, password? }
export async function updateUserById(id, payload) {
  try {
    await api.put(`/user/${id}`, payload)
  } catch (error) {
    throw mapConflictToField(error, "email")
  }
}

// DELETE /api/v1/user/:id
export async function deleteUserById(id) {
  await api.delete(`/user/${id}`)
}

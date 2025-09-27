'use client'

import { useUser } from '@stackframe/stack'

export function useCurrentUser() {
  // This already returns the logged-in user or null if not logged in
  const user = useUser()
  return user
}

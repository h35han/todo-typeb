import {
  useEffect,
  useLayoutEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react"

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState(initialValue)
  const [ready, setReady] = useState(false)

  useIsomorphicLayoutEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) {
        const parsed = JSON.parse(stored) as T
        if (typeof parsed === typeof initialValue) {
          setValue(parsed)
        }
      }
    } catch {
      // Ignore unavailable or malformed storage.
    } finally {
      setReady(true)
    }
  }, [key])

  useEffect(() => {
    if (!ready) return

    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore storage failures such as private mode or quota limits.
    }
  }, [key, value, ready])

  return [value, setValue, ready]
}

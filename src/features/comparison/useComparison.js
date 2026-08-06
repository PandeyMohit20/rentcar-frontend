import { useCallback, useMemo } from 'react'
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux'
import {
  addToComparison,
  removeFromComparison,
  clearComparison,
  comparisonLimit,
} from '@/redux/slices/comparisonSlice'
import { useToast } from '@/contexts/ToastContext'

/**
 * Comparison hook wrapping the persisted comparison slice.
 */
export function useComparison() {
  const dispatch = useAppDispatch()
  const { showSuccess, showWarning } = useToast()
  const carIds = useAppSelector((state) => state.comparison.carIds)

  const isCompared = useCallback((carId) => carIds.includes(carId), [carIds])
  const canAdd = carIds.length < comparisonLimit

  const add = useCallback(
    (carId, label = 'Car') => {
      if (carIds.includes(carId)) return
      if (carIds.length >= comparisonLimit) {
        showWarning(`You can compare up to ${comparisonLimit} cars.`)
        return
      }
      dispatch(addToComparison(carId))
      showSuccess(`${label} added to comparison.`)
    },
    [carIds, dispatch, showSuccess, showWarning]
  )

  const remove = useCallback(
    (carId) => {
      dispatch(removeFromComparison(carId))
    },
    [dispatch]
  )

  const toggle = useCallback(
    (carId, label) => {
      if (isCompared(carId)) remove(carId)
      else add(carId, label)
    },
    [isCompared, add, remove]
  )

  const clear = useCallback(() => {
    dispatch(clearComparison())
  }, [dispatch])

  return useMemo(
    () => ({ carIds, isCompared, canAdd, add, remove, toggle, clear, comparisonLimit }),
    [carIds, isCompared, canAdd, add, remove, toggle, clear]
  )
}

export default useComparison

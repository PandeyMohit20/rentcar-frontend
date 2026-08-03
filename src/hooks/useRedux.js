import { useDispatch, useSelector } from 'react-redux'

/**
 * Pre-typed Redux hooks. Provides typed dispatch and selector.
 */
export const useAppDispatch = () => useDispatch()

export const useAppSelector = useSelector

export default useAppSelector

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isBetween from 'dayjs/plugin/isBetween'
import { DATE_FORMAT, DATE_TIME_FORMAT, TIME_FORMAT } from '@/constants/app'

dayjs.extend(relativeTime)
dayjs.extend(advancedFormat)
dayjs.extend(isBetween)

/**
 * Collection of date formatting helpers built on dayjs.
 */
export const formatDate = (date, format = DATE_FORMAT) => dayjs(date).format(format)

export const formatDateTime = (date, format = DATE_TIME_FORMAT) => dayjs(date).format(format)

export const formatTime = (date, format = TIME_FORMAT) => dayjs(date).format(format)

export const fromNow = (date) => dayjs(date).fromNow()

export const isDateBetween = (date, start, end) => dayjs(date).isBetween(start, end)

export const addDays = (date, days) => dayjs(date).add(days, 'day').toISOString()

export const addHours = (date, hours) => dayjs(date).add(hours, 'hour').toISOString()

export const differenceInDays = (start, end) => dayjs(end).diff(start, 'day')

export const differenceInHours = (start, end) => dayjs(end).diff(start, 'hour')

export default dayjs

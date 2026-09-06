import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const BUSINESS_TIMEZONE = 'Asia/Kolkata'

export const combineDateTimeInBusinessTimezone = (date, time) => {
  if (!date || !time) return null
  const value = dayjs.tz(`${date}T${time}:00`, BUSINESS_TIMEZONE)
  return value.isValid() ? value : null
}

export const toApiDateTime = (date, time) =>
  combineDateTimeInBusinessTimezone(date, time)?.format('YYYY-MM-DDTHH:mm:ssZ') || null

export const parseApiDateTime = (value) => {
  if (!value) return { date: '', time: '' }
  const parsed = dayjs(value).tz(BUSINESS_TIMEZONE)
  return parsed.isValid()
    ? { date: parsed.format('YYYY-MM-DD'), time: parsed.format('HH:mm') }
    : { date: '', time: '' }
}

export const formatBusinessDateTime = (value) => {
  const parsed = dayjs(value).tz(BUSINESS_TIMEZONE)
  return parsed.isValid() ? parsed.format('DD MMM YYYY, hh:mm A [IST]') : '—'
}

export const validateBusinessInterval = (pickup, returnValue) => {
  if (!pickup || !returnValue) return 'Select both pickup and return date and time.'
  const start = dayjs(pickup)
  const end = dayjs(returnValue)
  if (!start.isValid() || !end.isValid()) return 'Enter a valid pickup and return time.'
  if (!end.isAfter(start)) return 'Return must be after pickup.'
  if (start.isBefore(dayjs().subtract(1, 'minute'))) return 'Pickup time cannot be in the past.'
  return null
}

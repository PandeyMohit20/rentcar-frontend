import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'
import { Box, Typography, IconButton, Stack, Tooltip } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import dayjs from 'dayjs'

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

/**
 * Lightweight availability calendar.
 * Highlights blocked, available, holiday and selected dates.
 */
function AvailabilityCalendar({
  blockedDates = [],
  availableDates = [],
  holidays = [],
  minBookingDays = 1,
  maxBookingDays = 90,
  selectedDate = null,
  onSelectDate,
}) {
  const [cursor, setCursor] = useState(() => dayjs().startOf('month'))

  const blockedSet = useMemo(
    () => new Set(blockedDates.map((d) => dayjs(d).format('YYYY-MM-DD'))),
    [blockedDates]
  )
  const availableSet = useMemo(
    () => new Set(availableDates.map((d) => dayjs(d).format('YYYY-MM-DD'))),
    [availableDates]
  )
  const holidaySet = useMemo(
    () => new Set(holidays.map((d) => dayjs(d).format('YYYY-MM-DD'))),
    [holidays]
  )

  const daysInMonth = cursor.daysInMonth()
  const startOffset = cursor.day()
  const cells = [
    ...Array.from({ length: startOffset }, (_, i) => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const shiftMonth = (delta) => setCursor((prev) => prev.add(delta, 'month'))

  const handleClick = (day) => {
    const dateKey = cursor.date(day).format('YYYY-MM-DD')
    const isBlocked = blockedSet.has(dateKey)
    if (!isBlocked && onSelectDate) onSelectDate(dateKey)
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <IconButton size="small" aria-label="Previous month" onClick={() => shiftMonth(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1">{cursor.format('MMMM YYYY')}</Typography>
        <IconButton size="small" aria-label="Next month" onClick={() => shiftMonth(1)}>
          <ChevronRightIcon />
        </IconButton>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 0.5,
          textAlign: 'center',
        }}
      >
        {WEEKDAYS.map((day) => (
          <Typography key={day} variant="caption" color="text.secondary">
            {day}
          </Typography>
        ))}
        {cells.map((day, index) => {
          if (day === null) return <Box key={`empty-${index}`} />
          const dateKey = cursor.date(day).format('YYYY-MM-DD')
          const isBlocked = blockedSet.has(dateKey)
          const isAvailable = availableSet.has(dateKey)
          const isHoliday = holidaySet.has(dateKey)
          const isToday = dateKey === dayjs().format('YYYY-MM-DD')
          const isSelected = dateKey === selectedDate

          let bg = 'background.paper'
          let color = 'text.primary'
          if (isSelected) {
            bg = 'primary.main'
            color = 'primary.contrastText'
          } else if (isBlocked) {
            bg = 'error.light'
            color = 'error.contrastText'
          } else if (isAvailable) {
            bg = 'success.light'
            color = 'success.contrastText'
          } else if (isHoliday) {
            bg = 'warning.light'
            color = 'warning.contrastText'
          } else if (isToday) {
            bg = 'divider'
          }

          return (
            <Tooltip
              key={dateKey}
              title={
                isBlocked
                  ? 'Blocked'
                  : isHoliday
                    ? 'Holiday'
                    : isAvailable
                      ? 'Available'
                      : 'Not available'
              }
            >
              <Box
                onClick={() => handleClick(day)}
                role="button"
                tabIndex={0}
                aria-label={dateKey}
                aria-disabled={isBlocked}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleClick(day)
                }}
                sx={{
                  bgcolor: bg,
                  color,
                  borderRadius: 1,
                  py: 0.75,
                  cursor: isBlocked ? 'not-allowed' : 'pointer',
                  opacity: isBlocked ? 0.55 : 1,
                  '&:hover': { filter: isBlocked ? 'none' : 'brightness(0.95)' },
                }}
              >
                {day}
              </Box>
            </Tooltip>
          )
        })}
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
        <LegendSwatch label="Available" color="success.light" />
        <LegendSwatch label="Blocked" color="error.light" />
        <LegendSwatch label="Holiday" color="warning.light" />
      </Stack>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Min booking: {minBookingDays} days • Max booking: {maxBookingDays} days
      </Typography>
    </Box>
  )
}

function LegendSwatch({ label, color }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <Box sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: color }} />
      <Typography variant="caption">{label}</Typography>
    </Stack>
  )
}

LegendSwatch.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
}

AvailabilityCalendar.propTypes = {
  blockedDates: PropTypes.arrayOf(PropTypes.string),
  availableDates: PropTypes.arrayOf(PropTypes.string),
  holidays: PropTypes.arrayOf(PropTypes.string),
  minBookingDays: PropTypes.number,
  maxBookingDays: PropTypes.number,
  selectedDate: PropTypes.string,
  onSelectDate: PropTypes.func,
}

export default AvailabilityCalendar

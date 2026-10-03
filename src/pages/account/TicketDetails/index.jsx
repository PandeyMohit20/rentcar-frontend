import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SendIcon from '@mui/icons-material/Send'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm, Controller, FormProvider } from 'react-hook-form'

import { AccountPageShell } from '@/components/account'
import { useTicketDetails, useReplyToTicket } from '@/features/support'
import { useToast } from '@/contexts/ToastContext'
import LoadingButton from '@/components/buttons/LoadingButton'
import { ROUTES } from '@/constants/routes'

const STATUS_LABELS = {
  open: 'Open',
  pending: 'Pending',
  resolved: 'Resolved',
  closed: 'Closed',
  reopened: 'Reopened',
}

const STATUS_COLORS = {
  open: 'success',
  pending: 'warning',
  resolved: 'info',
  closed: 'default',
  reopened: 'success',
}

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

function formatTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getDateKey(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-IN')
}

function formatDateSeparator(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ''

  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const dateKey = getDateKey(date)
  const todayKey = getDateKey(today)
  const yesterdayKey = getDateKey(yesterday)

  if (dateKey === todayKey) return 'Today'
  if (dateKey === yesterdayKey) return 'Yesterday'

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function TicketDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const messagesEndRef = useRef(null)
  const [replyError, setReplyError] = useState('')

  const { data: ticketData, isLoading, isError, error } = useTicketDetails(id)

  const reply = useReplyToTicket()

  const ticket = useMemo(
    () => (ticketData && typeof ticketData === 'object' ? ticketData : {}),
    [ticketData]
  )

  const messages = useMemo(
    () => (Array.isArray(ticket.messages) ? ticket.messages : []),
    [ticket.messages]
  )

  const methods = useForm({
    defaultValues: {
      message: '',
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }, [messages.length])

  const handleReply = async (values) => {
    const message = values.message.trim()

    if (!message) return

    setReplyError('')

    try {
      await reply.mutateAsync({
        id,
        message,
      })

      showSuccess('Message sent.')
      methods.reset()
    } catch (requestError) {
      const messageText =
        requestError?.response?.data?.message || requestError?.message || 'Failed to send message.'

      setReplyError(messageText)
      showError(messageText)
    }
  }

  if (isError) {
    return (
      <AccountPageShell title="Support" description="Unable to load this conversation.">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.response?.data?.message ||
            error?.message ||
            'Unable to load this support ticket.'}
        </Alert>

        <LoadingButton variant="outlined" onClick={() => navigate(ROUTES.ACCOUNT_SUPPORT)}>
          Back to Support
        </LoadingButton>
      </AccountPageShell>
    )
  }

  const isClosed = ticket.status === 'closed'
  const statusLabel = STATUS_LABELS[ticket.status] || ticket.status || 'Open'
  const statusColor = STATUS_COLORS[ticket.status] || 'default'

  return (
    <AccountPageShell title="Support" description="Chat with our support team.">
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          border: 1,
          borderColor: 'divider',
          borderRadius: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          height: {
            xs: 'calc(100vh - 180px)',
            sm: 'min(720px, calc(100vh - 220px))',
          },
          minHeight: 520,
          bgcolor: 'background.paper',
        }}
      >
        {/* Chat Header */}
        <Box
          sx={{
            px: { xs: 1.5, sm: 2 },
            py: 1.25,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <IconButton
              size="small"
              onClick={() => navigate(ROUTES.ACCOUNT_SUPPORT)}
              aria-label="Back to support tickets"
            >
              <ArrowBackIcon />
            </IconButton>

            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: 'primary.main',
              }}
            >
              <SupportAgentIcon />
            </Avatar>

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>
                Support Team
              </Typography>

              <Typography variant="caption" color="text.secondary" noWrap>
                {isLoading ? 'Loading conversation…' : ticket.ticketNumber || `Ticket ${id}`}
              </Typography>
            </Box>

            {!isLoading && (
              <Stack direction="row" spacing={0.75} alignItems="center" sx={{ flexShrink: 0 }}>
                <Chip size="small" label={statusLabel} color={statusColor} variant="outlined" />

                {ticket.priority && (
                  <Chip
                    size="small"
                    label={PRIORITY_LABELS[ticket.priority] || ticket.priority}
                    sx={{
                      display: { xs: 'none', sm: 'inline-flex' },
                    }}
                  />
                )}
              </Stack>
            )}
          </Stack>

          {!isLoading && ticket.subject && (
            <Box
              sx={{
                mt: 1,
                ml: { xs: 6, sm: 6.5 },
                mr: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600} noWrap>
                {ticket.subject}
              </Typography>

              {ticket.description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: 'block',
                    mt: 0.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {ticket.description}
                </Typography>
              )}
            </Box>
          )}
        </Box>

        {/* Conversation */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 1, sm: 2 },
            py: 2,
            bgcolor: 'action.hover',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                flex: 1,
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Typography color="text.secondary">Loading messages…</Typography>
            </Box>
          ) : messages.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: 'grid',
                placeItems: 'center',
                textAlign: 'center',
                px: 3,
              }}
            >
              <Box>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    mx: 'auto',
                    mb: 1.5,
                    bgcolor: 'action.selected',
                    color: 'text.secondary',
                  }}
                >
                  <SupportAgentIcon fontSize="large" />
                </Avatar>

                <Typography fontWeight={600}>No messages yet</Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Send a message to start the conversation.
                </Typography>
              </Box>
            </Box>
          ) : (
            <Stack spacing={0.5}>
              {messages.map((msg, index) => {
                const isStaff = Boolean(msg.isStaff)
                const previousMessage = messages[index - 1]
                const showDate =
                  index === 0 ||
                  getDateKey(previousMessage?.createdAt) !== getDateKey(msg.createdAt)

                return (
                  <Box key={msg.id || `${msg.createdAt}-${index}`}>
                    {showDate && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          my: 1.5,
                        }}
                      >
                        <Chip
                          size="small"
                          label={formatDateSeparator(msg.createdAt)}
                          sx={{
                            bgcolor: 'background.paper',
                            fontSize: '0.72rem',
                          }}
                        />
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: isStaff ? 'flex-start' : 'flex-end',
                        mb: 0.75,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'flex-end',
                          gap: 0.75,
                          maxWidth: {
                            xs: '88%',
                            sm: '72%',
                          },
                        }}
                      >
                        {isStaff && (
                          <Avatar
                            sx={{
                              width: 30,
                              height: 30,
                              bgcolor: 'primary.main',
                            }}
                          >
                            <SupportAgentIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                        )}

                        <Box
                          sx={{
                            px: 1.5,
                            py: 1,
                            borderRadius: isStaff ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                            bgcolor: isStaff ? 'background.paper' : 'primary.main',
                            color: isStaff ? 'text.primary' : 'primary.contrastText',
                            boxShadow: 1,
                            minWidth: 80,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              fontWeight: 700,
                              mb: 0.35,
                              color: isStaff ? 'primary.main' : 'inherit',
                            }}
                          >
                            {isStaff ? 'Support Team' : 'You'}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              whiteSpace: 'pre-wrap',
                              overflowWrap: 'anywhere',
                              lineHeight: 1.5,
                            }}
                          >
                            {msg.message || msg.body || ''}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              textAlign: 'right',
                              mt: 0.35,
                              opacity: 0.65,
                              fontSize: '0.68rem',
                            }}
                          >
                            {formatTime(msg.createdAt)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                )
              })}

              <div ref={messagesEndRef} />
            </Stack>
          )}
        </Box>

        {/* Composer */}
        {isClosed ? (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
              <LockOutlinedIcon fontSize="small" color="disabled" />
              <Typography variant="body2" color="text.secondary">
                This ticket is closed and cannot receive new messages.
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Box
            sx={{
              px: { xs: 1, sm: 1.5 },
              py: 1,
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            {replyError && (
              <Alert severity="error" sx={{ mb: 1 }} onClose={() => setReplyError('')}>
                {replyError}
              </Alert>
            )}

            <FormProvider {...methods}>
              <Box component="form" onSubmit={methods.handleSubmit(handleReply)}>
                <Controller
                  name="message"
                  control={methods.control}
                  rules={{
                    required: 'Please enter a message.',
                    maxLength: {
                      value: 10000,
                      message: 'Message cannot exceed 10,000 characters.',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      maxRows={5}
                      placeholder="Type a message"
                      size="small"
                      error={Boolean(fieldState.error)}
                      helperText={fieldState.error?.message}
                      disabled={reply.isPending}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <LoadingButton
                                type="submit"
                                loading={reply.isPending}
                                disabled={!field.value?.trim()}
                                variant="contained"
                                sx={{
                                  minWidth: 42,
                                  width: 42,
                                  height: 42,
                                  borderRadius: '50%',
                                  p: 0,
                                }}
                                aria-label="Send message"
                              >
                                <SendIcon fontSize="small" />
                              </LoadingButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  )}
                />
              </Box>
            </FormProvider>
          </Box>
        )}
      </Paper>
    </AccountPageShell>
  )
}

export default TicketDetailsPage

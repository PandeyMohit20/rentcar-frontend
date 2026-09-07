import { Link, useLocation } from 'react-router-dom'
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ACCOUNT_NAV from './navigation'

function Sidebar({ onNavigate, width = 240 }) {
  const { pathname } = useLocation()
  return (
    <Box
      component="nav"
      aria-label="Account navigation"
      sx={{ width, maxWidth: '100%', flexShrink: 0, p: 2 }}
    >
      <Typography variant="overline" color="text.secondary" sx={{ px: 1.5 }}>
        Your account
      </Typography>
      <List sx={{ mt: 1 }}>
        {ACCOUNT_NAV.flatMap((group) => group.items).map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + '/')
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              selected={active}
              aria-current={active ? 'page' : undefined}
              onClick={onNavigate}
              sx={{ borderRadius: 2, minHeight: 48, mb: 0.75 }}
            >
              <ListItemIcon
                sx={{ minWidth: 36, color: active ? 'primary.main' : 'text.secondary' }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{ primary: { fontWeight: active ? 700 : 500 } }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}
export default Sidebar

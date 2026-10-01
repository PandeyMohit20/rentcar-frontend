import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined'
import { Link } from 'react-router-dom'
import Brand from '@/components/common/Brand'
import { ROUTES } from '@/constants/routes'
import { useTheme } from '@/contexts/ThemeContext'
import { useWalletBalance } from '@/features/wallet'

function formatWalletAmount(value) {
  const amount = Number(value ?? 0)

  if (!Number.isFinite(amount)) {
    return '₹0.00'
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

function Topbar({ onMenuClick, menuOpen }) {
  const { mode, toggleTheme } = useTheme()
  const wallet = useWalletBalance()

  const walletAmount = formatWalletAmount(
    wallet.data?.balance ?? wallet.data?.wallet?.balance ?? wallet.data?.availableBalance ?? 0
  )

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar
        sx={{
          gap: 1,
          minHeight: { xs: 64, sm: 68 },
          px: { xs: 1.5, sm: 3 },
        }}
      >
        <IconButton
          color="inherit"
          aria-label="Open account navigation"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? 'account-mobile-navigation' : undefined}
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Button
          component={Link}
          to={ROUTES.HOME}
          color="inherit"
          sx={{
            fontWeight: 800,
            fontSize: '1.15rem',
            px: { xs: 0.5, sm: 1 },
            minWidth: 0,
          }}
        >
          <Brand />
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          component={Link}
          to={ROUTES.WALLET}
          color="inherit"
          aria-label="Open wallet"
          sx={{
            minWidth: 0,
            px: { xs: 1, sm: 1.5 },
            py: 0.75,
            border: 1,
            borderColor: 'divider',
            borderRadius: 2.5,
            textTransform: 'none',
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'action.hover',
              borderColor: 'primary.main',
            },
          }}
        >
          <AccountBalanceWalletOutlinedIcon
            sx={{
              mr: { xs: 0, sm: 0.8 },
              fontSize: 21,
              color: 'primary.main',
            }}
          />

          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              flexDirection: 'column',
              alignItems: 'flex-start',
              lineHeight: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                fontSize: 10,
                color: 'text.secondary',
                lineHeight: 1.1,
              }}
            >
              Wallet
            </Typography>

            {wallet.isPending ? (
              <CircularProgress size={13} sx={{ mt: 0.4 }} />
            ) : (
              <Typography
                component="span"
                sx={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: 'text.primary',
                  lineHeight: 1.25,
                }}
              >
                {walletAmount}
              </Typography>
            )}
          </Box>
        </Button>

        <IconButton
          onClick={toggleTheme}
          aria-label={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>

        <Button
          component={Link}
          to={ROUTES.SEARCH}
          variant="outlined"
          size="small"
          sx={{
            display: { xs: 'none', sm: 'inline-flex' },
            whiteSpace: 'nowrap',
          }}
        >
          Find a car
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Topbar

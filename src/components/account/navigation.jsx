import DashboardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import LuggageIcon from '@mui/icons-material/Luggage'
import RouteIcon from '@mui/icons-material/Route'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FavoriteIcon from '@mui/icons-material/Favorite'
import NotificationsIcon from '@mui/icons-material/Notifications'
import RateReviewIcon from '@mui/icons-material/RateReview'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import ShareIcon from '@mui/icons-material/Share'
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard'
import SettingsIcon from '@mui/icons-material/Settings'
import SecurityIcon from '@mui/icons-material/Security'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'
import DevicesIcon from '@mui/icons-material/Devices'
import FolderIcon from '@mui/icons-material/Folder'
import { ROUTES } from '@/constants/routes'

/**
 * Account area navigation menu.
 * Grouped sections for the sidebar.
 */
export const ACCOUNT_NAV = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', to: ROUTES.DASHBOARD, icon: <DashboardIcon /> }],
  },
  {
    section: 'Account',
    items: [
      { label: 'My Profile', to: ROUTES.MY_PROFILE, icon: <PersonIcon /> },
      { label: 'KYC', to: ROUTES.KYC, icon: <BadgeIcon /> },
      { label: 'Driving License', to: ROUTES.DRIVING_LICENSE, icon: <BadgeIcon /> },
      { label: 'Documents', to: ROUTES.DOCUMENTS, icon: <FolderIcon /> },
    ],
  },
  {
    section: 'Money',
    items: [
      { label: 'My Wallet', to: ROUTES.WALLET, icon: <CreditCardIcon /> },
      { label: 'Wallet History', to: ROUTES.WALLET_HISTORY, icon: <CreditCardIcon /> },
      { label: 'Rewards', to: ROUTES.REWARDS, icon: <CardGiftcardIcon /> },
      { label: 'Referral', to: ROUTES.REFERRAL, icon: <ShareIcon /> },
    ],
  },
  {
    section: 'Trips',
    items: [
      { label: 'My Bookings', to: ROUTES.MY_BOOKINGS, icon: <LuggageIcon /> },
      { label: 'Trip History', to: ROUTES.TRIP_HISTORY, icon: <RouteIcon /> },
      { label: 'Saved Addresses', to: ROUTES.SAVED_ADDRESSES, icon: <LocationOnIcon /> },
      { label: 'Wishlist', to: ROUTES.ACCOUNT_WISHLIST, icon: <FavoriteIcon /> },
    ],
  },
  {
    section: 'Engage',
    items: [
      { label: 'Notifications', to: ROUTES.ACCOUNT_NOTIFICATIONS, icon: <NotificationsIcon /> },
      { label: 'Reviews', to: ROUTES.REVIEWS, icon: <RateReviewIcon /> },
      { label: 'Support', to: ROUTES.ACCOUNT_SUPPORT, icon: <SupportAgentIcon /> },
    ],
  },
  {
    section: 'Preferences',
    items: [
      { label: 'Settings', to: ROUTES.ACCOUNT_SETTINGS, icon: <SettingsIcon /> },
      { label: 'Security', to: ROUTES.SECURITY, icon: <SecurityIcon /> },
      { label: 'Privacy', to: ROUTES.PRIVACY, icon: <PrivacyTipIcon /> },
      { label: 'My Devices', to: ROUTES.DEVICES, icon: <DevicesIcon /> },
    ],
  },
]

export default ACCOUNT_NAV

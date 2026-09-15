import { useState } from 'react'
import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded'
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded'
import ImageLazy from './ImageLazy'

export default function ImageGallery({ images = [], alt }) {
  const [selected, setSelected] = useState(0)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(false)
  const available = images.filter((image) => image.url)
  const index = Math.min(selected, Math.max(0, available.length - 1))
  const current = available[index]
  const move = (direction) => {
    setSelected((index + direction + available.length) % available.length)
    setZoom(false)
  }
  const controls = available.length > 1 && (
    <Stack direction="row" spacing={1} alignItems="center">
      <IconButton aria-label="Previous photo" onClick={() => move(-1)}>
        <ArrowBackRoundedIcon />
      </IconButton>
      <Typography variant="caption" role="status">
        {index + 1} / {available.length}
      </Typography>
      <IconButton aria-label="Next photo" onClick={() => move(1)}>
        <ArrowForwardRoundedIcon />
      </IconButton>
    </Stack>
  )
  return (
    <Box>
      <Box
        sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', bgcolor: 'action.hover' }}
      >
        <ImageLazy src={current?.url} alt={current?.alt || alt} ratio="4/3" />
        {current && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<OpenInFullRoundedIcon />}
            onClick={() => setOpen(true)}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              bgcolor: 'background.paper',
              color: 'text.primary',
            }}
          >
            View photos
          </Button>
        )}
      </Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {available.length ? 'Explore your next drive' : 'Vehicle photos are unavailable'}
        </Typography>
        {controls}
      </Stack>
      {available.length > 1 && (
        <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
          {available.map((image, i) => (
            <ButtonBase
              key={image.id || `${image.url}-${i}`}
              aria-label={`View photo ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => {
                setSelected(i)
                setZoom(false)
              }}
              sx={{
                flex: '0 0 88px',
                borderRadius: 1,
                overflow: 'hidden',
                border: 2,
                borderColor: i === index ? 'primary.main' : 'transparent',
              }}
            >
              <ImageLazy src={image.url} alt={image.alt || `${alt}, photo ${i + 1}`} ratio="4/3" />
            </ButtonBase>
          ))}
        </Stack>
      )}
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
          setZoom(false)
        }}
        fullWidth
        maxWidth="lg"
        aria-labelledby="vehicle-gallery-title"
        onKeyDown={(event) => {
          if (available.length > 1 && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault()
            move(event.key === 'ArrowLeft' ? -1 : 1)
          }
        }}
      >
        <DialogTitle
          id="vehicle-gallery-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}
        >
          {alt}
          <IconButton
            aria-label="Close gallery"
            onClick={() => {
              setOpen(false)
              setZoom(false)
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ overflow: 'auto', maxHeight: '70dvh', bgcolor: 'action.hover' }}>
            <Box sx={{ width: zoom ? '180%' : '100%' }}>
              <ImageLazy
                src={current?.url}
                alt={current?.alt || alt}
                ratio="4/3"
                sx={{ '& img': { objectFit: 'contain' } }}
              />
            </Box>
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pt: 1 }}>
            {controls}
            <Button
              startIcon={<ZoomInRoundedIcon />}
              aria-pressed={zoom}
              onClick={() => setZoom(!zoom)}
            >
              {zoom ? 'Fit photo' : 'Zoom in'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

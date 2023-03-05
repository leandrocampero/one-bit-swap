import { Backdrop, Box, CircularProgress, SxProps } from '@mui/material'

export default function BaseLayout({
  children,
  style,
  loading = false,
}: {
  children: React.ReactElement | React.ReactElement[]
  style?: SxProps
  loading?: boolean
}) {
  return (
    <Box paddingY={12} paddingX={4} height={'100vh'} sx={style}>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {children}
    </Box>
  )
}

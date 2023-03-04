import { Box, SxProps } from '@mui/material'

export default function BaseLayout({
  children,
  style,
}: {
  children: React.ReactElement | React.ReactElement[]
  style?: SxProps
}) {
  return (
    <>
      <Box paddingY={12} paddingX={4} height={'100vh'} sx={style}>
        {children}
      </Box>
    </>
  )
}

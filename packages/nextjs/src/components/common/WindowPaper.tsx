import styled from '@emotion/styled'
import { Paper, PaperProps } from '@mui/material'
import { blueGrey } from '@mui/material/colors'

const CustomPaper = styled(Paper)`
  height: calc(
    100vh - (96px + 32px) - (48px + 24px * 2) - (56px + 24px * 2 + 4px)
  );
  width: 100%;
  overflow-y: auto;
`

const WindowPaper = ({ children, sx }: PaperProps) => (
  <CustomPaper
    sx={{
      ...sx,
      backgroundColor: 'transparent',
      paddingRight: 1,
      '&::-webkit-scrollbar': {
        width: 4,
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: blueGrey[200],
      },
    }}
    elevation={0}
  >
    {children}
  </CustomPaper>
)

export default WindowPaper

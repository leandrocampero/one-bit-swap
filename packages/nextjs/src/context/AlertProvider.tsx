//**************************************************************************//
//                                                                          //
//            ###                                                           //
//             #   #    #  #####    ####   #####   #####   ####             //
//             #   ##  ##  #    #  #    #  #    #    #    #                 //
//             #   # ## #  #    #  #    #  #    #    #     ####             //
//             #   #    #  #####   #    #  #####     #         #            //
//             #   #    #  #       #    #  #   #     #    #    #            //
//            ###  #    #  #        ####   #    #    #     ####             //
//                                                                          //
//**************************************************************************//
import { AppProps } from '@/types'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from 'react'

//**************************************************************************//
//                                                                          //
// ######                                                                   //
// #     #  ######  ######  #  #    #  #  #####  #   ####   #    #   ####   //
// #     #  #       #       #  ##   #  #    #    #  #    #  ##   #  #       //
// #     #  #####   #####   #  # #  #  #    #    #  #    #  # #  #   ####   //
// #     #  #       #       #  #  # #  #    #    #  #    #  #  # #       #  //
// #     #  #       #       #  #   ##  #    #    #  #    #  #   ##  #    #  //
// ######   ######  #       #  #    #  #    #    #   ####   #    #   ####   //
//                                                                          //
//**************************************************************************//

type AlertType = 'error' | 'info' | 'success' | 'warning'

export type AlertContextProps = {
  newAlert: (type: AlertType, message: string) => void
  closeAlert: () => void
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

//**************************************************************************//
//                                                                          //
//           #####                                                          //
//          #     #   ####   #    #  #####  ######  #    #  #####           //
//          #        #    #  ##   #    #    #        #  #     #             //
//          #        #    #  # #  #    #    #####     ##      #             //
//          #        #    #  #  # #    #    #         ##      #             //
//          #     #  #    #  #   ##    #    #        #  #     #             //
//           #####    ####   #    #    #    ######  #    #    #             //
//                                                                          //
//**************************************************************************//
export const AlertContext = createContext<AlertContextProps>(
  {} as AlertContextProps
)

//**************************************************************************//
//                                                                          //
//        ######                                                            //
//        #     #  #####    ####   #    #  #  #####   ######  #####         //
//        #     #  #    #  #    #  #    #  #  #    #  #       #    #        //
//        ######   #    #  #    #  #    #  #  #    #  #####   #    #        //
//        #        #####   #    #  #    #  #  #    #  #       #####         //
//        #        #   #   #    #   #  #   #  #    #  #       #   #         //
//        #        #    #   ####     ##    #  #####   ######  #    #        //
//                                                                          //
//**************************************************************************//

export const AlertProvider = (props: AppProps) => {
  const [alert, setAlert] = useState<boolean>(false)
  const [message, setMessage] = useState<string | undefined>(undefined)
  const [type, setType] = useState<AlertType | undefined>(undefined)

  //**************************************************************************//
  //                                                                          //
  //  #####                                                                   //
  // #     #    ##    #       #       #####     ##     ####   #    #   ####   //
  // #         #  #   #       #       #    #   #  #   #    #  #   #   #       //
  // #        #    #  #       #       #####   #    #  #       ####     ####   //
  // #        ######  #       #       #    #  ######  #       #  #         #  //
  // #     #  #    #  #       #       #    #  #    #  #    #  #   #   #    #  //
  //  #####   #    #  ######  ######  #####   #    #   ####   #    #   ####   //
  //                                                                          //
  //**************************************************************************//

  const newAlert = useCallback((type: AlertType, message: string) => {
    setMessage(message)
    setType(type)
    setAlert(true)
  }, [])

  const closeAlert = useCallback(() => {
    setAlert(false)
    setMessage(undefined)
    setType(undefined)
  }, [])

  //**************************************************************************//

  return (
    <AlertContext.Provider
      value={{
        newAlert,
        closeAlert,
      }}
    >
      <Snackbar
        open={alert}
        onClose={closeAlert}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ width: '40%' }}
      >
        <Alert onClose={closeAlert} severity={type} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {props.children}
    </AlertContext.Provider>
  )
}

//**************************************************************************//
//                                                                          //
//       #     #                      #     #                               //
//       #     #   ####   ######      #     #   ####    ####   #    #       //
//       #     #  #       #           #     #  #    #  #    #  #   #        //
//       #     #   ####   #####       #######  #    #  #    #  ####         //
//       #     #       #  #           #     #  #    #  #    #  #  #         //
//       #     #  #    #  #           #     #  #    #  #    #  #   #        //
//        #####    ####   ######      #     #   ####    ####   #    #       //
//                                                                          //
//**************************************************************************//
export const useAlertContext = () => useContext(AlertContext)

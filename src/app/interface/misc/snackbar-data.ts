import { SnackbarType } from 'src/app/enums/snackbar-type.enum';

export interface SnackbarEvent {
  message: string;
  timeout: number;
  type: SnackbarType;
  callBackButtonTitle: string;
  callBack?: Function;
 
}

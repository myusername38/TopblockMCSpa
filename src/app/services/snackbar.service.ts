import { Injectable } from '@angular/core';
import { SnackbarEvent } from '../interface/misc/snackbar-data';
import { BehaviorSubject } from 'rxjs';
import { SnackbarType } from '../enums/snackbar-type.enum';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  snackbarEvents: BehaviorSubject<SnackbarEvent> = new BehaviorSubject(null);

  constructor(
  ) {}

  showSnackbar(description: string, type: SnackbarType, duration: number = 0) {
    this.snackbarEvents.next({
      message: description,
      timeout: duration, 
      type,
      callBackButtonTitle: ''
    })
  }
  // `cb` will be invoked whenever the action button is clicked
  // if the button isn't clicked, it will never be called
  showSnackbarWithAction(description: string, type: SnackbarType, callBack: () => void, callBackButtonTitle: string, duration: number = 0): void {
    this.snackbarEvents.next({
      message: description,
      timeout: duration, 
      type,
      callBackButtonTitle: '',
      callBack,
    })
  }

  dismissSnackBar(): void {
    
  }
}

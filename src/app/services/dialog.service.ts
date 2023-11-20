import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingData } from '../interface/misc/loading-data';
import { DialogConfirmData, DialogData, DialogFormData, DialogType } from '../interface/misc/dialog-form-data';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private _loading = false;

  dialogEvents: BehaviorSubject<DialogData> = new BehaviorSubject(null);

  constructor() { }

  showFormDialog(formData: DialogFormData) {
    formData.type = DialogType.form;
    this.dialogEvents.next(formData);
  }

  showConfirmationDialog(confirmationData: DialogConfirmData) {
    confirmationData.type = DialogType.confirmation;
    this.dialogEvents.next(confirmationData);
  }
}

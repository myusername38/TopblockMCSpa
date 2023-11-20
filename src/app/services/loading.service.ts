import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingData } from '../interface/misc/loading-data';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading = false;

  loadingEvents: BehaviorSubject<LoadingData> = new BehaviorSubject(null);


  constructor() { }

  loading(message: string) {
    setTimeout(() => {
      this.loadingEvents.next({ loading: true, message });
    }, 1)
    
  }

  loadingEnded() {
    setTimeout(() => {
      this.loadingEvents.next({ loading: false, message: 'ended' });
    }, 2)
    
  }

}

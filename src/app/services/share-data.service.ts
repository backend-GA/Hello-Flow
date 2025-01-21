import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShareDataService {
  private countsSource = new BehaviorSubject<any>(null);
  counts$ = this.countsSource.asObservable();

  updateCounts(counts: any): void {
    this.countsSource.next(counts); // Update shared counts
  }
}

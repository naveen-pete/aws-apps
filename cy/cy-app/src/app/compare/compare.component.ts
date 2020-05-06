import { Component, OnInit, OnDestroy } from '@angular/core';
import { CompareService } from './compare.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit, OnDestroy {
  doInput = true;
  subscription: Subscription;

  constructor(private compareService: CompareService) { }

  ngOnInit() {
    this.subscription = this.compareService.dataEdited.subscribe(
      (edited: boolean) => this.doInput = !edited
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

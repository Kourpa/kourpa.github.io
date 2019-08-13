import { Component, OnInit, Input } from '@angular/core';
import { Toy } from '../toys';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-toys',
  templateUrl: './toys.component.html',
  styleUrls: ['./toys.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ToysComponent implements OnInit {
  @Input() toy: Toy;

  constructor() { }
  ngOnInit() {
  }
}

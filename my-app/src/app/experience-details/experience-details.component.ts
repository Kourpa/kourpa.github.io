import { Experience } from './../experience';
import { Component, OnInit, Input } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-experience-details',
  templateUrl: './experience-details.component.html',
  styleUrls: ['./experience-details.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ExperienceDetailsComponent implements OnInit {
  @Input() experience: Experience;
  @Input() isLast: boolean;

  constructor() { }
  ngOnInit() { }
}

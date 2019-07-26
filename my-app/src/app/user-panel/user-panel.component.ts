import { Component } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserPanelComponent {
  name = 'Marcos Lemus';
  title = 'Software Engineer';
  description = 'I do some stuff I do some stuff I do some stuff I do some stuff I do ';
}

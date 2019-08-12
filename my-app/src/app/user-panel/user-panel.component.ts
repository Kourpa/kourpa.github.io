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
  description = 'I am a Full Stack Web Developer with a diverse knowledge of software development technologies and concepts. I excel when faced with a challenging problem and seek out learning opportunities whenever possible.';
}

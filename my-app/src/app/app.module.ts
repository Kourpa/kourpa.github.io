import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { UserPanelComponent } from './user-panel/user-panel.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import {MaterialModule} from '../material-module';
import {ExperienceDetailsComponent} from './experience-details/experience-details.component';
import { ToysComponent } from './toys/toys.component';

@NgModule({
   declarations: [
      AppComponent,
      UserPanelComponent,
      PortfolioComponent,
      ExperienceDetailsComponent,
      ToysComponent
   ],
   imports: [
      BrowserModule,
      MaterialModule
   ],
   providers: [],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

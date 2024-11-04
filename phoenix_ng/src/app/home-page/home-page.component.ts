import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';


@Component({
  selector: 'home-page',
  standalone: true,
  imports: [NavBarComponent],
  templateUrl: './home-page.component.html',
})

export class HomePageComponent {

}

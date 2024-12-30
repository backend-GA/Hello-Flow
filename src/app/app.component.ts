import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { SideBarComponent } from './layout/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SideBarComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { ngSkipHydration: 'true' },
})
export class AppComponent {
  title = 'hello-flow';
  isOpen: boolean = true;
  closeUpgrade() {
    this.isOpen = false;
  }
}

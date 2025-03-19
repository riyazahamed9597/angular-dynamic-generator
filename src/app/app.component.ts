import { Component,OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'generic-table-Generator';
  isHomePage = true;

  constructor(private router: Router) {}
  
  ngOnInit() {
    // Subscribe to router events to know when navigation happens
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if we're on the home page
      this.isHomePage = event.url === '/' || event.url === '';
    });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}

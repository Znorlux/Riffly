import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-featured-carousel',
  templateUrl: './featured-carousel.component.html',
})
export class FeaturedCarouselComponent {
  constructor(private router: Router) {}
  // Implementation details
  onStartCreating() {
    this.router.navigate(['/create']);
  }
}

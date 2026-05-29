import { Component, input, output } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { StatCard } from '@shared/component/stat-card/stat-card';
import { Button } from '@shared/component/ui/button/button';

@Component({
  selector: 'ecom-product-variant-overview-actions',
  imports: [StatCard, Button, FaIconComponent],
  templateUrl: './product-variant-overview-actions.html',
  styleUrl: './product-variant-overview-actions.css',
  host: {
    class: 'flex items-center justify-between',
  },
})
export class ProductVariantOverviewActions {
  readonly faPlus = faPlus;
  readonly totalCount = input.required<number>();
  readonly creationRequest = output<void>();

  onProductVariantCreationRequest(): void {
    this.creationRequest.emit();
  }
}

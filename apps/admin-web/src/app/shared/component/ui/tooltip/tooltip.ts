import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'ecom-tooltip',
  imports: [],
  templateUrl: './tooltip.html',
})
export class Tooltip {
  text = input.required<string>();
  protected isHovered = signal(false);

  onPointerEnter() {
    this.isHovered.set(true);
  }
  onPointerLeave() {
    this.isHovered.set(false);
  }
}

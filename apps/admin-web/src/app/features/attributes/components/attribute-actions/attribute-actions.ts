import { Component, input, output } from '@angular/core';
import { Button } from '@shared/component/ui/button/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faPenNib, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { AttributeActionsOptions } from './attribute-actions.types';

@Component({
  selector: 'ecom-attribute-actions',
  imports: [Button, FaIconComponent],
  templateUrl: './attribute-actions.html',
  styleUrl: './attribute-actions.css',
  host: {
    class: 'flex gap-2 justify-center',
  },
})
export class AttributeActions {
  faPenNib = faPenNib;
  faTrashCan = faTrashCan;
  faEye = faEye;

  readonly delete = output<void>();
  readonly view = output<void>();
  readonly edit = output<void>();

  options = input.required<AttributeActionsOptions>();

  onDelete(): void {
    this.delete.emit();
  }

  onView(): void {
    this.view.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }
}

import { Component, effect, inject, signal } from '@angular/core';
import { AttributeDetailsDialogService } from '@attributes/services/attribute-details-dialog/attribute-details-dialog.service';
import { IDialogComponent } from '@shared/component/ui/dialog/interfaces/dialog-component.interface';
import { DialogRef } from '@shared/component/ui/dialog/models/dialog-ref.model';
import { Attribute } from '@shared/models/attribute.model';
import { AttributeDetails } from "@attributes/components/attribute-details/attribute-details";

@Component({
  selector: 'ecom-attribute-details-dialog',
  imports: [AttributeDetails],
  templateUrl: './attribute-details-dialog.html',
  styleUrl: './attribute-details-dialog.css',
})
export class AttributeDetailsDialog implements IDialogComponent<string | undefined, void> {

  private readonly attributeDetailsDialogService = inject(AttributeDetailsDialogService);

  data = signal<string | undefined>(undefined);
  attribute = signal<Attribute | null>(null);

  constructor() {
    effect(() => {
      if (!this.data()) {
        throw new Error('No se proporcionaron los detalles del atributo para mostrar en el diálogo.');
      } else {
        this.loadAttributeDetails();
      }
    })
  }

  loadAttributeDetails(): void {
    if (!this.data()) {
      throw new Error('No se proporcionaron los detalles del atributo para mostrar en el diálogo.');
    }
    this.attributeDetailsDialogService.getAttribute(this.data()!).subscribe({
        next: (response) => {
          
          this.attribute.set(response.data);
        },
        error: (error) => {
          console.error('Error al cargar los detalles del atributo:', error);
        },
      },
    );
  }

  setDialogRef(ref: DialogRef<string | undefined, void>): void {
    this.data.set(ref.data);
  }

}

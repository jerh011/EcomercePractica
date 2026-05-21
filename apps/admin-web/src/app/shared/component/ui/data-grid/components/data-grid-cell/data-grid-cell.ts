import { Component, contentChild, input } from '@angular/core';
import { DataGridColumn } from '../../data-grid.types';
import { NestedValuePipe } from '@shared/pipes/nested-value/nested-value-pipe';

@Component({
  selector: 'td[ecom-data-grid-cell]',
  imports: [
    //TODO: Evaluar si es necesario importar el NestedValuePipe aquí o si se puede manejar la lógica de acceso a valores anidados directamente en el componente.
    // NestedValuePipe
    
  ],
  templateUrl: './data-grid-cell.html',
  styleUrl: './data-grid-cell.css',
  host: {
    class: 'text-center p-2'
  }
})
export class DataGridCell {

  customCell = contentChild('custom');
  column = input<DataGridColumn>();
  value = input<any>();
}

import { Component, computed, input } from '@angular/core';
import { Attribute } from '@shared/models/attribute.model';
import { Label } from '@shared/component/ui/label/label';
import { InputText } from '@shared/component/ui/input-text/input-text';
import { Badge } from '@shared/component/ui/badge/badge';

@Component({
  selector: 'ecom-attribute-details',
  imports: [Label, InputText, Badge],
  templateUrl: './attribute-details.html',
  styleUrl: './attribute-details.css',
  host: {
    class: 'flex flex-col gap-4',
  }
})
export class AttributeDetails {

  attribute = input.required<Attribute>();

  readonly isActiveLabel = computed(() => this.attribute().isActive ? 'Activo' : 'Inactivo');
  readonly isFilterableLabel = computed(() => this.attribute().isFilterable ? 'Filtrable' : 'No filtrable');
  readonly appliesToAllLabel = computed(() => this.attribute().appliesToAll ? 'Todas' : 'Solo categorías seleccionadas');
  readonly isRequiredLabel = computed(() => this.attribute().isRequired ? 'Requerido' : 'No requerido');
}

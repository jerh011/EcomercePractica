import { Component, computed, input, output } from '@angular/core';
import { DataGridColumn } from '@shared/component/ui/data-grid/data-grid.types';
import { DataGrid } from '@shared/component/ui/data-grid/data-grid';
import { AttributeDraft, AttributePersisted, AttributeRecord } from '@attributes/interfaces/attribute-record.interface';
import { CellTemplate } from '@shared/component/ui/data-grid/directives/cell-template';
import { Switch } from '@shared/component/ui/switch/switch';
import { Tag } from '@shared/component/ui/tag/tag';
import { AttributeActions } from "../attribute-actions/attribute-actions";
import { AttributeActionsOptions } from '../attribute-actions/attribute-actions.types';

@Component({
  selector: 'ecom-attributes-table',
  imports: [DataGrid, CellTemplate, Switch, Tag, AttributeActions],
  templateUrl: './attributes-table.html',
  styleUrl: './attributes-table.css',
  host: {
    class: 'block',
  }
})
export class AttributesTable {

  readonly columns = input.required<DataGridColumn[]>();
  readonly data = input.required<AttributeRecord[]>();
  readonly pageSize = input<number | undefined>();
  readonly rows = computed(() => this.data().map((record) => record.data));
  readonly delete = output<AttributeRecord>();
  readonly view = output<AttributeRecord>();
  readonly edit = output<AttributeRecord>();

  readonly actionsColumn = input<AttributeActionsOptions>({
    canEdit: true,
    canDelete: true,
    canView: true,
  });

  onDelete(attribute: AttributeDraft | AttributePersisted): void {
    const record = this.data().find((r) => r.data.key === attribute.key);
    if (!record) {
      throw new Error(`No se encontró el registro para el atributo con key "${attribute.key}"`);
    }
    this.delete.emit(record);
  }

  onView(attribute: AttributeDraft | AttributePersisted): void {
    const record = this.data().find((r) => r.data.key === attribute.key);
    if (!record) {
      throw new Error(`No se encontró el registro para el atributo con key "${attribute.key}"`);
    }
    this.view.emit(record);
  }

  onEdit(attribute: AttributeDraft | AttributePersisted): void {
    const record = this.data().find((r) => r.data.key === attribute.key);
    if (!record) {
      throw new Error(`No se encontró el registro para el atributo con key "${attribute.key}"`);
    }
    this.edit.emit(record);
  }
}

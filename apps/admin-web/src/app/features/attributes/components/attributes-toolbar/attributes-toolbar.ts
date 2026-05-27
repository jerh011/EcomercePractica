import { Component, input, output } from '@angular/core';
import { AttributeRegistrationMode } from './attributes-toolbar.types';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { StatCard } from '@shared/component/stat-card/stat-card';
import { Dropdown } from '@shared/component/ui/dropdown/dropdown';
import { DropdownTrigger } from '@shared/component/ui/dropdown/components/dropdown-trigger/dropdown-trigger';
import { Button } from '@shared/component/ui/button/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Slot } from '@shared/directives/slot/slot';
import { DropdownContent } from '@shared/component/ui/dropdown/components/dropdown-content/dropdown-content';
import { DropdownGroup } from '@shared/component/ui/dropdown/components/dropdown-group/dropdown-group';
import { DropdownItem } from '@shared/component/ui/dropdown/components/dropdown-item/dropdown-item';

@Component({
  selector: 'ecom-attributes-toolbar',
  imports: [
    StatCard,
    Dropdown,
    DropdownTrigger,
    Button,
    FaIconComponent,
    Slot,
    DropdownContent,
    DropdownGroup,
    DropdownItem,
  ],
  templateUrl: './attributes-toolbar.html',
  styleUrl: './attributes-toolbar.css',
  host: {
    class: 'flex items-center justify-between',
  },
})
export class AttributesToolbar {
  readonly faChevronDown = faChevronDown;

  readonly totalCount = input.required<number>();
  readonly registrationMode = output<AttributeRegistrationMode>();

  onAttributeRegistrationModeSelect(mode: AttributeRegistrationMode): void {
    this.registrationMode.emit(mode);
  }
}

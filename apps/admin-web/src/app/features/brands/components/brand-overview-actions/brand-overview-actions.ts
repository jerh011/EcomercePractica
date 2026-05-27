import { Component, input, output } from '@angular/core';
import { StatCard } from '@shared/component/stat-card/stat-card';
import { Button } from '@shared/component/ui/button/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Slot } from '@shared/directives/slot/slot';
import { RegisterBrandStrategy } from './types';
import { Dropdown } from "@shared/component/ui/dropdown/dropdown";
import { DropdownTrigger } from '@shared/component/ui/dropdown/components/dropdown-trigger/dropdown-trigger';
import { DropdownContent } from "@shared/component/ui/dropdown/components/dropdown-content/dropdown-content";
import { DropdownItem } from "@shared/component/ui/dropdown/components/dropdown-item/dropdown-item";
import { DropdownGroup } from "@shared/component/ui/dropdown/components/dropdown-group/dropdown-group";

@Component({
    selector: 'ecom-brand-overview-actions',
    imports: [StatCard, Button, FaIconComponent, Slot, Dropdown, DropdownTrigger, DropdownContent, DropdownItem, DropdownGroup],
    templateUrl: './brand-overview-actions.html',
    styleUrl: './brand-overview-actions.css',
    host: {
        class: 'flex items-center justify-between',
    },
})
export class BrandOverviewActions {
    totalCount = input.required<number>();
    creationRequest = output<RegisterBrandStrategy>();

    readonly faChevronDown = faChevronDown;

    onSingleBrandCreationRequest(): void {
        this.creationRequest.emit('single');
    }

    onMultipleBrandCreationRequest(): void {
        this.creationRequest.emit('multiple');
    }
}

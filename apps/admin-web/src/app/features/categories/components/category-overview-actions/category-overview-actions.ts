import { Component, input, output } from '@angular/core';
import { RegisterCategoryStrategy } from './types';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@shared/component/ui/button/button';
import { StatCard } from '@shared/component/stat-card/stat-card';
import { Dropdown } from '@shared/component/ui/dropdown/dropdown';
import { DropdownTrigger } from '@shared/component/ui/dropdown/components/dropdown-trigger/dropdown-trigger';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DropdownContent } from "@shared/component/ui/dropdown/components/dropdown-content/dropdown-content";
import { DropdownGroup } from "@shared/component/ui/dropdown/components/dropdown-group/dropdown-group";
import { DropdownItem } from "@shared/component/ui/dropdown/components/dropdown-item/dropdown-item";

@Component({
    selector: 'ecom-category-overview-actions',
    imports: [StatCard, Dropdown, DropdownTrigger, Button, FaIconComponent, DropdownContent, DropdownGroup, DropdownItem],
    templateUrl: './category-overview-actions.html',
    styleUrl: './category-overview-actions.css',
    host: {
        class: 'flex items-center justify-between',
    },
})
export class CategoryOverviewActions {
    totalCount = input.required<number>();
    creationRequest = output<RegisterCategoryStrategy>();

    readonly faChevronDown = faChevronDown;

    onSingleBrandCreationRequest(): void {
        this.creationRequest.emit('single');
    }

    onMultipleBrandCreationRequest(): void {
        this.creationRequest.emit('multiple');
    }
}

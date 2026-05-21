import { Component, computed, inject } from '@angular/core';
import { Button } from '../ui/button/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import { SearchBar } from '../ui/search-bar/search-bar';
import { Slot } from '@shared/directives/slot/slot';
import { Dropdown } from '../ui/dropdown/dropdown';
import { DropdownTrigger } from '../ui/dropdown/components/dropdown-trigger/dropdown-trigger';
import { DropdownContent } from '../ui/dropdown/components/dropdown-content/dropdown-content';
import { DropdownGroup } from '../ui/dropdown/components/dropdown-group/dropdown-group';
import { DropdownItem } from '../ui/dropdown/components/dropdown-item/dropdown-item';
import { Router } from '@angular/router';
import { SidebarService } from '../services/sidebar/sidebar-service';

@Component({
    selector: 'header[ecom-header]',
    imports: [
        Button,
        FaIconComponent,
        SearchBar,
        Slot,
        Dropdown,
        DropdownTrigger,
        DropdownContent,
        DropdownGroup,
        DropdownItem,
    ],
    templateUrl: './header.html',
    styleUrl: './header.css',
    host: {
        class: 'flex items-center justify-between px-6 h-16 bg-primary-pressed',
    },
})
export class Header {
    private readonly router: Router = inject(Router);
    // private readonly authService = inject(AuthService);
     private readonly sidebarService: SidebarService = inject(SidebarService);

  
    firstLetterOfUserName ="E";
    // TODO: This should come from the user session, but for now it's hardcoded
    rol = computed(() => 'Administrador');
    faBars = faBars;
    faArrowRightFromBracket = faArrowRightFromBracket;
    faUser = faUser;

    toggleSidebar() {
         this.sidebarService.toggle();
    }

    onSearch(value: string) {
        console.log('Search value:', value);
    }

 

}

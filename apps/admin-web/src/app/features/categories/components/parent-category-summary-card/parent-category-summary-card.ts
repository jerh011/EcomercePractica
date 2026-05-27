import { Component, input } from '@angular/core';
import { Card } from '@shared/component/ui/card/card';
import { Spinner } from '@shared/component/ui/spinner/spinner';
import { InputText } from '@shared/component/ui/input-text/input-text';
import { Label } from '@shared/component/ui/label/label';
// import { InputTextarea } from '@shared/component/ui/input-textarea/input-textarea';
import { CategorySummary } from './types';
import { FormDivider } from '@shared/component/ui/form-divider/form-divider';

@Component({
  selector: 'ecom-parent-category-summary-card',
  imports: [
    Card,
    Spinner,
    InputText,
    // InputTextarea,
    FormDivider,
    Label,
  ],
  templateUrl: './parent-category-summary-card.html',
  styleUrl: './parent-category-summary-card.css',
})
export class ParentCategorySummaryCard {
  parentCategory = input.required<CategorySummary | null>({
    alias: 'category',
  });
}

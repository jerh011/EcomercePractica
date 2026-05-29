import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AttributeCategoryOption,
  AttributeFormData,
  AttributeFormSchema,
} from '@attributes/interfaces/attribute-form.interface';
import { FormActionConfiguration } from '@shared/interfaces/form-actions-configuration.interface';
import { DEFAULT_ATTRIBUTE_FORM_VALUE } from '@attributes/consts/attribute-form.consts';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, map, pipe, Subject } from 'rxjs';
import {
  areAttributeFormDataEqual,
  getCategoriesSelectOptions,
} from '@attributes/utils/attribute-form.utils';
import { Label } from '@shared/component/ui/label/label';
import { InputText } from '@shared/component/ui/input-text/input-text';
import { Switch } from '@shared/component/ui/switch/switch';
import { InputSelect } from '@shared/component/ui/input-select/input-select';
import { Button } from '@shared/component/ui/button/button';
import { FormErrorMessage } from '@shared/component/ui/form-error-message/form-error-message';
import { Tag } from '@shared/component/ui/tag/tag';
import { CategorySummary } from '@shared/models';

@Component({
  selector: 'ecom-attribute-form',
  imports: [
    ReactiveFormsModule,
    Label,
    InputText,
    Switch,
    InputSelect,
    Button,
    Tag,
    FormErrorMessage,
  ],
  templateUrl: './attribute-form.html',
  styleUrl: './attribute-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AttributeForm {
  private readonly fb = inject(FormBuilder);

  private categoryQuery$ = new Subject<string>();
  private categoryScroll$ = new Subject<void>();

  readonly className = input<string>('', { alias: 'class' });
  readonly initialData = input<AttributeFormData>();
  readonly categories = input<AttributeCategoryOption[]>([]);

  selectedCategoryIds = signal<AttributeCategoryOption[]>([]);

  readonly isCategoriesIdsRequired = signal<boolean>(true);

  readonly categoryOptions = computed(() =>
    getCategoriesSelectOptions(this.categories(), this.selectedCategoryIds()),
  );

  readonly actionOptions = input<FormActionConfiguration>({
    submitLabel: 'Guardar',
    cancelLabel: 'Cancelar',
    clearLabel: 'Limpiar',
    canClear: false,
    canCancel: true,
    resetOnSubmit: false,
  });
  readonly submitted = output<AttributeFormData>();
  readonly scrollCategoriesToEnd = output<void>();
  readonly searchCategories = output<string>();
  readonly cancel = output<boolean>();

  attributeForm = this.fb.nonNullable.group<AttributeFormSchema>({
    name: this.fb.nonNullable.control(DEFAULT_ATTRIBUTE_FORM_VALUE.name, [
      Validators.required,
    ]),
    description: this.fb.nonNullable.control(
      DEFAULT_ATTRIBUTE_FORM_VALUE.description,
    ),
    isActive: this.fb.nonNullable.control(
      DEFAULT_ATTRIBUTE_FORM_VALUE.isActive,
    ),
    isFilterable: this.fb.nonNullable.control(
      DEFAULT_ATTRIBUTE_FORM_VALUE.isFilterable,
    ),
    appliesToAll: this.fb.nonNullable.control(
      DEFAULT_ATTRIBUTE_FORM_VALUE.appliesToAll,
    ),
    isRequired: this.fb.nonNullable.control(
      DEFAULT_ATTRIBUTE_FORM_VALUE.isRequired,
    ),
    categories: this.fb.nonNullable.control<CategorySummary[]>(
      DEFAULT_ATTRIBUTE_FORM_VALUE.categories,
      [Validators.required],
    ),
  });

  private readonly initialSnapshot = signal<AttributeFormData>(
    DEFAULT_ATTRIBUTE_FORM_VALUE,
  );
  private readonly formValue = toSignal(
    this.attributeForm.valueChanges.pipe(
      map(() => this.attributeForm.getRawValue()),
    ),
    {
      initialValue: this.attributeForm.getRawValue(),
    },
  );

  readonly hasChanges = computed(() => {
    const currentValue = this.formValue();
    return !areAttributeFormDataEqual(this.initialSnapshot(), currentValue);
  });

  readonly canSubmit = computed(() => {
    this.formValue();
    const isValid = this.attributeForm.valid && this.hasChanges();
    return isValid;
  });

  readonly submitLabel = computed(() => this.actionOptions().submitLabel);
  readonly cancelLabel = computed(() => this.actionOptions().cancelLabel);
  readonly clearLabel = computed(() => this.actionOptions().clearLabel);
  readonly canClear = computed(() => this.actionOptions().canClear);
  readonly canCancel = computed(() => this.actionOptions().canCancel);
  readonly resetOnSubmit = computed(() => this.actionOptions().resetOnSubmit);

  constructor() {
    effect(() => {
      const data = this.initialData() ?? DEFAULT_ATTRIBUTE_FORM_VALUE;
      this.attributeForm.reset(data);
      this.initialSnapshot.set(this.attributeForm.getRawValue());
    });
    this.attributeForm.controls.categories.valueChanges.subscribe(
      (categories: CategorySummary[]) => {
        const matched = this.categories().filter((c) =>
          categories.some((cat) => cat === c.value),
        );
        this.selectedCategoryIds.set(matched);
      },
    );
    this.categoryQuery$.pipe(debounceTime(300)).subscribe((query) => {
      this.searchCategories.emit(query);
    });
    this.categoryScroll$.pipe(debounceTime(500)).subscribe(() => {
      this.scrollCategoriesToEnd.emit();
    });
  }

  onSubmit(): void {
    if (!this.canSubmit()) return;
    const result = this.attributeForm.getRawValue();
    this.submitted.emit(result);

    if (this.resetOnSubmit()) {
      this.resetAfterSubmit();
    }
  }

  onCancel(): void {
    this.cancel.emit(this.hasChanges());
  }

  onClear(): void {
    this.attributeForm.reset(DEFAULT_ATTRIBUTE_FORM_VALUE);
  }

  private resetAfterSubmit(): void {
    this.attributeForm.reset(
      this.initialData() ?? DEFAULT_ATTRIBUTE_FORM_VALUE,
    );
  }

  onSelectOption(event: MouseEvent, option: AttributeCategoryOption): void {
    event.preventDefault();
    this.selectedCategoryIds.update((current) => {
      const isSelected = current.some((o) => o.value === option.value);
      if (isSelected) {
        return current.filter((o) => o.value !== option.value);
      } else {
        return [...current, option];
      }
    });
    this.attributeForm.controls.categories.setValue(
      this.selectedCategoryIds().map((o) => o.value),
    );
  }

  onApplyToAllChange(isChecked: boolean): void {
    if (isChecked) {
      this.attributeForm.controls.categories.setValue([]);
      this.attributeForm.controls.categories.disable();
      this.attributeForm.controls.categories.clearValidators();
      this.attributeForm.controls.categories.updateValueAndValidity();
      this.selectedCategoryIds.set([]);
      this.isCategoriesIdsRequired.set(false);
    } else {
      this.attributeForm.controls.categories.enable();
      this.attributeForm.controls.categories.setValidators(Validators.required);
      this.attributeForm.controls.categories.updateValueAndValidity();
      this.isCategoriesIdsRequired.set(true);
    }
  }

  onScrollCategoriesToEnd(): void {
    this.categoryScroll$.next();
  }

  onSearchCategories(query: string): void {
    this.categoryQuery$.next(query);
  }
}

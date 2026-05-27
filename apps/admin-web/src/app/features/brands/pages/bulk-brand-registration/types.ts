import { BrandFormData } from "@brands/components/forms/brand-form/types";
import { DraftRecord, EntityData } from "@shared/interfaces";

export type BrandDraft = DraftRecord<BrandFormData & EntityData>;

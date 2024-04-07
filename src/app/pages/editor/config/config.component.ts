import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FIGDocument} from "../../../models/document";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOptgroup, MatOption, MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FIGThemeColors} from "../../../models/document-config";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FIGFont, FIGFontDefaults, formatImGuiFontName} from "../../../models/document-fonts";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {FIGSerializeProperty} from "../../../parsers/document.parser";
import {FIGSizes, FIGSizesSerializers} from "../../../models/document-sizes";

export interface FIGFormField extends FIGSerializeProperty {
  fieldType?: 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: {label: string, value: any}[];
}

@Component({
  selector: 'fig-config',
  standalone: true,
  imports: [
    MatIcon,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatButton,
    MatTooltip,
    MatOptgroup,
    MatFormField,
    MatIconButton,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    ReactiveFormsModule
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.css'
})
export class ConfigComponent {

  @ViewChild('fontPicker')
  fontPicker!: ElementRef;

  @Output()
  readonly update: EventEmitter<void> = new EventEmitter<void>();

  readonly form: FormGroup = new FormGroup<any>({
    theme: new FormControl<FIGThemeColors>('dark'),
    font: new FormControl<FIGFont>(FIGFontDefaults[0]),
    fontPath: new FormControl<string>(''),
    fontSize: new FormControl<number>({value: 13, disabled: true}, {validators: Validators.min(8)}),
  });

  fonts: FIGFont[] = FIGFontDefaults;
  embeddedFonts: FIGFont[] = [];
  canDeleteFont: boolean = false;

  sizesFields: FIGFormField[] = FIGSizesSerializers;

  private document!: FIGDocument;
  private fontFile?: File;

  constructor(private readonly toast: MatSnackBar) {
    this.form.get('theme')!.valueChanges.subscribe(this.onThemeChanged.bind(this));
    this.form.get('font')!.valueChanges.subscribe(this.onFontChanged.bind(this));

    for (const field of this.sizesFields) {
      if (field.type === 'array') {
        this.form.addControl(`${field.name}0`, new FormControl(null));
        this.form.addControl(`${field.name}1`, new FormControl(null));
        this.form.get(`${field.name}0`)!.valueChanges.subscribe((value) => this.onSizeFieldChanged(field, value, 0));
        this.form.get(`${field.name}1`)!.valueChanges.subscribe((value) => this.onSizeFieldChanged(field, value, 1));
      } else {
        this.form.addControl(field.name, new FormControl());
        this.form.get(field.name)!.valueChanges.subscribe((value) => this.onSizeFieldChanged(field, value));
      }
    }
  }

  @Input('document')
  public set _document(value: FIGDocument) {
    this.document = value;
    this.embeddedFonts = this.document.config.embeddedFonts;
    this.canDeleteFont = this.isFontEmbedded();
    this.updateForm();
  }

  protected get currentFont(): FIGFont {
    if (!this.document.config.font) {
      return FIGFontDefaults[0];
    }
    let font: FIGFont | undefined = this.document.findFontByName(this.document.config.font);

    font ??= this.fonts.find((item) => formatImGuiFontName(item) === this.document.config.font);
    return font ?? FIGFontDefaults[0];
  }

  protected get canImportFont(): boolean {
    return !!this.fontFile && this.form.get('fontSize')!.valid;
  }

  public updateForm(): void {
    this.form.get('theme')!.setValue(this.document.config.theme, {emitEvent: false});
    setTimeout(() => {
      this.form.get('font')!.setValue(this.currentFont, {emitEvent: false});
    });
    this.form.get('fontPath')!.setValue('', {emitEvent: false});
    this.form.get('fontSize')!.setValue({value: 13, disabled: true}, {emitEvent: false});
    const sizes: FIGSizes | undefined = this.document.config.sizes;

    for (const field of this.sizesFields) {
      if (field.type === 'array') {
        this.form.get(`${field.name}0`)!.setValue(sizes?.[field.name]?.[0] ?? field.default[0], {emitEvent: false});
        this.form.get(`${field.name}1`)!.setValue(sizes?.[field.name]?.[1] ?? field.default[1], {emitEvent: false});
      } else {
        this.form.get(field.name)!.setValue(sizes?.[field.name] ?? field.default, {emitEvent: false});
      }
    }
  }

  public openFontPicker(): void {
    this.fontPicker.nativeElement.click();
  }

  protected onDeleteFont(): void {
    if (!this.canDeleteFont) {
      return;
    }
    const imguiFontName: string = this.document.config.font!;
    const index: number = this.embeddedFonts.findIndex((font) => formatImGuiFontName(font) === imguiFontName);

    if (index === -1) {
      // TODO: show a toast?
      return;
    }
    const [font]: FIGFont[] = this.embeddedFonts.splice(index, 1);

    this.document.removeFont(font);
    this.onFontChanged(this.fonts[0]);
    this.form.get('font')!.setValue(this.fonts[0], {emitEvent: false});
  }

  protected onFontPicked(event: Event): void {
    // @ts-ignore
    const files: FileList = event.target!.files;

    if (files.length !== 1) {
      return;
    }
    const file: File = files[0];

    if (!file.name.endsWith('.ttf') && !file.name.endsWith('.otf')) {
      this.toast.open('Only TrueType and OpenType formats are supported (.ttf|.otf).');
      this.form.get('fontPath')!.setValue('', {emitEvent: false});
      this.form.get('fontSize')!.disable({emitEvent: false});
      return;
    }
    this.fontFile = file;
    this.form.get('fontPath')!.setValue(file.name);
    this.form.get('fontSize')!.enable({emitEvent: false});
  }

  protected async onImportFont(): Promise<void> {
    if (!this.fontFile) {
      return;
    }
    const buffer: Uint8Array = new Uint8Array(await this.fontFile.arrayBuffer());
    const font: FIGFont = {
      name: this.fontFile.name,
      size: +this.form.get('fontSize')!.value,
      buffer: buffer
    };

    this.embeddedFonts.push(font);
    this.document.addFont(font);
    this.update.emit();
    this.resetImportFont();
  }

  private onThemeChanged(value: FIGThemeColors): void {
    this.document.config.theme = value;
    this.update.emit();
  }

  private onFontChanged(value: FIGFont): void {
    this.document.config.font = formatImGuiFontName(value);
    this.canDeleteFont = this.isFontEmbedded();
    this.update.emit();
  }

  private resetImportFont(): void {
    this.fontFile = undefined;
    this.form.get('fontPath')!.setValue('', {emitEvent: false});
    this.form.get('fontSize')!.disable({emitEvent: false});
  }

  private isFontEmbedded(): boolean {
    const imguiFontName: string | undefined = this.document.config.font;

    if (!imguiFontName) {
      return false;
    }
    const font: FIGFont | undefined = this.document.config.embeddedFonts.find((font) => formatImGuiFontName(font) === imguiFontName);

    return !!font;

  }

  private onSizeFieldChanged(field: FIGFormField, value: any, index?: number): void {
    if (value === null) {
      return;
    }
    if (field.min !== undefined && value < field.min) {
      return;
    }
    if (field.max !== undefined && value > field.max) {
      return;
    }
    this.document.config.sizes ??= {};
    const sizes: FIGSizes | undefined = this.document.config.sizes;
    let currentValue: any | undefined = sizes[field.name] ?? field.default;

    if (field.type === 'array' && index !== undefined) {
      currentValue[index] = value;
    } else {
      currentValue = value;
    }
    sizes[field.name] = currentValue;
    this.update.emit();
  }

}

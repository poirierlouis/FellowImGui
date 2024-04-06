import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FIGDocument} from "../../../models/document";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOptgroup, MatOption, MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {FIGThemeColors} from "../../../models/document-styles";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FIGFont, FIGFontDefaults, formatImGuiFontName} from "../../../models/document-fonts";

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

  private document!: FIGDocument;
  private fontFile?: File;

  constructor(private readonly toast: MatSnackBar) {
    this.form.get('theme')!.valueChanges.subscribe(this.onThemeChanged.bind(this));
    this.form.get('font')!.valueChanges.subscribe(this.onFontChanged.bind(this));
  }

  @Input('document')
  public set _document(value: FIGDocument) {
    this.document = value;
    this.embeddedFonts = this.document.styles.embeddedFonts;
    this.updateForm();
  }

  protected get currentFont(): FIGFont {
    if (!this.document.styles.font) {
      return FIGFontDefaults[0];
    }
    let font: FIGFont | undefined = this.document.findFontByName(this.document.styles.font);

    font ??= this.fonts.find((item) => formatImGuiFontName(item) === this.document.styles.font);
    return font ?? FIGFontDefaults[0];
  }

  protected get canImportFont(): boolean {
    return !!this.fontFile && this.form.get('fontSize')!.valid;
  }

  public updateForm(): void {
    this.form.get('theme')!.setValue(this.document.styles.theme, {emitEvent: false});
    this.form.get('font')!.setValue(this.currentFont, {emitEvent: false});
    this.form.get('fontPath')!.setValue('', {emitEvent: false});
    this.form.get('fontSize')!.setValue({value: 13, disabled: true}, {emitEvent: false});
  }

  public openFontPicker(): void {
    this.fontPicker.nativeElement.click();
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
    this.document.styles.theme = value;
    this.update.emit();
  }

  private onFontChanged(value: FIGFont): void {
    this.document.styles.font = formatImGuiFontName(value);
    this.update.emit();
  }

  private resetImportFont(): void {
    this.fontFile = undefined;
    this.form.get('fontPath')!.setValue('', {emitEvent: false});
    this.form.get('fontSize')!.disable({emitEvent: false});
  }

}

import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  Renderer2,
  ViewChild
} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {DismissibleDirective} from "../../../../directives/dismissible.directive";
import {MatIcon} from "@angular/material/icon";
import {
  MatActionList,
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle
} from "@angular/material/list";
import {FIGTemplateEntity} from "../../../../entities/template.entity";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {map, Observable, OperatorFunction, pipe, Subscription} from "rxjs";
import {TemplateRepository} from "../../../../repositories/template.repository";
import {capitalize} from "../../../../models/string";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {TemplateCreateDialogComponent} from "../template-create-dialog/template-create-dialog.component";
import {FIGConfig} from "../../../../models/document-config";
import {MatTooltip} from "@angular/material/tooltip";
import {TemplateService} from "../../../../services/template.service";

interface TemplateItem {
  readonly title: string;
  readonly theme: string;
  readonly fonts: number;
  readonly entity: FIGTemplateEntity;
}

@Component({
  selector: 'fig-template-list',
  standalone: true,
  imports: [
    AsyncPipe,
    MatIcon,
    MatIconButton,
    MatButton,
    MatList,
    MatListItem,
    MatListItemLine,
    MatListItemTitle,
    MatListItemMeta,
    DismissibleDirective,
    MatActionList,
    MatTooltip
  ],
  templateUrl: './template-list.component.html',
  styleUrl: './template-list.component.css'
})
export class TemplateListComponent implements OnDestroy {

  @ViewChild('openPicker')
  openPicker!: ElementRef;

  @Input()
  config!: FIGConfig;

  @Output()
  figLoad: EventEmitter<FIGTemplateEntity> = new EventEmitter();

  templates$: Observable<TemplateItem[]>;

  private importS?: Subscription;
  private createS?: Subscription;
  private saveS?: Subscription;

  constructor(private readonly templateRepository: TemplateRepository,
              private readonly templateService: TemplateService,
              private readonly dialog: MatDialog,
              private readonly toast: MatSnackBar,
              private readonly renderer: Renderer2,
              private readonly dr: DestroyRef) {
    this.templates$ = this.getTemplates();
  }

  public ngOnDestroy(): void {
    this.importS?.unsubscribe();
    this.createS?.unsubscribe();
    this.saveS?.unsubscribe();
  }

  protected onLoadTemplate(template: FIGTemplateEntity): void {
    this.figLoad.emit(template);
  }

  protected onSaveTemplate(template: FIGTemplateEntity): void {
    this.saveS?.unsubscribe();
    this.saveS = this.templateService.write(template).subscribe((file: File) => {
      const $export: HTMLAnchorElement = this.renderer.createElement('a');
      const url: string = URL.createObjectURL(file);

      $export.href = url;
      $export.download = file.name;
      this.renderer.appendChild(document.body, $export);
      $export.click();
      this.renderer.removeChild(document.body, $export);
      URL.revokeObjectURL(url);
    });
  }

  protected onDeleteTemplate(template: FIGTemplateEntity): void {
    if (template.id === undefined) {
      return;
    }
    this.templateRepository.delete(template.id).pipe(takeUntilDestroyed(this.dr)).subscribe(() => {
      this.templates$ = this.getTemplates();
      this.toast.open(`Template ${template.title} is removed.`);
    });
  }

  protected onImportTemplate(): void {
    this.openPicker.nativeElement.click();
  }

  protected onCreateTemplate(): void {
    this.dialog.open(TemplateCreateDialogComponent)
      .afterClosed()
      .pipe(takeUntilDestroyed(this.dr))
      .subscribe((title?: string) => {
        if (!title) {
          return;
        }
        const template: FIGTemplateEntity = {
          title: title,
          ...this.config
        };

        this.templateRepository.create(template).pipe(takeUntilDestroyed(this.dr)).subscribe(this.onTemplateCreated.bind(this));
      });
  }

  protected async importTemplate(event: Event): Promise<void> {
    // @ts-expect-error event type not defined
    const files: FileList = event.target!.files;

    if (files.length !== 1) {
      // TODO: show toast.
      return;
    }
    const file: File = files[0];

    this.importS?.unsubscribe();
    this.importS = this.templateService.read(file).subscribe({
      next: this.onTemplateImported.bind(this),
      error: this.onTemplateFailed.bind(this)
    });
  }

  private onTemplateCreated(): void {
    this.templates$ = this.getTemplates();
    this.toast.open(`Template created.`);
  }

  private onTemplateImported(template: FIGTemplateEntity): void {
    this.createS?.unsubscribe();
    this.createS = this.templateRepository.create(template).subscribe();
    this.templates$ = this.getTemplates();
    this.toast.open(`Template imported.`);
  }

  private onTemplateFailed(error: Error): void {
    console.error(error);
    this.toast.open('Failed to read template. Please report this issue.');
  }

  private getTemplates(): Observable<TemplateItem[]> {
    return this.templateRepository.findAll().pipe(this.transformTemplates());
  }

  private transformTemplates(): OperatorFunction<FIGTemplateEntity[], TemplateItem[]> {
    return pipe(
      map((templates: FIGTemplateEntity[]) => {
        return templates.map((template) => {
          return {
            title: template.title,
            theme: capitalize(template.theme),
            fonts: template.embeddedFonts.length,
            entity: template
          };
        });
      })
    );
  }

}

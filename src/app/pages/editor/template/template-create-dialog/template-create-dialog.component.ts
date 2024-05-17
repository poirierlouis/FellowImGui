import {Component} from '@angular/core';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput} from "@angular/material/input";
import {MatLabel} from "@angular/material/form-field";

@Component({
  selector: 'fig-template-create-dialog',
  standalone: true,
  imports: [
    MatLabel,
    MatInput,
    MatButton,
    MatFormField,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    MatDialogClose
  ],
  templateUrl: './template-create-dialog.component.html',
  styleUrl: './template-create-dialog.component.css'
})
export class TemplateCreateDialogComponent {

  readonly form: FormGroup = new FormGroup<any>({
    title: new FormControl<string>('', {
      validators: [Validators.min(1), Validators.required],
      nonNullable: true
    })
  })

}

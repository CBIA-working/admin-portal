// download.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CommonModule } from '@angular/common';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ImportsModule } from 'src/app/imports';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [
    ButtonModule,
    ToggleButtonModule,
    IconFieldModule,
    InputIconModule,
    CommonModule,
    ImportsModule,
    ConfirmDialogModule,
    DropdownModule,
    TooltipModule
  ],
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss'],
  providers: [DialogService]
})
export class DownloadComponent {
  visible: boolean = false;
  format: string = 'excel';

  @Output() downloadAllStudentsEvent = new EventEmitter<string>();
  @Output() downloadSelectedStudentsEvent = new EventEmitter<string>();

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  downloadAllStudents() {
    this.downloadAllStudentsEvent.emit(this.format);
    this.hideDialog();
  }

  downloadSelectedStudents() {
    this.downloadSelectedStudentsEvent.emit(this.format);
    this.hideDialog();
  }
}

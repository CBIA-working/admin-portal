import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ImportsModule } from 'src/app/imports';

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
    ConfirmDialogModule],
  templateUrl: './download.component.html',
  styleUrl: './download.component.scss'
})
export class DownloadComponent {

}

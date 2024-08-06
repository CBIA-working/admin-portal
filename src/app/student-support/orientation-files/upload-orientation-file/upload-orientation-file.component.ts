import { Component } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-upload-orientation-file',
  standalone: true,
  imports: [FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule, ToastModule, HttpClientModule, CommonModule],
  providers: [MessageService],
  templateUrl: './upload-orientation-file.component.html',
  styleUrl: './upload-orientation-file.component.scss'
})
export class UploadOrientationFileComponent {

      files = [];
  
      totalSize: number = 0;
  
      totalSizePercent: number = 0;
  
      constructor(private config: PrimeNGConfig, private messageService: MessageService) {
          this.config.setTranslation({
              fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
          });
      }
  
      choose(event, callback) {
          callback();
      }
  
      onRemoveTemplatingFile(event, file, removeFileCallback, index) {
          removeFileCallback(event, index);
          this.totalSize -= file.size;  // Adjust this to handle raw size subtraction
          this.totalSizePercent = (this.totalSize / 1000000) * 100; // Assuming max size is 1MB for 100%
      }
  
      onClearTemplatingUpload(clear) {
          clear();
          this.totalSize = 0;
          this.totalSizePercent = 0;
      }
  
      onTemplatedUpload() {
          this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
      }
  
      onSelectedFiles(event) {
          this.files = event.currentFiles;
          this.files.forEach((file) => {
              this.totalSize += file.size;
          });
          this.totalSizePercent = (this.totalSize / 1000000) * 100; // Adjust this calculation based on your maxFileSize
      }
  
      uploadEvent(callback) {
          callback();
      }
  
      formatSize(bytes) {
          const k = 1024;
          const dm = 2; // Reduce the decimal places for better readability
          const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  
          if (bytes === 0) return `0 B`;
          const i = Math.floor(Math.log(bytes) / Math.log(k));
  
          return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
      }
  }
  
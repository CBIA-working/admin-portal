import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Service } from '../../service/service';

@Component({
  selector: 'app-upload-orientation-file',
  standalone: true,
  imports: [
    FileUploadModule, ButtonModule, BadgeModule, ProgressBarModule,
    ToastModule, TooltipModule, HttpClientModule, CommonModule
  ],
  providers: [MessageService, Service],
  templateUrl: './upload-orientation-file.component.html',
  styleUrls: ['./upload-orientation-file.component.scss']
})
export class UploadOrientationFileComponent {
  @Output() fileUploaded = new EventEmitter<string>();

  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(private config: PrimeNGConfig, 
    private messageService: MessageService,
     private http: HttpClient,
    private service:Service) {
    this.config.setTranslation({
      fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
    });
  }

  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= file.size;
    this.totalSizePercent = (this.totalSize / 1000000) * 100; // Assuming max size is 1MB for 100%
  }

  onClearTemplatingUpload(clear) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.files.forEach(file => {
      const formData = new FormData();
      formData.append('files', file, file.name);
  
      this.service.uploadFile(formData).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'File Uploaded Successfully'
          });
  
          // Delay the close of the dialog to allow the user to see the message
          setTimeout(() => {
            this.fileUploaded.emit(file.name); // Emit the file name after showing the message
            this.onClose(); // This will reset the state and close the dialog
          }, 2000); // Delay time is set to 2000 ms (2 seconds)
        },
        error: (err) => {
          console.error('Error uploading file:', err);
  
          let errorMessage = 'Failed to upload file. Please try again later.';
          if (err.error) {
            if (err.error.message) {
              errorMessage = err.error.message;
            } else if (err.error.errors) {
              errorMessage = 'Validation errors occurred: ' + Object.values(err.error.errors).join(', ');
            }
          } else if (err.status === 0) {
            errorMessage = 'Network error. Please check your connection.';
          }
  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage
          });
        }
      });
    });
  }
  
  onSelectedFiles(event) {
    this.files = event.currentFiles;
    this.files.forEach(file => {
      this.totalSize += file.size;
    });
    this.totalSizePercent = (this.totalSize / 1000000) * 100;
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 2;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];

    if (bytes === 0) return `0 B`;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  resetState() {
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.messageService.clear();
  }

  onClose() {
    console.log('Closing and resetting component state.');

    // Loop through files and remove each one
    this.files.forEach((file, index) => {
        this.onRemoveTemplatingFile(null, file, (event, idx) => this.files.splice(idx, 1), index);
    });

    this.resetState();
    console.log('Component state reset.');
    this.fileUploaded.emit('closed');
    console.log('Close event emitted.');
}

}

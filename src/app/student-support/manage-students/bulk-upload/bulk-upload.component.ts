import { Component } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Card } from 'primeng/card';
@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [ImportsModule],
    providers: [MessageService,DialogService],
  templateUrl: './bulk-upload.component.html',
  styleUrl: './bulk-upload.component.scss'
})
export class BulkUploadComponent {
  visible: boolean = false;
  
  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  constructor(
    private config: PrimeNGConfig,
    private messageService: MessageService,
    private dialogService: DialogService
  ) {}

  choose(event, callback) {
    callback();
  }

  onRemoveTemplatingFile(event, file, removeFileCallback, index) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
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
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback) {
    callback();
  }

  formatSize(bytes) {
    const k = 1024;
    const dm = 3;
    const sizes = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  openDialog() {
    const ref = this.dialogService.open(Card, {
      header: 'Upload Files',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' }
    });

    // Pass necessary data to the dialog component if required
    ref.onClose.subscribe((data) => {
      // Handle dialog close actions if needed
    });
  }
}


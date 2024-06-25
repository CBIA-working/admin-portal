import { Component } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel manipulation
import { Card } from 'primeng/card';

@Component({
  selector: 'app-bulk-upload',
  standalone: true,
  imports: [ImportsModule],
  providers: [MessageService, DialogService],
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent {
  visible: boolean = false;
  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  // Function to download the Excel template
  downloadTemplate() {
    const templateData = [
      { value: 'fname', label: 'First Name' },
      { value: 'lname', label: 'Last Name' },
      { value: 'email', label: 'Email' },
      { value: 'password', label: 'Password' },
      { value: 'dob', label: 'Date of Birth' },
      { value: 'address', label: 'Address' },
      { value: 'gender', label: 'Gender' },
      { value: 'bloodGroup', label: 'Blood Group' },
      { value: 'dietaryPreference', label: 'Dietary Preference' },
      { value: 'emergencyContactName', label: 'Emergency Contact Name' },
      { value: 'emergencyContactNumber', label: 'Emergency Contact Number' },
      { value: 'emergencyContactRelation', label: 'Emergency Contact Relation' }
    ];

    const headers = templateData.map(item => item.label);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headers]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'bulk_upload_template.xlsx');
  }

  showDialog() {
    this.visible = true;
    this.downloadTemplate();
  }

  hideDialog() {
    this.visible = false;
  }

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

    // Clear the file upload component state
    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;

    // Close the dialog
    this.hideDialog();
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

    ref.onClose.subscribe((data) => {
      // Handle dialog close actions if needed
    });
  }
}

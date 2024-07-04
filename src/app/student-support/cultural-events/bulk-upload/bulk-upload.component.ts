import { Component } from '@angular/core';
import { ImportsModule } from '../../../imports';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import * as XLSX from 'xlsx'; // Import XLSX library for Excel manipulation
import { Card } from 'primeng/card';
import { HttpClient } from '@angular/common/http';

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

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
    private http: HttpClient
  ) {}

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

    if (this.files.length > 0) {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as Array<Array<string | number>>;

        if (jsonData.length > 1) {
          const headers = jsonData[0];
          const rows = jsonData.slice(1);

          rows.forEach(row => {
            const formData: any = {};
            headers.forEach((header: string | number, index) => {
              if (typeof header === 'string') {
                const templateHeader = this.getTemplateHeader(header.toLowerCase());
                formData[templateHeader] = row[index];
              }
            });

            console.log('FormData to be posted:', formData);
            this.postFormData(formData);
          });
        }
      };
      reader.readAsArrayBuffer(file);
    }

    this.files = [];
    this.totalSize = 0;
    this.totalSizePercent = 0;
    this.hideDialog();
  }

  postFormData(formData: any) {
    const formattedData = {
      fname: formData['first name'] || '',
      lname: formData['last name'] || '',
      email: formData['Email'] || '',
      password: formData['Password'] || '',
      dob: formData['date of birth'] || '',
      address: formData['Address'] || '',
      gender: formData['Gender'] || '',
      bloodGroup: formData['blood group'] || '',
      dietaryPreference: formData['dietary preference'] || '',
      emergencyContactName: formData['emergency contact name'] || '',
      emergencyContactNumber: formData['emergency contact number'] || '',
      emergencyContactRelation: formData['emergency contact relation'] || ''
    };
  
    // Convert all values to strings
    const stringifiedData = this.convertAllValuesToString(formattedData);
  
    this.http.post('https://maui-portal.vercel.app/api/register', stringifiedData)
      .subscribe(
        (response) => {
          console.log('Data posted successfully:', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Data posted successfully' });
        },
        (error) => {
          console.error('Error posting data:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to post data' });
        }
      );
  }
  
  convertAllValuesToString(data: any): any {
    const stringifiedData = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        stringifiedData[key] = String(data[key]);
      }
    }
    return stringifiedData;
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
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
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

  getTemplateHeader(key: string): string {
    const templateData = {
      'fname': 'First Name',
      'lname': 'Last Name',
      'email': 'Email',
      'password': 'Password',
      'dob': 'Date of Birth',
      'address': 'Address',
      'gender': 'Gender',
      'bloodgroup': 'Blood Group',
      'dietarypreference': 'Dietary Preference',
      'emergencycontactname': 'Emergency Contact Name',
      'emergencycontactnumber': 'Emergency Contact Number',
      'emergencycontactrelation': 'Emergency Contact Relation'
    };

    return templateData[key.toLowerCase()] || key;
  }
}

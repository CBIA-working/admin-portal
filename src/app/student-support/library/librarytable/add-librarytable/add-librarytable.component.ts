
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Library } from 'src/app/student-support/domain/schema';
import { Service } from 'src/app/student-support/service/service';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { HttpClientModule } from '@angular/common/http';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { MessageService, PrimeNGConfig, SelectItem } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { UploadBookComponent } from "../upload-book/upload-book.component";


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-add-librarytable',
  standalone:true,
    imports: [
    CommonModule, ReactiveFormsModule, CheckboxModule, CardModule, CalendarModule,
    ButtonModule, TabViewModule, FormsModule, HttpClientModule, ToastModule,
    DropdownModule, InputTextModule, InputTextareaModule, MessageModule, DialogModule,
    UploadBookComponent,DropdownModule
],
    providers: [MessageService,Service],
  templateUrl: './add-librarytable.component.html',
  styleUrl: './add-librarytable.component.scss'
})
export class AddLibrarytableComponent  implements OnInit {
      @Input()  library : Library | null = null;
      @Output() dialogClose = new EventEmitter<Library | null>();
    
      libraryForm!: FormGroup;
      originalLibrary: Library | null = null;
      showUploadDialog: boolean = false;
      uploadedFiles: any[] = [];
      statusOptions: SelectItem[] = [];
    
      constructor(
        private fb: FormBuilder,
        private service: Service,
        private messageService: MessageService,
        private config: PrimeNGConfig
      ) {
        this.config.setTranslation({
            fileSizeTypes: ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
        });
    }
    
      ngOnInit(): void {
        this.createForm();
        this.resetForm();
        this.loadStatusOptions();
      }
  
      createForm(): void {
        this.libraryForm = this.fb.group({
          Name: ['', Validators.required],
          Description: ['', Validators.required],
          Status: ['', Validators.required],
          LibraryPdf: ['', Validators.required],
        });
      }
    
      resetForm(): void {
        if (this.library) {
          this.libraryForm.patchValue({
            Name: this.library.Name,
            Description: this.library.Description,
            Status: this.library.Status,
            LibraryPdf: this.library.LibraryPdf
          });
        } else {
          this.libraryForm.reset();
        }
        this.originalLibrary = { ...this.library };
      }

      loadStatusOptions() {
        return this.service.getProgram().then(data => {
          this.statusOptions = data.map((item: any) => ({
            label: item.name,
            value: item.name
          }));
        }).catch(error => {
          console.error('Error fetching statuses:', error);
        });
      }
      
      
      saveChanges(): void {
        if (this.libraryForm.valid) {
          const updatedLibrary: Library = {
            ...this.originalLibrary,
            ...this.libraryForm.value
          };
      
          this.service.addLibrary(updatedLibrary).subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Books added',
                detail: 'Book has been successfully added.'
              });
      
              // Close the dialog after a delay
              setTimeout(() => {
                this.dialogClose.emit(updatedLibrary);
                this.onClose();  // This will close the dialog
              }, 2000); // Delay time is set to 2000 ms (2 seconds)
            },
            error: (error) => {
              console.error('Error adding Book:', error);
    
              let errorMessage = 'Failed to add Book. Please try again later.';
              if (error.error) {
                if (error.error.message) {
                  errorMessage = error.error.message;
                } else if (error.error.errors) {
                  errorMessage = 'Validation errors occurred: ' + Object.values(error.error.errors).join(', ');
                }
              } else if (error.status === 0) {
                errorMessage = 'Network error. Please check your connection.';
              }
    
              this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
            }
          });
        } else {
          this.libraryForm.markAllAsTouched();
        }
      }
  
  
  
      onFileUploaded(event: string) {
          if (event === 'closed') {
              this.showUploadDialog = false;  // Close the dialog
          } else {
              const baseUrl = 'http://localhost:3000/library/';
              this.libraryForm.get('LibraryPdf').setValue(baseUrl + event);
          }
      }
      
      
      
      onClose(): void {
        this.dialogClose.emit(null);
        this.resetForm(); // Correctly call the resetForm method
      }
    }
    
  

import { LightningElement, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveTheFile from '@salesforce/apex/FileUploadController.saveTheFile';
import linkFileToRecord from '@salesforce/apex/FileUploadController.linkFileToRecord';

export default class FileUploadComponent extends LightningElement {
    @track selectedFiles = [];
    @track uploadedContentDocIds = [];
    @api recordId;
    
    acceptedFormats = ['.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.txt'];
    
    handleFilesChange(event) {
        const filesList = event.target.files;
        if (filesList.length > 0) {
            // Convert to array and store file info
            for (let i = 0; i < filesList.length; i++) {
                const file = filesList[i];
                this.selectedFiles.push({
                    name: file.name,
                    size: this.formatFileSize(file.size),
                    file: file // Store the actual file object
                });
            }
            
            // Reset the input to allow selecting the same file again
            event.target.value = '';
            
            // Notify parent about selected files
            this.dispatchEvent(new CustomEvent('filesselected', {
                detail: {
                    filesSelected: true,
                    fileCount: this.selectedFiles.length
                }
            }));
        }
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + ' bytes';
        } else if (bytes < 1048576) {
            return (bytes / 1024).toFixed(1) + ' KB';
        } else {
            return (bytes / 1048576).toFixed(1) + ' MB';
        }
    }
    
    handleRemoveFile(event) {
        const index = event.currentTarget.dataset.index;
        if (index !== undefined) {
            this.selectedFiles.splice(parseInt(index), 1);
            this.selectedFiles = [...this.selectedFiles]; // Force reactive update
            
            // Update parent on file selection status
            this.dispatchEvent(new CustomEvent('filesselected', {
                detail: {
                    filesSelected: this.selectedFiles.length > 0,
                    fileCount: this.selectedFiles.length
                }
            }));
        }
    }
    
    @api
    async uploadFiles(caseId) {
        if (!caseId || this.selectedFiles.length === 0) {
            // No case ID or no files, notify parent
            this.dispatchEvent(new CustomEvent('filesuploaded'));
            return;
        }
        
        this.recordId = caseId;
        let uploadCount = 0;
        let errorCount = 0;
        
        // Process each file
        for (let i = 0; i < this.selectedFiles.length; i++) {
            try {
                // Read file as base64
                const fileData = await this.readFileAsBase64(this.selectedFiles[i].file);
                
                // Upload file to Salesforce
                const contentDocId = await saveTheFile({ 
                    base64Data: fileData, 
                    filename: this.selectedFiles[i].name 
                });
                
                // Link file to case
                await linkFileToRecord({
                    contentDocumentId: contentDocId,
                    recordId: caseId
                });
                
                this.uploadedContentDocIds.push(contentDocId);
                uploadCount++;
                
            } catch (error) {
                console.error('Error uploading file:', error);
                errorCount++;
            }
        }
        
        // Show upload results if needed
        if (errorCount > 0) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'File Upload Results',
                message: `${uploadCount} files uploaded, ${errorCount} failed`,
                variant: 'warning'
            }));
        }
        
        // Notify parent that upload process is complete
        this.dispatchEvent(new CustomEvent('filesuploaded'));
    }
    
    // Helper to read file as base64
    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                // Extract base64 data from result
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
    
    @api
    getSelectedFileCount() {
        return this.selectedFiles.length;
    }
    
    @api
    resetFiles() {
        this.selectedFiles = [];
        this.uploadedContentDocIds = [];
        this.recordId = null;
    }
}
import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCaseIdFromNumber from '@salesforce/apex/AppealController.getCaseIdFromNumber';
import createAppealRecord from '@salesforce/apex/AppealController.createAppealRecord';

export default class AppealForm extends LightningElement {
    caseNumber;
    appealType;
    comments;
    reason;
    appealId;
    acceptedFormats = ['.pdf', '.doc', '.docx'];
    isLoading = false;

    appealTypeOptions = [
        {label: 'Submit new/further evidence', value: 'Submit new/further evidence'},
        {label: 'Request review by higher authority', value: 'Request review by higher authority'},
        {label: 'Request in-person review hearing', value: 'Request in-person review hearing'},
    ];

    handleCaseNumberChange(event) {
        this.caseNumber = event.target.value;
    }

    handleTypeChange(event) {
        this.appealType = event.detail.value;
    }

    handleCommentsChange(event) {
        this.comments = event.target.value;
    }

    handleReasonChange(event) {
        this.reason = event.target.value;
    }

    async handleSubmit(event) {
        event.preventDefault();
        this.isLoading = true;
        
        try {
            // Convert Case Number to Case ID
            const caseId = await getCaseIdFromNumber({ caseNumber: this.caseNumber });
            
            // Create Appeal record
            this.appealId = await createAppealRecord({
                caseId: caseId,
                appealType: this.appealType,
                comments: this.comments,
                reason: this.reason
            });

            // Show success message
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Appeal submitted successfully',
                variant: 'success'
            }));

            // Reset form
            this.template.querySelector('form').reset();
            this.caseNumber = '';
            this.appealType = null;

        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error creating appeal',
                message: error.body.message,
                variant: 'error'
            }));
        } finally {
            this.isLoading = false;
        }
    }

    // Add to your existing JS class
    get buttonLabel() {
        return this.isLoading ? 'Submitting...' : 'Submit Appeal';
    }

    handleUploadFinished(event) {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Files Uploaded',
            message: 'Files attached successfully',
            variant: 'success'
        }));
    }
}
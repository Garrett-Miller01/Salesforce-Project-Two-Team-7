import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import TYPE from '@salesforce/schema/Case.Type_of_Training_Education__c';
import INSTITUTION from '@salesforce/schema/Case.Education_Details__c';

export default class EducationTrainingClaimCreator extends LightningElement {
    caseObject = CASE_OBJECT;
    type = TYPE;
    institution = INSTITUTION;

    recordTypeId = '0124U000000p1d7QAA';

    queueId = '00G4U000004pXBJ';

    handleCaseCreation(event){
        // Prevent the default submission from happening
        event.preventDefault();

        // Capture the fields that are to be set for the new record
        const fields = event.detail.fields;

        // Set the record type
        fields.RecordTypeId = this.recordTypeId;


        // Set the queue as the owner
        fields.OwnerId = this.queueId;

        // Finally Submit after our logic has operated.
        this.template.querySelector('lightning-record-edit-form').submit(fields);

        console.log('Submitted')
        this.claimSuccess = true;
    }
    
    handleSuccess(event){
        // The claim's id is accessed via : event.detail.id
        const evt = new CustomEvent('claimcreatedevent',{
            bubbles:true, composed:true,
            detail: {claimId : event.detail.id }
        });
        this.dispatchEvent(evt);
    }
}
import { LightningElement } from 'lwc';
// Import Case Object and Fields
import CASE_OBJECT from '@salesforce/schema/Case';
import RECORD_TYPE from '@salesforce/schema/Case.RecordTypeId';
import HEALTH_STATUS from '@salesforce/schema/Case.Current_Health_Status__c';
import HEALTH_DETAILS from '@salesforce/schema/Case.Current_Health_Status_Details__c';
import TOTAL_INCOME from '@salesforce/schema/Case.Total_Income__c';
import INCOME_DETAILS from '@salesforce/schema/Case.Income_Details__c';

export default class HealthcareBenefitsClaimCreator extends LightningElement {
    caseObject = CASE_OBJECT;
    healthStatus = HEALTH_STATUS;
    healthDetails = HEALTH_DETAILS;
    totalIncome = TOTAL_INCOME;
    incomeDetails = INCOME_DETAILS;

    recordTypeId = '0124U000000p1d2QAA';

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
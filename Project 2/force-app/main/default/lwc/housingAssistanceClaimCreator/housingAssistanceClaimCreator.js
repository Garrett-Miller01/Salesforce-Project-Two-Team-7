import { LightningElement, wire } from 'lwc';
// Import Case Object and Fields
import CASE_OBJECT from '@salesforce/schema/Case';
import TOTAL_INCOME from '@salesforce/schema/Case.Total_Income__c';
import INCOME_DETAILS from '@salesforce/schema/Case.Income_Details__c';
import DISABILITY_STATUS from '@salesforce/schema/Case.Disability_Status__c';
import DISABILITY_DETAILS from '@salesforce/schema/Case.Disability_Details__c';
import CREDIT_SCORE from '@salesforce/schema/Case.Credit_Score__c';
import CREDIT_DETAILS from '@salesforce/schema/Case.Credit_Details__c';
import RECORD_TYPE from '@salesforce/schema/Case.RecordTypeId';

export default class HousingAssistanceClaimCreator extends LightningElement {
    // Store the values so they can be referenced by the html
    caseObject = CASE_OBJECT;
    totalIncome = TOTAL_INCOME;
    incomeDetails = INCOME_DETAILS;
    disabilityStatus = DISABILITY_STATUS;
    disabilityDetails = DISABILITY_DETAILS;
    creditScore = CREDIT_SCORE;
    creditDetails = CREDIT_DETAILS;
    recordTypeField = RECORD_TYPE;

    // Set the Record Type appropriately
    recordTypeId = '0124U000000p1dCQAQ';

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
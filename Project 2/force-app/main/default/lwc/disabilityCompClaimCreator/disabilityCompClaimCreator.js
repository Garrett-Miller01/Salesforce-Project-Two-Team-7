import { LightningElement } from 'lwc';

import CASE_OBJECT from '@salesforce/schema/Case';
import INJURY_DATE from '@salesforce/schema/Case.Injury_Date__c';
import INJURY from '@salesforce/schema/Case.Service_Connected_Injury_Illness__c';
import RECORD_TYPE from '@salesforce/schema/Case.RecordTypeId';
import VETERAN_ACCOUNT from '@salesforce/schema/Case.AccountId';
import OWNER from '@salesforce/schema/Case.OwnerId';

export default class DisabilityCompClaimCreator extends LightningElement {
    caseObject = CASE_OBJECT;
    injuryDateField = INJURY_DATE;
    injuryField = INJURY;
    recordTypeField = RECORD_TYPE;
    accountField = VETERAN_ACCOUNT;
    ownerField = OWNER;

    recordTypeId = '0124U000000p1csQAA';
    
    queueId = '00G4U000004pXBJ';

    handleCaseCreation(event){
        try {
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
        } catch (error){
            console.log(`Error : ${error}`);
        }
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
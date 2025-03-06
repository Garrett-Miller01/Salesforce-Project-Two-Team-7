import { getFieldValue, getRecord } from 'lightning/uiRecordApi';
import { LightningElement, api, wire } from 'lwc';
import ACCOUNT_NAME_FIELD from '@salesforce/schema/Account.Name';
import getCertsHeld from '@salesforce/apex/CertCheckerController.getCertsHeld' // import our apex class as getCertsHeld
import deleteCertsHeld from '@salesforce/apex/CertCheckerController.deleteCertsHeld';
import { refreshApex } from '@salesforce/apex';

export default class TechsCertsHeld extends LightningElement {
    
    @api accountId; // Public b/c of @api
    cardTitle = 'Awaiting Account Id'; // Private
    errorMessage;

    wiredResult;

    deleteButtonDisabled = true;

    selectedRows = [];

    rowData = [];
    colData = [
        {label: 'Technician', fieldName: 'TechName', type: 'text'},
        {label: 'Certification', fieldName: 'CertName', type: 'text'},
        {label: 'Date Achieved', fieldName: 'DateAchieved', type: 'date'},
    ];

    // Use the UI API to get some data
    @wire(getRecord, {recordId : '$accountId', fields : [ACCOUNT_NAME_FIELD]})  // $ means the attribute is responsive - when accountId changes, this @wire call will run again
    wiredAccount(result){
        // The value of result is whatever comes back from getRecord using the parameters we set
        if(result.data){
            this.cardTitle = getFieldValue(result.data, ACCOUNT_NAME_FIELD) + ' Technicians'; // given the results and a field token, give us the data value
        } else if(result.error) {   
            this.cardTitle = 'The Account was unable to be retrieved.'
        }
    }

    @wire(getCertsHeld,{acctId : '$accountId'})
    wiredCertHeldRecords(results){

        this.wiredResult = results;

        // Almost every wire call you want to do this sort of if data elif error
        if(results.data){

            this.rowData = results.data.map((record) => ({

                Id: record.Id,
                TechName: record.Certified_Professional__r.Name,
                CertName: record.Certification__r.Name,
                TechId: record.Certified_Professional__c,
                CertId: record.Certification__c,
                DateAchieved: record.Date_Achieved__c

            }));

            this.errorMessage = null; // Make sure there is no errorMessage if there was a success

        } else if(results.error){
            this.errorMessage = results.error.body.message;
        }

    }

    handleSelections(event){
        let ids;

        if(event.detail.selectedRows.length > 0){
            this.selectedRows = event.detail.selectedRows;

            ids = this.selectedRows.map((row) => row.TechId )

            this.deleteButtonDisabled = false;
        } else {
            this.deleteButtonDisabled = true;
        }

        const SelectedIdsEvent = new CustomEvent('selectedids', {
            detail : { // this has to be called detail
                techIds : ids
            }
        });

        this.dispatchEvent(SelectedIdsEvent);

    }

    handleDelete(event){

        let ids = this.selectedRows.map((row) => row.Id);

        deleteCertsHeld({certIds : ids})
            .then((result) => {
                refreshApex(this.wiredResult); // wiredResult stores the result of a wire method, so refreshApex will use that to know what method to call
            })
            .catch((error) => {
                this.errorMessage = error.body.message;
            })

    }

}
import { LightningElement, api } from 'lwc';

export default class CertChecker extends LightningElement {

    @api recordId; // Public field

    techIds;

    handleSelectedIds(event){
        this.techIds = event.detail.techIds;
    }

}
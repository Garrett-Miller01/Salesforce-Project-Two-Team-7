import { LightningElement, wire} from 'lwc';
import getActiveClaims from '@salesforce/apex/ActiveClaimsController.getActiveClaims';

export default class ActiveClaimsDashboard extends LightningElement {
    activeClaims;
    error;

    @wire(getActiveClaims)
    wiredClaims({ data, error }) {
        if (data) {
            this.activeClaims = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.activeClaims = undefined;
        }
    }

    // Add a getter to compute the condition
    get showNoClaimsMessage() {
        return !this.activeClaims && !this.error;
    }
}
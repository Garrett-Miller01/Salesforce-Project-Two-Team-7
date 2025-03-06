import { updateReplicatedDataset } from 'lightning/analyticsWaveApi';
import { LightningElement, track } from 'lwc';

export default class CreateNewVeteranClaim extends LightningElement {

    testTrue = true;

    // Store the selected claim type
    claimTypeSelected;    

    // Used for conditional rendering
    dComp = false;
    eduTrain = false;
    healthBen = false;
    houseAssist = false;
    pension = false;

    // Return the list of available claim types
    get claimTypesAvailable(){
        return [
            {label: 'Please Choose a Claim Type...', value: 'Please Choose a Claim Type...'},
            {label: 'Disability Compensation', value: 'Disability Compensation'},
            {label: 'Education and Training', value: 'Education and Training'},
            {label: 'Healthcare Benefits', value: 'Healthcare Benefits'},
            {label: 'Housing Assistance', value: 'Housing Assistance'},
            {label: 'Pension', value: 'Pension'}
        ]
    }

    // handle the event when they select a claim
    handleClaimSelect (event){

        if(event.detail.value){
            this.claimTypeSelected = event.detail.value;
        } else {
            this.claimTypeSelected = 'Error!';
        }

        // Determine which component to show based on selection
        switch(this.claimTypeSelected){
            case 'Please Choose a Claim Type...':
                this.allFalse();
                break;
            case 'Disability Compensation':
                this.allFalse();
                this.dComp = true;
                break;
            case 'Education and Training':
                this.allFalse();
                this.eduTrain = true;
                break;
            case 'Healthcare Benefits' :
                this.allFalse();
                this.healthBen = true;
                break;
            case 'Housing Assistance' :
                this.allFalse();
                this.houseAssist = true;
                break;
            case 'Pension' :
                this.allFalse();
                this.pension = true;
                break;
        }

    }

    allFalse(){
        this.dComp = false;
        this.eduTrain = false;
        this.healthBen = false;
        this.houseAssist = false;
        this.pension = false;
        this.fileUpload = false;
    }

    @track claimId;
    fileUpload = false;
    handleClaimCreated(event){
        const claim = event.detail.claimId;

        this.claimId = claim;
        
        this.allFalse();
        this.fileUpload = true;
    }

    acceptedFormats = ['.pdf'];
    handleUploadFinished(event){
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }
    
}
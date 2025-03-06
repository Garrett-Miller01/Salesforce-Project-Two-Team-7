import { LightningElement, wire, api } from 'lwc';
import Id_Object from '@salesforce/user/Id';
import getPersonAccount from '@salesforce/apex/createNewVeteranClaimController.getPersonAccount'

export default class EditVeteranPersonalInfo extends LightningElement {
    @api accountId;

    userId = String(Id_Object);

    @wire(getPersonAccount, {userId : '$userId'})
    wiredAccount({error, data}){
        if(data){
            console.log(`UserId : ${this.userId}`);

            try{
                this.accountId = data[0].Id;
                console.log(`Account Id : ${this.accountId}`);
            } catch (errorInner){
                console.log(`Error : ${errorInner}`);
            }
            
        } else {
            console.log(`Error : ${JSON.stringify(error)}`);
        }
    }

    success = false;
    handleSuccess(event){
        this.success = true;
    }

}
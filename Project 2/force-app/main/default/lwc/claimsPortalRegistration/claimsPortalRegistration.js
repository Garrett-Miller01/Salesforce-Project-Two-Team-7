import { LightningElement } from 'lwc';
import USER_OBJECT from '@salesforce/schema/User';
import NAME from '@salesforce/schema/User.Name';
import EMAIL from '@salesforce/schema/User.Email';
//import  from '@salesforce/schema/User.';

import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import START_SERVICE from '@salesforce/schema/Account.Starting_Date_of_Service__c';
import END_SERVICE from '@salesforce/schema/Account.End_Date_of_Service__c';
import BRANCH from '@salesforce/schema/Account.Military_Branch__c';
import BIRTHDATE from '@salesforce/schema/Account.PersonBirthdate';

//import  from '@salesforce/schema/Account.';

export default class ClaimsPortalRegistration extends LightningElement {
    // For User Creation
    userObject = USER_OBJECT;
    nameField = NAME;
    emailField = EMAIL;

    // For Account Creation
    accountObject = ACCOUNT_OBJECT;
    startServiceField = START_SERVICE;
    endServiceField = END_SERVICE;
    branchField = BRANCH;
    birthdateField = BIRTHDATE;

    // Used for conditional rendering
    userNotCreated = true;

    // Used to construct User fields
    username = '';
    alias = '';

    // Used to create the account
    userId = '0054U000009YAxyQAG';
    firstName = 'DEFAULT';
    lastName = 'DEFAULT';
    userEmail = 'DEFAULT@DEFAULT.com';

    createUser(event){
        console.log('Entered createUser');
        // Prevent the default submission from happening
        event.preventDefault();

        // Capture the fields that are to be set for the new record
        const fields = event.detail.fields;

        // Store some data for account creation
        this.firstName = fields.FirstName;
        this.lastName = fields.LastName;
        this.userEmail = fields.Email;

        // Set some field values based on input

        // Generate the username based on name field
        this.username = 
        (fields.FirstName).toLowerCase() + fields.LastName 
        + '@claimsPortal.User.' + String(Math.floor(Math.random() * 10001));

        fields.Username = this.username;

        // Set the alias of the user

        this.alias = (fields.FirstName).toLowerCase().slice(0,3) + fields.LastName.slice(0,2) 
        + String(Math.floor(Math.random() * 100));

        fields.Alias = this.alias;

        // Set the profile of the user
        fields.ProfileId = '00e4U000001AXgkQAG';

        // Set the Time Zone for the User
        fields.TimeZoneSidKey = 'America/Los_Angeles';

        // Set the Local for the User
        fields.LocaleSidKey = 'en_US';

        // Set the Language for the User
        fields.LanguageLocaleKey = 'en_US';

        // Set the email encoding for the user
        fields.EmailEncodingKey = 'UTF-8';

        // Finally Submit after our logic has operated.
        this.template.querySelector('lightning-record-edit-form').submit(fields);

        console.log('Submitted');
        this.userNotCreated = false;
    }

    // Begin Account Creation
    createAccount(event){
        console.log('Entered createAccount');
        // Prevent the default submission from happening
        event.preventDefault();

        // Capture the fields that are to be set for the new record
        const fields = event.detail.fields;

        // Set some fields

        // Set the name fields
        fields.FirstName = this.firstName;
        fields.LastName = this.lastName;

        // Set the User lookup to the newly created user
        fields.User__C = this.userId;

        // Set the record id
        fields.RecordTypeId = '0124U000000p1dlQAA';

        // Set the currency
        fields.CurrencyIsoCode = 'USD';

        // Set the email
        fields.Email = this.userEmail;

        // Finally Submit after our logic has operated.
        this.template.querySelector('lightning-record-edit-form').submit(fields);

        console.log('Submitted');

    }

}
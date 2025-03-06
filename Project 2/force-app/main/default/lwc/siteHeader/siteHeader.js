import { LightningElement } from 'lwc';
import LOGO from '@salesforce/resourceUrl/siteLogo'; // Name of your static resource

export default class SiteHeader extends LightningElement {
    headerText = 'Veteran Benefits Portal'; // Change this text
    logoUrl = LOGO;
}
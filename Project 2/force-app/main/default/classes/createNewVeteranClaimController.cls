public class createNewVeteranClaimController {
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getPersonAccount(String userId){
        try {

            // Find and return the Person Account associated with the given user ID
            // SOQL query : SELECT Id,Name, User__c FROM Account WHERE User__c = '0054U000009YAGaQAO'
            System.debug('USER ID RECIEVED : ' + userId);

            return [
                SELECT Id,Name 
                FROM Account
                WHERE User__c = :userId AND RecordTypeId = '0124U000000p1dlQAA'
            ];

            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
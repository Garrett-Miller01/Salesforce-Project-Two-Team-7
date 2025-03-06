public  class viewClaimsController {

    String userId;

    public String getUserId(){
        return UserInfo.getUserId();
    }

    String accountId;

    public String getAccountId(){

       String user = getUserId();

        List<Account> accounts  = [SELECT Id FROM Account WHERE User__c = :user];

        return  accounts.get(0).Id;

    }

    List<Case> claims;

    public List<Case> getClaims () {
        if(claims == null){

            String acc = getAccountId();
            claims = [SELECT CaseNumber, RecordTypeId, Status, CreatedDate, ClosedDate, AccountId FROM Case WHERE AccountId = :acc];
        }
        return claims;
    }

}
public  class viewAppealsController {

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

    List<Appeal__c> appeals;

    public List<Appeal__c> getAppeals () {
        if(appeals == null){

            String acc = getAccountId();
            appeals = [SELECT Name, Case__c, Appeal_Type__c, CreatedDate, Status__c FROM Appeal__c WHERE Account__c = :acc];
        }
        return appeals;
    }

}
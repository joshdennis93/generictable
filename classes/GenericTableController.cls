public class GenericTableController {
    /*
	Method Name	: getRecords
	Purpose		: To get the wrapper of Columns and Headers
	*/
    @AuraEnabled
    public static DataTableResponse getRecords(String strObjectName, String strFieldSetName, String soqlWhere, String soqlLimit, String soqlSort, String recordId){                
       	
        //Get the fields from FieldSet
        Schema.SObjectType SObjectTypeObj = Schema.getGlobalDescribe().get(strObjectName);
        Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();            
        Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get(strFieldSetName);
        
        //To hold the table hearders 
        List<DataTableColumns> lstDataColumns = new List<DataTableColumns>();
        
        //Field to be queried - fetched from fieldset
        List<String> lstFieldsToQuery = new List<String>();
        
        //The final wrapper response to return to component
        DataTableResponse response = new DataTableResponse();
        
        for( Schema.FieldSetMember eachFieldSetMember : fieldSetObj.getFields() ){
            String dataType = String.valueOf(eachFieldSetMember.getType()).toLowerCase();
            //This way we can set the type of a column
            //We do not get the exact type from schema object which matches to lightning:datatable component structure
            //if(dataType == 'datetime'){
            //    dataType = 'date';
            //}
            //Create a wrapper instance and store label, fieldname and type.
            DataTableColumns datacolumns = new DataTableColumns( String.valueOf(eachFieldSetMember.getLabel()) , 
                                                                String.valueOf(eachFieldSetMember.getFieldPath()), 
                                                                String.valueOf(eachFieldSetMember.getType()).toLowerCase(),
                                                                'true' );
			lstDataColumns.add(datacolumns);
            lstFieldsToQuery.add(String.valueOf(eachFieldSetMember.getFieldPath()));
        }
        
        //Form an SOQL to fetch the data - Set the wrapper instance and return as response
        if(! lstDataColumns.isEmpty()){            
            response.lstDataTableColumns = lstDataColumns;
            String query = 'SELECT Id, ' + String.join(lstFieldsToQuery, ',') + ' FROM ' + strObjectName; //change this
            System.debug('soqlWHERE: ' + soqlWhere);
            if (!String.isBlank(soqlWhere)) {
            	query += ' ' + soqlWhere;
            }
            System.debug('soqlSORT: ' + soqlSort);
            if (!String.isBlank(soqlSort)) {
            	query += ' ' + soqlSort;
            }
            System.debug('soqlLIMIT: ' + soqlLimit);
            if (!String.isBlank(soqlLimit)) {
            	query += ' ' + soqlLimit;
            }
            System.debug(query);
            response.lstDataTableData = Database.query(query);
        }
        // line 41: String query = 'SELECT Id, ' + String.join(lstFieldsToQuery, ',') + ' FROM FundAdjustment__c'; //change this
        return response;
    }
    
    //Wrapper class to hold Columns with headers
    public class DataTableColumns {
        @AuraEnabled
        public String label {get;set;}
        @AuraEnabled       
        public String fieldName {get;set;}
        @AuraEnabled
        public String type {get;set;}
        @AuraEnabled
        public String sortable {get;set;}
        //update here to have sortable etc.
        
        //Create and set three variables label, fieldname and type as required by the lightning:datatable
        public DataTableColumns(String label, String fieldName, String type, String sortable){
            this.label = label;
            this.fieldName = fieldName;
            this.type = type;  
            this.sortable = sortable;          
        }
    }
    
    //Wrapper class to hold response - This response is used in the lightning:datatable component
    public class DataTableResponse {
        @AuraEnabled
        public List<DataTableColumns> lstDataTableColumns {get;set;}
        @AuraEnabled
        public List<sObject> lstDataTableData {get;set;}                
        
        public DataTableResponse(){
            lstDataTableColumns = new List<DataTableColumns>();
            lstDataTableData = new List<sObject>();
        }
    }
}
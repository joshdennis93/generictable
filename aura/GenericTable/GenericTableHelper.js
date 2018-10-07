({
    getDataHelper : function(component, event) {
        var action = component.get("c.getRecords");
        //Set the Object parameters and Field Set name
        action.setParams({
            strObjectName : component.get("v.strObjectName"),
            strFieldSetName : component.get("v.strFieldSetName"),
            soqlWhere : component.get("v.soqlWhere"),
            soqlLimit : component.get("v.soqlLimit"),
            soqlSort : component.get("v.soqlSort"),
            recordId : component.get("v.recordId")
        });
        //strObjectName : 'FundAdjustment__c',
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.mycolumns", response.getReturnValue().lstDataTableColumns);
                component.set("v.mydata", response.getReturnValue().lstDataTableData);    
            }else if (state === 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }else{
                console.log('Something went wrong, Please check with your admin');
            }
        });
        $A.enqueueAction(action);	
    },
    
    sortData: function (component, fieldName, sortDirection) {
    	var data = component.get("v.mydata");
        var reverse = sortDirection !== 'asc';
        //sorts the rows based on the column header that's clicked
        data.sort(this.sortBy(fieldName, reverse))
        component.set("v.mydata", data);
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
    },
    
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        //checks if the two rows should switch places
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
})
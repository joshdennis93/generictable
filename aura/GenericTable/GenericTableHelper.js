({
    getDataHelper : function(component, event) {
        var action = component.get("c.getRecords");
        //Set the object parameters and field set name
        action.setParams({
            strObjectName : component.get("v.strObjectName"),
            strFieldSetName : component.get("v.strFieldSetName"),
            soqlWhere : component.get("v.soqlWhere"),
            soqlLimit : component.get("v.soqlLimit"),
            soqlSort : component.get("v.soqlSort"),
            recordId : component.get("v.recordId")
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === 'SUCCESS'){
            	var cols = response.getReturnValue().lstDataTableColumns;
            	/*	if you need to change the behaviour of a specific column i.e. for all 'Name' cols..
					https://salesforce.stackexchange.com/questions/212859/hyperlink-a-record-in-lightningdatatable
            	*/
            	
            	//iterate through all columns returned from lstDataTableColumns & if column name = 'Name', change data type to url
            	for (var i = 0; i < cols.length; i++) {
                	var col = cols[i];
                	
                	/* if (col.fieldName == 'Id') {
                	    col.label = 'Name';
                		col.type = 'url';
                		col['typeAttributes'] = { label: { fieldName: 'Name' } };
                		console.log("  col: " + JSON.stringify(col));
                	} */
                	
                	if (col.fieldName == 'Name') {
                	    col.fieldName = 'Id';
                	    //col.label = 'good?';
                		col.type = 'url';
                		col['typeAttributes'] = { label: { fieldName: 'Name' } };
                	}
                	//https://salesforce.stackexchange.com/questions/216841/record-url-in-lightningdatatable-in-community
                	//https://salesforce.stackexchange.com/questions/212859/hyperlink-a-record-in-lightningdatatable
                }
            	
                component.set("v.mycolumns", response.getReturnValue().lstDataTableColumns);
                       
                var rows = response.getReturnValue().lstDataTableData;
                //if you need to modify the data in a row - e.g. add '$AUD' to end of value: 
				for (var i = 0; i < rows.length; i++) {
                	var row = rows[i];
                	if (row.Id) {
                		console.log("asdf " + JSON.stringify(row));
                		console.log("name " + JSON.stringify(row.Name));
                		row.Id = "/" + row.Id;
                	}
                }
                

                component.set("v.mydata", response.getReturnValue().lstDataTableData);    
            } else if (state === 'ERROR') {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            } else {
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
    },
    
    convertArrayOfObjectsToCSV : function(component, objectRecords) {
    //mostly taken from https://github.com/Manzanit0/CsvExporterButton
        if (objectRecords == null || !objectRecords.length) {
            alert("No records specified."); // TODO: give feedback to the user instead of returning null.
        }

        // CSV file parameters.
        var columnDivider = ',';
        var lineDivider =  '\n';

        // Get the CSV header from the object keys.
        var keys = new Set();
        objectRecords.forEach(function (record) {
            Object.keys(record).forEach(function (key) {
                keys.add(key);
            });
        });

        // set class doesn't have a 'join' method.
        keys = Array.from(keys);

        var csvStringResult = '';
        csvStringResult += keys.join(columnDivider);
        csvStringResult += lineDivider;

        for(var i=0; i < objectRecords.length; i++){
            var counter = 0;

            for(var sTempkey in keys) {
                var skey = keys[sTempkey] ;

                // add ',' after every string value except the first.
                if(counter > 0){
                    csvStringResult += columnDivider;
                }

                // if column is undefined, leave it blank in the CSV file.
                var value = objectRecords[i][skey] === undefined ? '' : objectRecords[i][skey];
                csvStringResult += '"'+ value +'"';

                counter++;

            }

            csvStringResult += lineDivider;
        }

        return csvStringResult;
    }
    
})
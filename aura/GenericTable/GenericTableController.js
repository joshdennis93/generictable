({
    doInit : function(component, event, helper) {		                
        helper.getDataHelper(component, event);
        console.log("new 1");
    },
    
    downloadCSV : function(component, event, helper) {
    //mostly taken from https://github.com/Manzanit0/CsvExporterButton
    	var data = component.get("v.mydata");

        // call the helper function which returns the CSV data as a String
        var csv = helper.convertArrayOfObjectsToCSV(component, data);
        if (csv == null){return;}

        // Create a temporal <a> html tag to download the CSV file
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_self';
        hiddenElement.download = component.get("v.title") +'.csv'; //filename is title as defined in lightning app builder
        document.body.appendChild(hiddenElement); // required for FireFox browser
        hiddenElement.click(); // using click() js function to download csv file
    	
    },
    
    updateColumnSorting: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    }
})
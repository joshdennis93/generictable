# generictable
Generic lightning:datatable using field sets &amp; lightning app builder design parameters to define what &amp; how many fields to show.

Step 1: Add files to your org.

Step 2: Create new field set for the object you want to display data for. Take note of the field set's API name.

Step 3: Create/edit an object's lightning page using the lightning app builder. Drag the GenericTable component from the custom components section onto your page and add the field set API name/object name.

Step 4: Update the SOQL conditions (or leave them blank), configure the other options as required.

Step 5: Hopefully it works!

How it looks:
<br/>
![Example](https://github.com/joshdennis93/generictable/blob/master/example.PNG)
<br/>
Configuration in app builder:
<br/>
![Example LAB](https://github.com/joshdennis93/generictable/blob/master/example%20LAB.PNG)
<br/>
Example of download-as-CSV functionality:
![Example LAB](https://github.com/joshdennis93/generictable/blob/master/example%20download.PNG)
<br/>
<br/>
<br/>
Inspiration & most of the class taken from [here](http://sfdcmonkey.com/2018/01/05/lightning-datatable-base-component/).

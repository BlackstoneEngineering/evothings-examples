// JavaScript code for the mbedTest app

// Short name for EasyBLE library.
var easyble = evothings.easyble;

// Object that holds application data and functions.
var app = {};

// Object that holds beacon devices (if they have advertisementData.kCBAdvDataManufacturerData )
var beacons = {};

// Timer that displays list of beacons.
var updateTimer = null;

// Initialise the application. Wait for dependencies to finish loading.
app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady()) },
		false);
};

// When dependencies have been loaded start scanning.
app.onDeviceReady = function()
{
	console.log('Device Ready!');

	// only list devices once
	easyble.reportDeviceOnce(true);

	// Start Scanning
	app.startScan()

	// Periodically update the list of ibeacons
	updateTimer = setInterval(app.displayBeaconList, 500);
};

// print function that logs to the command line and to the app
app.showInfo = function(info)
{
	document.getElementById('info').innerHTML = info;
	console.log(info);
};

// Start Scanning for beacons
app.startScan = function()
{
	easyble.startScan(
		function(device)
		{
			// print out debug information
			//for(key in device){console.log("\tdevice."+key+":" +device[key])}
			//console.log("\n\r\tname:"+device.name+"  address:"+device.address +" rssi:"+device.rssi +"\n\t ScanRecord:"+device.scanRecord)
			//for(key in device.advertisementData){
			//	console.log("\t"+device.name+".advertisementData."+key+"="+device.advertisementData[key])}
			
			// test BLE devices for advertisementData.kCBAdvDataManufacturerData
			// beacon data is stored in the manufacturer data field
			//if(device.advertisementData.kCBAdvDataManufacturerData != undefined ){
			//	console.log(evothings.util.toHexRawData(device.advertisementData.kCBAdvDataManufacturerData))
			//}

			// Check for Manufacturer Data, necessary for beacons
			// may need to add additional checks here to verify beacons
			if (device.advertisementData.kCBAdvDataManufacturerData != undefined)
			{
				// add device to list of possible beacons
				beacons[device.address]=device;
			}
		},
		function(errorCode)
		{
			app.showInfo('Error: startScan: ' + errorCode + '.');
			//app.reset();
		});
};

app.displayBeaconList = function()
{
	//console.log("HEY YOU! Hurry up and write the DisplayBeaconList function!")
	// Clear beacon list.
	$('#found-beacons').empty();

	for(thing in beacons)
	{
		// get device out of list
		device = beacons[thing]
		// get raw advertising data from ManufacturerData field
		RawData = evothings.util.toHexRawData(device.advertisementData.kCBAdvDataManufacturerData)
		//console.log(device.address +":"+RawData)
		
		var element = $(
			'<li>'
			+		'UUID: ' +device.uuid 	+'<br />'
			+		'Address: ' +device.address 	+'<br />'
			+		'RSSI: ' +device.rssi 	+'<br />'
			+		'ManufacturerData: ' +RawData 		+'<br />'
			+'	<li>'
			);
		$('#found-beacons').append(element);
	}

}


// Initialize the app.
app.initialize();
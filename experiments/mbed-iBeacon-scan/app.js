// JavaScript code for the mbed ibeacon scan app

// Short name for EasyBLE library.
var easyble = evothings.easyble;

// Object that holds application data and functions.
var app = {};

// Object that holds found beacon devices
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

	// only list devices once, useful if there are alot of beacons in the room
	//easyble.reportDeviceOnce(true);

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
			// Check for beacon Prefix = ibeacon prefix
			// YOU CAN MODIFY THIS TO FIND THINGS OTHER THAN iBEACONS!!
			if (evothings.util.toHexRawData(device.scanRecord).slice(0,18) == '0201061aff4c000215' )
			{
				if(beacons[device.address] == undefined){
					app.showInfo("Beacons Found!")
					console.log(evothings.util.toHexRawData(device.scanRecord))
				}
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

// Dynamically update the list of beacons displayed on the screen
app.displayBeaconList = function()
{
	// Clear beacon list.
	$('#found-beacons').empty();

	for(thing in beacons)
	{
		// get device out of list
		device = beacons[thing]
		// get raw advertising data from ManufacturerData field
		RawData = evothings.util.toHexRawData(device.scanRecord).slice(0,62)
		// extract data fields from Raw Data 
		// remember, each byte takes up 2 cahracters, so the numbers are *2
		prefix 	=RawData.slice(0,18)	// 9byte*2 = 18
		proxUUID=RawData.slice(18,50)	// 16byte*2 = 32
		minor  	=RawData.slice(50,54)	
		major 	=RawData.slice(54,58)
		txPower =RawData.slice(58,60)
		
		var element = $(
			'<li>'
			+		'Address: '+device.address  +'<br />'
			+		'RSSI: '+device.rssi 		+'<br />'
			+		'Raw Data: 0x' +RawData 	+'<br />'
			+		'Prefix:   0x' +prefix 		+'<br />'
			+		'ProxUUID: 0x'+proxUUID 	+'<br />'
			+		'Major:   0x'+major  +' ('+parseInt(major,16)  +')' +'<br />'
			+		'Minor:   0x'+minor  +' ('+parseInt(minor,16)  +')'	+'<br />'
			+		'TxPower: 0x'+txPower+' ('+parseInt(txPower,16)+')' +'<br />'
			+'	<li>'
			);
		$('#found-beacons').append(element);
	}
}

// Initialize the app.
app.initialize();

// JavaScript code for the mbed to Evothings custom GAP app

// Short name for EasyBLE library.
var easyble = evothings.easyble;

// Object that holds application data and functions.
var app = {};

// Initialise the application.
app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady()) },
		false);
};

app.onDeviceReady = function()
{
	app.showInfo('Device Ready!');
};

app.showInfo = function(info)
{
	document.getElementById('info').innerHTML = info;
	console.log(info);
};

app.onStartButton = function()
{
	// call stop before you start, just in case something else is running
	app.onStopButton();
	// only report devices once
	easyble.reportDeviceOnce(true);
	app.startScan();
	app.showInfo('Status: Scanning...');
};

app.onStopButton = function()
{
	// Stop any ongoing scan and close devices.
	easyble.stopScan();
	easyble.closeConnectedDevices();
	app.showInfo('Status: Stopped.');
};

app.startScan = function()
{
	easyble.startScan(
		function(device)
		{
			// print out debug information
			//for(key in device){console.log("\tdevice."+key+":" +device[key])}
			console.log("\n\r\tname:"+device.name+"  address:"+device.address +" rssi:"+device.rssi +"\n\t ScanRecord:"+device.scanRecord)
			for(key in device.advertisementData){
				console.log("\t"+device.name+".advertisementData."+key+"="+device.advertisementData[key])}
			
			// catch a specific beacon.
			if(device.address == "CB:6C:D4:E3:4C:96" ){
				console.log(evothings.util.toHexRawData(device.advertisementData.kCBAdvDataManufacturerData))
			}

			// DOTHIS: Change this to match the name of your device
			if (device.name == "ChangeMe!")
			{
				app.showInfo('Status: Device found: ' + device.name + '.');
				easyble.stopScan();
				app.connectToDevice(device);
			}
		},
		function(errorCode)
		{
			app.showInfo('Error: startScan: ' + errorCode + '.');
			//app.reset();
		});
};

// Read services for a device.
app.connectToDevice = function(device)
{
	app.showInfo('Connecting...');
	device.connect(
		function(device)
		{
			app.showInfo('Status: Connected - reading services...');
			app.readServices(device);
		},
		function(errorCode)
		{
			app.showInfo('Error: Connection failed: ' + errorCode + '.');
			evothings.ble.reset();
			// This can cause an infinite loop...
			//app.connectToDevice(device);
		});
};

app.readServices = function(device)
{
	//read all services
	device.readServices(
		null,
		// Function that prints out service data.
		// TODO: make sure this works....
		function(winCode)
		{
			for(key in wincode){
				console.log("\tReadService.wincode."+key+wincode[key]);
			}
		},
		// Use this function to monitor magnetometer data
		// (comment out the above line if you try this).
		//app.startMagnetometerNotification,
		function(errorCode)
		{
			console.log('Error: Failed to read services: ' + errorCode + '.');
		});
};

// Initialize the app.
app.initialize();

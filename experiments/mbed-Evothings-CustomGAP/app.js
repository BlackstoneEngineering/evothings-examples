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

// Initial callback from Evothings Library.
app.onDeviceReady = function()
{
	app.showInfo('Device Ready!');
		// only report devices once
	easyble.reportDeviceOnce(true); // constant stream of data vs single report
	app.startScan();
	app.showInfo('Status: Scanning...');

};

// print debug info to console and app screen
app.showInfo = function(info)
{
	document.getElementById('info').innerHTML = info;
	console.log(info);
};

// Start scanning and handle devices
app.startScan = function()
{
	easyble.startScan(
		function(device)
		{
			if(device.name){return;} // only process un-named devices, aka beacons 
			for(key in device.advertisementData){
				console.log("\t"+device.name+".advertisementData."+key+"="+device.advertisementData[key])}
			
			// add found device to device list
			var element = $(
			'<li style="font-size: 50%" onclick="app.connectToDevice()">'
			+		'<strong>Address: '+device.address  +'</strong><br />'
			+		'RSSI: '+device.rssi+"dB"	+'<br />'
			+		'AdvertisementData: '+app.getHexData(device.advertisementData) +'<br />'
			+		'ManufacturerData: '+app.getHexData(device.advertisementDatakCBAdvDataManufacturerData) +'<br />'
			+'	<li>'
			);
			$('#found-devices').append(element);

			// DOTHIS: Change this to match the name of your device
			if (device.address == "ChangeMeToYourDevicesAddress")
			{
				app.showInfo('Found your device!');
				easyble.stopScan();
				app.doSomething(device);
			}
		},
		function(errorCode)
		{
			app.showInfo('Error: startScan: ' + errorCode + '.');
			//app.reset();
		});
};

// Fill this out with a decoder for your code
app.doSomething = function(device)
{
	// process the device here, break up its data into chunks and print it out.


}

// convert base64 to array to hex.Used to show Advertising Packet Data
app.getHexData = function(data)
{
	if(data){ // sanity check
		return evothings.util.typedArrayToHexString(evothings.util.base64DecToArr(data))	
	}
}

// Initialize the app.
app.initialize();

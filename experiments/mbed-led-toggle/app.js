// JavaScript code for the led toggle app

// Short name for EasyBLE library.
var easyble = evothings.easyble;

// Object that holds application data and functions.
var app = {};

// list of scanned devices
deviceList = {}

// Initialise the application.
app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(app.onDeviceReady()) },
		false);
};

// when low level initialization complete, 
// this function is called
app.onDeviceReady = function()
{
	// report status
	app.showInfo('Device Ready!');
	
	// call stop before you start, just in case something else is running
	easyble.stopScan();
	easyble.closeConnectedDevices();
	
	// only report devices once
	easyble.reportDeviceOnce(true);
	app.startScan();
	app.showInfo('Status: Scanning...');
};

// print debug info to console and application
app.showInfo = function(info)
{
	document.getElementById('info').innerHTML = info;
	console.log(info);
};

// Scan all devices and report
app.startScan = function()
{
	easyble.startScan(
		function(device)
		{
			var name = "";
			//if(device.address != "CB:6C:D4:E3:4C:96"){return 0}
			// do not show un-named beacons
			if(!device.name){return 0;}
			console.log(device.name.toString() +" : "+device.address.toString().split(":").join(''))

			// add device to list of devices
			//deviceList[device.address.split(":").join("")]=device;
			
			// display found device
			//console.log("test="+String(device.address).replace(':',''))
			var element = $(
			//'<li style="font-size: 50%"" onclick="app.connectToDevice('+device.name+')">'
			'<li style="font-size: 50%" onclick="app.connectToDevice()">'
			+		'<strong>Address: '+device.address  +'</strong><br />'
			+name
			+		'RSSI: '+device.rssi+"dB"	+'<br />'
			+		'Name: '+device.name 		+'<br />'
			+		'ServiceUUID: '+device.advertisementData.kCBAdvDataServiceUUIDs +'<br />'
			+'	<li>'
			);
			$('#found-devices').append(element);

			// DOTHIS: Change this to match the name of your device
			if (device.name == "Spiffy2")
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
	console.log("Starting ConnectToDevice")
	app.showInfo('Connecting to '+device.name +"...");
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
			// print Top level of device tree to console
			console.log("\n\r*******\n\rReadServices Sucess\n\r****** "+winCode);
			for(key in winCode){console.log(key+" : " +winCode[key])}
			
			// Print __uuidmap tree to Console
			console.log("\n\r********\n\r__uuidMap\n\r***********")
			for(key in winCode.__uuidMap){
				console.log(key+": "+winCode.__uuidMap[key])
				for(key2 in winCode.__uuidMap[key]){
					console.log("\t"+key2+": "+winCode.__uuidMap[key][key2])
				}

			}

			
			// Print __services Tree to Console
			console.log("\n\r********\n\__services\n\r***********")
			for(key in winCode.__services){
				console.log(key+": "+winCode.__services[key])
				for(key2 in winCode.__services[key]){
					console.log("\t"+key2+": "+winCode.__services[key][key2])
					if(key2 == "__characteristics"){
						for(key3 in winCode.__services[key][key2] ){
							console.log("\t\t"+key3+": "+winCode.__services[key][key2][key3])
							for(key4 in winCode.__services[key][key2][key3] ){
								console.log("\t\t\t"+key4+": "+winCode.__services[key][key2][key3][key4])
								if(key4 == "__descriptors"){
									for(key5 in winCode.__services[key][key2][key3][key4]){
										console.log("\t\t\t\t"+key5+": "+winCode.__services[key][key2][key3][key4][key5])
										for(key6 in winCode.__services[key][key2][key3][key4][key5]){
											console.log("\t\t\t\t\t"+key6+": "+winCode.__services[key][key2][key3][key4][key5][key6])
										}
									}

								}
							}		
						}
					}
				}
				
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

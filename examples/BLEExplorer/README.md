# BLE Explorer

BLE Explorer is an example program that connects to a BLE device and lists services, characteristics and descriptors. The purpose is to provide some basic code as a starting point for learning, tinkering and experimenting.

This is not a ready to use app, rather it is meant to be run from Evothings Workbench, inspecting the output log in the "Tools" Window.

## BLE Crash Course

The structure of a BLE device looks like this:

	device
	  services
	    characteristics
	      descriptors

Key points:

* Services group functionality.
* Characteristics represent data that you can read, write, or subscribe to using notifications.
* Descriptors contain "meta-data" for characteristics, they are not used that often in my experience.

To connect to a BLE device, you first scan for BLE devices, then connect to the device you wish to use. Here is an outline:

* Scan for devices.
* In the scan callback function, identify the device by name (most common method currently, but not perfect).
* When the device you want is found, connect to it.
* When connected scan for services, characteristics, descriptors.
* Write and/or read the characteristics you wish to use. Enable any notifications you will use.

## Running the BLE Explorer app using Evothings Studio

The BLE Explorer app is meant to be run using [**Evothings Studio**](http://evothings.com/download).

When developing apps with Evothings Studio, you run the Evothings Client app on your mobile device to execute the application, and you use Evothings Workbench on your laptop/desktop machine, running a live-reload server.

There are comments in the source code, in file [index.html](https://github.com/divineprog/evo-demos/tree/master/Demos2014/BLEExplorer/index.html), that guides you through the code.

To run the app, do as follows:

* Install the **Evothings Client** app on your iOS or Android device (available in the AppStore and on Google Play).
* [Download Evothings Studio](http://evothings.com/download) and launch Evothings Workbench on your computer.
* Grab the [source code for the BLE Explorer app](https://github.com/divineprog/evo-demos/tree/master/Demos2014/BLEExplorer) from GitHub.
* Drag and drop <b>index.html</b> into the Evothings Workbench project window.
* Open the Tools window in the Workbench by pressing "Tools" (this is where console output will display).
* Check that the BLE device you want to scan for is active/powered on.
* Launch the Evothings Client app and connect to the Workbench.
* Press Run in the Workbench project list window.
* Inspect the result in the Tools window, the name of active BLE devices should appear, if you see none, press Run again.
* Open file index.html in a text editor and update the line<br/>**var myDeviceName = 'TI BLE Sensor Tag'**<br/>to have the name of the BLE device you want to connect to, then save the file (app reloads automatically when you save the code).
* Inspect the result in the Tools window, if successful the program should now connect to the device and print its data.

## Using BLE from JavaScript

To access BLE from JavaScript, the [Evothings BLE plugin for Apache Cordova](https://github.com/evothings/cordova-ble) is used.

Files of interest:

* [ble.js](https://github.com/evothings/cordova-ble/blob/master/ble.js) is the API for the BLE plugin. This file is shipped with the Evothings Client app (which is built with Cordova), and is not included in the source code for the BLE Explorer app.
* [easy-ble.js](https://github.com/divineprog/evo-demos/blob/master/Demos2014/BLEExplorer/easy-ble.js) is a high-level abstraction of the API in ble.js.

Good luck, have fun!

Welcome to ask questions at the [Evothings Forum](http://forum.evothings.com/).


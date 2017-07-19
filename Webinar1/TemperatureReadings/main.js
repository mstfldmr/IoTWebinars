/**
 * Reads the temperature sensor, displays its output on an LCD and sends it to a MQTT broker on the cloud.
 * Grove Kit is used.
 * MRAA and UPM libraries are used.
 */


"use strict" ;

// Include MRAA library
var mraa = require("mraa");
// Add a Firmata subplatform since we are accessing the sensors not directly but through Arduino 101
mraa.addSubplatform(mraa.GENERIC_FIRMATA, "/dev/ttyACM0");


// Include the JavaScript UPM libraries
var groveSensor = require('jsupm_grove');
var LCD = require("jsupm_i2clcd");

// The Offset is necessary for Firmata
var OFFSET = 512;

// Create a new instance of a Grove temperature sensor and Grove RGB LCD screen
// Instantiate the temperature sensor and LCD actuator
var my_temp = new groveSensor.GroveTemp(1 + OFFSET);

var my_lcd = new LCD.Jhd1313m1(0 + OFFSET, 0x3E, 0x62);



function monitor() {
    
    // Read the temperature sensor
    var celsius = my_temp.value() * 0.66 ;
    celsius = celsius.toFixed(2);

    // convert it to Fahrenheit
    var fahrenheit = Math.round(celsius * 9.0 / 5.0 + 32.0);
    fahrenheit = fahrenheit.toFixed(2);
    
    // Log it to the console window
    console.log(celsius + "° Celsius, or " + fahrenheit + "° Fahrenheit");
    
    // Update the LCD screen
	my_lcd.setColor(255, 50, 150);
    
    
    my_lcd.setCursor(0, 0);
    my_lcd.write("Temp: " + celsius + "C");
    
    my_lcd.setCursor(1, 0);
    my_lcd.write("Temp: " + fahrenheit + "F");
    
}

setInterval(function() {
    monitor();
}, 1000);


// Include MQTT package
var mqtt    = require('mqtt');


// MQTT parameters
var URL = 'mqtt://test.mosquitto.org:1883'; 
var CLIENTID= 'myIntelIoTGateway';
var TOPIC = 'sensors/temperature';


// Connect to the MQTT broker
var client  = mqtt.connect(URL, { clientId: CLIENTID });

client.on('connect', function () {
    console.log("connected to the broker");
    
    setInterval(function(){
        // Read the temperature sensor
        var celsius = my_temp.value() * 0.66 ;
        celsius = celsius.toFixed(2);
        
        client.publish(TOPIC, celsius);
        
    }, 2000);
});
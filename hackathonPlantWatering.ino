
#include "Adafruit_SHTC3.h"
#include <Servo.h>

#define SERVO 11
Servo servo; // initialize servo

unsigned long StartTime;
Adafruit_SHTC3 waterSense = Adafruit_SHTC3();

void setup() {
  // put your setup code here, to run once:

  Serial.begin(9600);// serial moniter
  Serial.println("serial moniter starting");

 StartTime = millis();


  servo.attach(SERVO);

  while (!Serial)// Humidity sensor
    delay(10);     // will pause Zero, Leonardo, etc until serial console opens

  Serial.println("SHTC3 test");
  if (! waterSense.begin()) {
    Serial.println("Couldn't find SHTC3");
    while (1) delay(1);
  }
  Serial.println("Found SHTC3 sensor");
}



void loop() {
  // put your main code here, to run repeatedly:

sensors_event_t humidity, temp;
  
  waterSense.getEvent(&humidity, &temp);// populate temp and humidity objects with fresh data
  
  Serial.print("Temperature: ");
  Serial.print(temp.temperature);
  Serial.println(" degrees C");

  Serial.print("Humidity: ");
  Serial.print(humidity.relative_humidity);
  Serial.println("% rH");

  delay(1000);


if ( (millis() - StartTime) > 60000 )
{
  if (humidity.relative_humidity < 25)
  {
    servo.write(40);
    delay(300);
    servo.write(0);
    Serial.println("motor moved*******");
  }else
  {
    //servo.write(0);
  }

  StartTime = millis();

} else
{
  servo.write(0);
  Serial.println(millis() - StartTime);
  
}

  










}

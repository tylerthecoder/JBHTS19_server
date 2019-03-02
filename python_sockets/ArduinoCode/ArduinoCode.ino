#include <stdlib.h>

void setup()
{
  // put your setup code here, to run once:
  pinMode(2, OUTPUT);
  pinMode(10, INPUT);
  pinMode(9, INPUT);
  pinMode(11, INPUT);
  digitalWrite(2, LOW);
  Serial.begin(9600);
}

boolean hasWrit = false;
boolean pyAck = false;
boolean discovered = false;
String lat = "36.066124";
String lon = "-94.173745";
void loop()
{
  
  if (!hasWrit && pyAck) {
    Serial.write(lat.c_str());
    Serial.write(" ");
    Serial.write(lon.c_str());
    hasWrit = true;
  }
  //if serial connection
  if (Serial.available() > 0)
  {
    //Serial.print("available");
    
    //int readIn = (int) (Serial.read() - 48);
    int readIn = Serial.parseInt();
    //Serial.println(readIn);
    if (readIn == 12) {
      pyAck = true;
    } else if (hasWrit) {
      digitalWrite((readIn / 2)+2, (uint8_t)readIn % 2);
    }
   } //end serial
  
   if (!discovered && digitalRead(10) == HIGH) {
     char outPinNum[3];
     sprintf(outPinNum, "%d", 10);
     Serial.write(outPinNum);
     discovered = true;
   } 
}

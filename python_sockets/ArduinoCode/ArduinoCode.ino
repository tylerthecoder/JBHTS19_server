#include <stdlib.h>

void setup()
{
  // put your setup code here, to run once:
  pinMode(2, OUTPUT);
  digitalWrite(2, LOW);
  Serial.begin(9600);
}


void loop()
{
  //if serial connection
  if (Serial.available() > 0)
  {
    Serial.print("available");
    
    int readIn = (int) (Serial.read() - 48);
    digitalWrite((readIn / 2)+2, (uint8_t)readIn % 2);
 
   
  } //end serial
}

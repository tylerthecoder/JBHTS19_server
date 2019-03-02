#include <stdlib.h>

void setup() {
  // put your setup code here, to run once:
  pinMode(2,OUTPUT);
  digitalWrite(2,LOW);
  Serial.begin(9600);
}

int i = 0;
int id;
int state;



void loop() {
  //if serial connection 
  if(Serial.available() > 0) {
    Serial.print("available");
    
    if (i == 0) {
      id = (int) (Serial.read() - 48);
      id += 2;
    } else if (i == 1) {
        state = (int) (Serial.read() - 48);
     
      Serial.println(id);
      Serial.println(state);
      if (state == 1) {
        digitalWrite(id, HIGH);
      } else {
          digitalWrite(id, LOW);
      }
      i = -1;
    }
    i++;

    
  }//end serial


}

from firebase_admin import credentials
from firebase_admin import firestore
import firebase_admin
import datetime
import time
import RPi.GPIO as GPIO

# Initializing Sensor and LEDs
FLOW_SENSOR_GPIO = 13
GreenLEDOnePin = 17
BlueLEDOnePin = 27
BlueLEDTwoPin = 22
RedLEDOnePin = 24
RedLEDTwoPin = 23
 
GPIO.setmode(GPIO.BCM)
GPIO.setup(FLOW_SENSOR_GPIO, GPIO.IN, pull_up_down = GPIO.PUD_UP)

GPIO.setup(GreenLEDOnePin, GPIO.OUT)   
GPIO.output(GreenLEDOnePin, GPIO.LOW) 
GPIO.setup(BlueLEDOnePin, GPIO.OUT)   
GPIO.output(BlueLEDOnePin, GPIO.LOW) 
GPIO.setup(BlueLEDTwoPin, GPIO.OUT)   
GPIO.output(BlueLEDTwoPin, GPIO.LOW) 
GPIO.setup(RedLEDOnePin, GPIO.OUT)   
GPIO.output(RedLEDOnePin, GPIO.LOW) 
GPIO.setup(RedLEDTwoPin, GPIO.OUT)   
GPIO.output(RedLEDTwoPin, GPIO.LOW) 

global count
global start_counter
start_counter = 1
count = 0
 
def countPulse(channel):
   global count
   if start_counter == 1:
      count = count+1
      time.sleep(1)
 
GPIO.add_event_detect(FLOW_SENSOR_GPIO, GPIO.FALLING, callback=countPulse)

def loop():
    try:
        # Get a service account key from firebase and initialize the app
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        # Get the database
        db = firestore.client()
        last_count = 0
        # Add a while loop that runs forever
        while True:
            start_counter = 1
            time.sleep(.5)
            start_counter = 0
            flow = (count / 7.5)
            # Get the document that contains the last date the function was run
            doc_ref = db.collection(u'users').document(u'pec4sqnpkmYt6hnzlyWD0wl1X772')
            doc = doc_ref.get()
            # Get the last date the function was run
            lastDate = doc.to_dict().get("date")
            # Get the recommended water intake from the firestore database
            recommendedWaterIntake = doc.to_dict().get('recommendedWaterIntake')
            # Add an if statement to check if recommended water intake is 0
            if recommendedWaterIntake != 0:
                # Declare a percentage variable
                percentage = 0
                # Get the current date
                currentDate = str(datetime.datetime.now())
                # An if statement to check if there is a reading from the water sensor and start a counter for the water intake if there is a reading from the water sensor and save the flow value in a variable called waterFlow it also gets the new value every second
                waterIntake = 0
                if flow > 0:
                    waterIntake += (flow/60)
                    time.sleep(1)
                    
                flow = 0
                # Get the latest water intake
                latestWaterIntake = waterIntake
                # If the last date the function was ran is not the same as the current date, update the firestore document with the current date and set the current water intake to 0 else update the current water intake by getting the old value and adding the new value
                if lastDate != currentDate[0:10]:
                    doc_ref.update({
                        u'date': currentDate[0:10],
                        u'currentWaterIntake': 0
                    })
                else:
                    if last_count != count:
                        currentWaterIntake = doc.to_dict().get('currentWaterIntake')
                        doc_ref.update({
                            u'currentWaterIntake': currentWaterIntake + latestWaterIntake
                        })
                        last_count = count
                # Calculate the percentage of water intake based off the recommended water intake from the firestore database
                currentWaterIntake = doc.to_dict().get('currentWaterIntake')
                percentage = (currentWaterIntake/recommendedWaterIntake)*100

                # An if statement that checks the current water intake percentage based off the recommended water intake from the firestore database and turns on the leds accordingly
                if percentage < 20:  
                    GPIO.output(GreenLEDOnePin, GPIO.LOW)  
                    GPIO.output(BlueLEDOnePin, GPIO.LOW) 
                    GPIO.output(BlueLEDTwoPin, GPIO.LOW) 
                    GPIO.output(RedLEDOnePin, GPIO.HIGH)  
                    GPIO.output(RedLEDTwoPin, GPIO.LOW) 
                elif percentage < 40:
                    GPIO.output(GreenLEDOnePin, GPIO.LOW)  
                    GPIO.output(BlueLEDOnePin, GPIO.LOW) 
                    GPIO.output(BlueLEDTwoPin, GPIO.LOW) 
                    GPIO.output(RedLEDOnePin, GPIO.HIGH)  
                    GPIO.output(RedLEDTwoPin, GPIO.HIGH) 
                elif percentage < 60:
                    GPIO.output(GreenLEDOnePin, GPIO.LOW)  
                    GPIO.output(BlueLEDOnePin, GPIO.LOW) 
                    GPIO.output(BlueLEDTwoPin, GPIO.HIGH) 
                    GPIO.output(RedLEDOnePin, GPIO.HIGH)  
                    GPIO.output(RedLEDTwoPin, GPIO.HIGH) 
                elif percentage < 80:
                    GPIO.output(GreenLEDOnePin, GPIO.LOW)  
                    GPIO.output(BlueLEDOnePin, GPIO.HIGH) 
                    GPIO.output(BlueLEDTwoPin, GPIO.HIGH) 
                    GPIO.output(RedLEDOnePin, GPIO.HIGH)  
                    GPIO.output(RedLEDTwoPin, GPIO.HIGH) 
                else:
                    GPIO.output(GreenLEDOnePin, GPIO.HIGH)  
                    GPIO.output(BlueLEDOnePin, GPIO.HIGH) 
                    GPIO.output(BlueLEDTwoPin, GPIO.HIGH) 
                    GPIO.output(RedLEDOnePin, GPIO.HIGH)  
                    GPIO.output(RedLEDTwoPin, GPIO.HIGH) 
    except KeyboardInterrupt:
            GPIO.cleanup();
            sys.exit()

if __name__ == '__main__':
    loop()

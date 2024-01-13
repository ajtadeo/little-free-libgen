// sample curl command:
// curl -X POST -d "book=LOTR&id=12345" http://192.168.1.7/unlock

#include "secrets.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <Dictionary.h>

#include <SPI.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

// Music Notes
#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978

#define REST 0
#define speaker 9

// music
const int tempo = 35;

const int cntStartNotes = 7;
int startNotes[cntStartNotes] = {NOTE_E6, NOTE_E6, NOTE_E6, NOTE_C6, NOTE_E6, NOTE_G6, NOTE_G5};
int startDelay[2*cntStartNotes] = {2, 2, 2, 6, 2, 6, 2, 2, 2, 6, 8, 8, 8, 8};
bool startFlags[2*cntStartNotes] = {false, false, false, false, true, false, false, false, false, true, false, true, false, true};

const int cntDeathNotes = 11;
int deathNotes[cntDeathNotes] = {NOTE_B5, NOTE_F6, NOTE_F6, NOTE_F6, NOTE_E6, NOTE_D6, NOTE_C6, NOTE_E5, NOTE_G4, NOTE_E5, NOTE_C6};
int deathDelay[2*cntDeathNotes] = {4, 1, 2, 5, 2, 2, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2};


void playSound(int n, int notes[], int rest[]) {
    for (int i = 0; i < n; i++)
    {
      tone(speaker, notes[i]);
      delay(tempo*rest[2*i]);
      noTone(speaker);
      
      delay(tempo*rest[2*i+1]);
    }
}

#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32

// Define the Adafruit OLED Display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void drawUnlockScreen() {
  display.setTextSize(2);
  display.setTextColor(WHITE);

  display.setCursor(10, 25);
  display.print("Unlocked!");

  display.drawRect(0, 0, 128, 64, WHITE);
  display.display();
  playSound(cntStartNotes, startNotes, startDelay);
}

void drawLockScreen() {
  display.setTextSize(2);
  display.setTextColor(WHITE);

  display.setCursor(25, 25);
  display.print("Locked!");

  display.drawRect(0, 0, 128, 64, WHITE);
  display.display();
    playSound(cntDeathNotes, deathNotes, deathDelay);
}

void drawWelcomeScreen() {
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(25, 5);
  display.print("SCAN BOOK");
  display.setCursor(25, 15);
  display.print("TO UNLOCK!");

  display.display();
}

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int status = WL_IDLE_STATUS;                // the Wi-Fi radio's status
WiFiServer server(80);

void setup() {
  Serial.begin(9600);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Show initial display buffer contents on the screen --
  // the library initializes this with an Adafruit splash screen.
  // display.display();
  // delay(2000); // Pause for 2 seconds

  // Clear the buffer
  display.clearDisplay();
  display.display();

  while (!Serial);

  while (status != WL_CONNECTED){
    Serial.print("Attempting to connect to network: ");
    Serial.println(ssid);
    status = WiFi.begin(ssid, pass);
    delay(10000);
  }
  Serial.println();
  printWifiStatus();
  Serial.println("---------------------------------------");
  server.begin();                           // start the web server on port 80
}

void loop() {
  WiFiClient client = server.available();   // listen for incoming clients

  if (client) {
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();
        Serial.write(c);
        if (c != '\r') {                    // if you got anything else but a carriage return character,
          currentLine += c;                 // add it to the end of the currentLine
        }
        // parse POST requests 
        if (currentLine.endsWith("POST /unlock")) {
          display.clearDisplay();
          drawUnlockScreen();
          processPostRequest(client);
          break;
        }
        if (currentLine.endsWith("POST /lock")) {
          display.clearDisplay();
          drawLockScreen();
          processPostRequest(client);
          break;
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}

void processPostRequest(WiFiClient client) {
  String currentLine = "";
  String contentLengthHeader = "Content-Length: ";
  int contentLengthIndex = -1;
  int contentLength = 0;
  char c;

  // extract content length
  while (client.connected()) {
    if (client.available()) {
      c = client.read();
      Serial.write(c);
      if (c == '\n') {
        currentLine = "";
      } else if (c != '\r') {
        currentLine += c;
      }

      // check for the "Content-Length: " pattern
      contentLengthIndex = currentLine.indexOf(contentLengthHeader);
      if (contentLengthIndex != -1) {
        contentLengthIndex = contentLengthHeader.length();
        while (c != '\r') {
          c = client.read();
          Serial.write(c);
          currentLine += c;
        }
        int eolIndex = currentLine.indexOf('\r\n');
        contentLength = currentLine.substring(contentLengthIndex, eolIndex).toInt();
        break;
      }
    }
  }

  // extract body
  while (client.connected()) {
    if (client.available()) {
      c = client.read();
      Serial.write(c);
      if (c == '\n') {
        if (currentLine.length() == 0) {
          // got a newline, so the body follows with length = contentLength
          for (int i = 0; i < contentLength; i ++) {
            c = client.read();
            Serial.write(c);
            currentLine += c;
          }
          break;
        } else {
          currentLine = "";
        }
      } else if (c != '\r') {
        currentLine += c;
      }
    }
  }

  Serial.println();
  // Serial.println();
  // Serial.print("found content-length: ");
  // Serial.println(contentLength);
  // Serial.print("found body: ");
  // Serial.println(currentLine);

  char body[currentLine.length() + 1];
  currentLine.toCharArray(body, sizeof(body));
  Dictionary *dict = new Dictionary();
  parseQueryString(body, dict);
  // TODO: do something with this dictionary ...

  // send an OK response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:text/html");
  client.println();
  client.println();
}

void parseQueryString(char* queryString, Dictionary* dict) {
  char* str;
  str = strtok(queryString, "=");
  while (str != NULL) {
    // Serial.println(str);
    char* key = str;
    str = strtok(NULL, "&");
    char* value = str;
    str = strtok(NULL, "=");

    Serial.print(key);
    Serial.print(", ");
    Serial.println(value);
    dict->insert(key, value);
  }
}

void printWifiStatus() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP Address: ");
  Serial.println(ip);

  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI):");
  Serial.print(rssi);
  Serial.println(" dBm");
  // print where to go in a browser:
  Serial.print("To see this page in action, open a browser to http://");
  Serial.println(ip);
}
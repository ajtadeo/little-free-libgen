// sample curl command:
// curl -X POST -d "book=LOTR&id=12345" http://192.168.1.7/unlock

#include "secrets.h"
#include "pitches.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
#include <Dictionary.h>

/* MUSIC */
#define SPEAKER 9
#define TEMPO 35

const int RELAY_PIN = A3;

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
      tone(SPEAKER, notes[i]);
      delay(TEMPO*rest[2*i]);
      noTone(SPEAKER);
      
      delay(TEMPO*rest[2*i+1]);
    }
}

/* DISPLAY */
#define SCREEN_WIDTH 128  // OLED display width, in pixels
#define SCREEN_HEIGHT 64  // OLED display height, in pixels
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C ///< See datasheet for Address; 0x3D for 128x64, 0x3C for 128x32

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

void unlockDoor() {
  digitalWrite(RELAY_PIN, HIGH);
}

void lockDoor() {
  digitalWrite(RELAY_PIN, LOW);
}

void drawUnlockScreen() {
  display.setTextSize(2);
  display.setTextColor(WHITE);

  display.setCursor(13, 25);
  display.print("Unlocked!");

  display.drawRect(0, 0, 128, 64, WHITE);
  display.display();
}

void drawLockScreen() {
  display.setTextSize(2);
  display.setTextColor(WHITE);

  display.setCursor(27, 25);
  display.print("Locked!");

  display.drawRect(0, 0, 128, 64, WHITE);
  display.display();
}

void drawWelcomeScreen() {
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(7, 15);
  display.print("Little Free Libgen");
  display.setCursor(7, 25);
  display.print("==================");
  display.setCursor(3, 35);
  display.print("Scan a book to start");
  display.setCursor(27, 45);
  display.print("an exchange!");

  display.display();
}

void drawCheckInScreen(String title, String author) {
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(20, 5);
  display.print("== Checking in == ");
  display.setCursor(0, 15);
  display.print(title);
  display.setCursor(0, 25);
  display.print("by " + author);
  display.setCursor(0, 45);
  display.print("Check out a book to");
  display.setCursor(0, 55);
  display.print("continue...");

  display.display();
}

void drawCheckOutScreen(String title, String author) {
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(16, 5);
  display.print("== Checking out ==");
  display.setCursor(0, 15);
  display.print(title);
  display.setCursor(0, 25);
  display.print("by " + author);
  display.setCursor(0, 45);
  display.print("Thanks for using");
  display.setCursor(0, 55);
  display.print("Little Free Libgen!");

  display.display();
}

/* WIFI */
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int status = WL_IDLE_STATUS;                // the Wi-Fi radio's status
WiFiServer server(80);

void processPostRequest(WiFiClient client, String& title, String& author) {
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

  char body[currentLine.length() + 1];
  currentLine.toCharArray(body, sizeof(body));
  Dictionary &dict = *(new Dictionary(2));
  parseQueryString(body, dict);
  title = dict["title"];
  author = dict["author"];

  // send an OK response
  client.println("HTTP/1.1 200 OK");
  client.println("Content-type:text/html");
  client.println();
  client.println();
}

String urlDecode(String str) {
  int length = str.length();
  String result = "";
  for (int i = 0; i < length; i++) {
    if (str[i] == '%' && str.substring(i, i+3) == "%20") {
      result += ' ';
      i += 2;
    } else {
      result += str[i];
    }
  }
  return result;
}

void parseQueryString(char* queryString, Dictionary &dict) {
  char* str;
  str = strtok(queryString, "=");
  while (str != NULL) {
    char* key = str;
    str = strtok(NULL, "&");
    char* value = str;
    str = strtok(NULL, "=");

    dict(key, urlDecode(value));
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

/* MAIN */
void setup() {
  Serial.begin(9600);

  pinMode(RELAY_PIN, OUTPUT);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

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

  display.clearDisplay();
  drawWelcomeScreen();
}

void loop() {
  WiFiClient client = server.available();   // listen for incoming clients
  String title = "";
  String author = "";

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
          processPostRequest(client, title, author);
          display.clearDisplay();
          drawUnlockScreen();
          unlockDoor();
          playSound(cntStartNotes, startNotes, startDelay);
          delay(1000);
          display.clearDisplay();
          drawCheckInScreen(title, author);
          break;
        }
        if (currentLine.endsWith("POST /lock")) {
          processPostRequest(client, title, author);
          display.clearDisplay();
          drawLockScreen();
          lockDoor();
          playSound(cntDeathNotes, deathNotes, deathDelay);
          delay(1000);
          display.clearDisplay();
          drawCheckOutScreen(title, author);
          delay(5000);
          display.clearDisplay();
          drawWelcomeScreen();
          break;
        }
      }
    }
    // close the connection:
    client.stop();
    Serial.println("client disconnected");
  }
}
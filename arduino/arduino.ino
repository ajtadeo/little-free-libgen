// sample curl command:
// curl -X POST -d "book=LOTR&id=12345" http://192.168.1.7/unlock

#include "secrets.h"
#include <SPI.h>
#include <WiFiNINA.h>
#include <Dictionary.h>

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;

int status = WL_IDLE_STATUS;                // the Wi-Fi radio's status
WiFiServer server(80);

void setup() {
  Serial.begin(9600);
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
          processPostRequest(client);
          break;
        }
        if (currentLine.endsWith("POST /lock")) {
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
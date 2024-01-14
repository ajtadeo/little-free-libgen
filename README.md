![little-free-libgen-header](https://github.com/ajtadeo/little-free-libgen/assets/76643809/08594de3-67a9-4da2-991b-44324a4edd81)

# Little Free Libgen
_A digitized book exchange program for the modern age._

Built by [Charles Bucquet](https://github.com/cbucquet),  [Marcus Cheng](https://github.com/marcuscheng123), [Alyssa Tadeo](https://github.com/ajtadeo), [Tyler Tran](https://github.com/tylerdtran), and [Kevin Zhang](https://github.com/kevz1209) for Idea Hacks 2024.

[Idea Hacks 2024 DevPost](https://devpost.com/software/little-free-libgen)

## Tools Used
* React Native
* MongoDB
* Express
* Arduino Nano 33 IoT
  * 12V Door Lock Solenoid
  * 3V Buzzer
  * 128x64 OLED Display
  * Web Server
* SolidWorks

## What it does
Little Free Libgen is composed of a network of library units with their contents easily accessible through a mobile app. Users can exchange a book by scanning the ISBN barcodes of the checked-in and checked-out books. This unlocks and locks the library while simultaneously updating the unit's catalog of currently present books. Each the catalog of each library unit can be explored on app's the main map page.

## How we built it
Our library unit was entirely designed in SolidWorks. These units feature laser-cut acrylic and 3D printed hinges and handles. Housed within this library unit is a central Arduino Nano 33 IoT which hosts a web server to wireless communicate with our mobile app over WiFi. This Arduino controls a solenoid to lock/unlock the library unit, an OLED display to instruct the user, and a buzzer for audio feedback. 

<img width="337" alt="image" src="https://github.com/ajtadeo/little-free-libgen/assets/76643809/e02e5589-8768-4508-9811-b13cbed00f4d">

_SolidWorks Mockup_

<img width="337" alt="image" src="https://github.com/ajtadeo/little-free-libgen/assets/76643809/de569914-5c29-4da7-931b-38f2bb9c7c96">

_Arduino Schematic_

For the mobile app, we used a MongoDB database in the backend and used React Native in the frontend which are connected through an Express API. Through our app users can view all library unit catalogs and scan ISBN barcodes to check-in/check-out books. Scanning an IBSN barcode prompts an API call to [IBSNdb](https://isbndb.com/) which fetches a book's title, author, IBSN, and cover image. Using this database, virtually any book can be checked-in or checked-out of our library units!

## Idea Hacks 2024

<img width="337" alt="image" src="https://github.com/ajtadeo/little-free-libgen/assets/76643809/9e4df5af-1ee5-4cda-be1b-38a827341ed4">

_Library Unit_

<img width="337" alt="image" src="https://github.com/ajtadeo/little-free-libgen/assets/76643809/1bdb3036-96b4-4f45-bf26-1bc9b7aafa2d">

_Library Unit Electronics_



## What's next for Little Free Libgen
Our next step would be to make a review feed. Users could write reviews on the books that they read and they could see the reviews of other readers in the area or people they follow. Users could also search up a book to read more specific reviews. This system would increase engagement and community among users and provide incentive to check-out highly rated books. 

Another feature we could add is a point redemption program, where users can redeem the points that they get from exchanging books for prizes, such as cool bookmarks, gift cards to local book stores, or actual books. 

Lastly, we could add a "Books of the Month" feature, where we would choose 4 books to feature monthly based on check-in/check-out frequency. There can be a discussion forum where people can discuss what they like/dislike about the book and a data visualization of each teach's popularity over time.

On the physical side, the next step would be to replace the acrylic with wood, and the 3D printed parts with machined parts, to make the structure more sturdy. In addition, we would increase the display screen so that it is an appropriate size compared to the box.

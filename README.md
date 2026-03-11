# Flux Battery Tracker

> [!WARNING]  
> Flux currently requires an active internet connection

## What is Flux?
Flux is a battery management platform for competitive robotics competitions (Made for the FIRST Robotics Competition).

## How to set up Flux
Flux is a Next.js web app that uses a Redis database. The recommended way to deploy your Flux instance is by forking the repo and deploying it to Vercel. You will also need to add the database info in the enviromnment variabes page (if you go the vercel method) or your .env file in your chosen deployment enviroment. 
> [!NOTE]  
> Better Settup Guide Comming Soon

## Screenshots
### Home Screen
<img width="2940" height="1614" alt="Screenshot 2026-03-11 at 14-57-03 1306 Battery Tracker" src="https://github.com/user-attachments/assets/875b43d1-13b3-4a4d-9411-1c1af82147c6" />


### Pit Manager View
<img width="2940" height="1614" alt="Screenshot 2026-03-11 at 14-59-34 1306 Battery Tracker" src="https://github.com/user-attachments/assets/cc2b71e6-4a18-44da-a5e4-a68811f0116c" />

## Features
- Manages Battries in the pits including charge time and slot in your battery cart
- Discharge testing (if your team does it) and keeping track of your best batrries
- QR codes on your batterys for quick event entering
- (Future) On robot discharge tracking during matches

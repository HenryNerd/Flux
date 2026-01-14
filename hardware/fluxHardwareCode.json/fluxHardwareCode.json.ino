#include <Adafruit_GFX.h>
#include <Adafruit_ST7789.h>
#include <SPI.h>

#define TFT_CS 10
#define TFT_DC 9
#define TFT_RST 8

Adafruit_ST7789 tft = Adafruit_ST7789(TFT_CS, TFT_DC, TFT_RST);

void setup() {
  Serial.begin(9600);

  tft.init(240, 240);
  tft.setRotation(2);

  noBatteryScreen();
}

void noBatteryScreen() {
  tft.fillScreen(ST77XX_ORANGE);
  tft.fillRect(0, 0, 240, 40, ST77XX_RED);
  tft.setTextColor(ST77XX_WHITE);
  tft.setTextSize(2);
  tft.setCursor(15, 15);
  tft.println("BadgerBOTS 1306");
  tft.setCursor(90, 80);
  tft.setTextSize(4);
  tft.println("No");
  tft.setCursor(35, 115);
  tft.println("Battery");
}

void loop() {
}

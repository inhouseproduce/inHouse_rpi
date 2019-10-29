import RPi.GPIO as gp

pins = {
    "lights": 4,
    "main_pump": 17,
    "elongation_pump": 27,
    "brightness": 21
}

gp.setmode(gp.BCM)
gp.setwarnings(False)
for system, pin in pins.items():
    gp.setup(pin, gp.OUT)
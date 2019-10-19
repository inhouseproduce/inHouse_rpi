#!/usr/bin/python3
import RPi.GPIO as gp
import climate as climate
import backup_temperature as backup
import datetime


def setHeat(temp, ideal, pin):
    if temp < ideal:
        gp.output(pin, False)
    else:
        gp.output(pin, True)


def setHumid(humidity, ideal, pin):
    if humidity < ideal:
        gp.output(pin, False)
    else:
        gp.output(pin, True)


def setPin(pin):
    gp.setup(pin, gp.OUT)


def main():
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)

    idealTemp = 73
    idealHumid = 97

    heatPin = 11
    humidPin = 13
    
    setPin(heatPin)
    setPin(humidPin)

    cTemp = 0
    fTemp = 0 
    humidity = 0

    try:
        cTemp, fTemp, humidity = climate.get_climate()
    except:
        print("climate failed")
        try: 
            cTemp, fTemp = climate.backup_temp()
        except:
            print("backup temp failed")
            now = datetime.datetime.now()
            if now.minute == 0:
                setHumid(0, idealHumid, humidPin)
                setHeat(0, idealHumid, humidPin)
            else:
                setHumid(100, idealHumid, humidPin)
                setHeat(100, idealHumid, humidPin)
        else:
            print('backup temp: ',fTemp)
            setHeat(fTemp, idealTemp, heatPin)
            
    else:
        print("got sht31 data:")
        print("fTemp: ",fTemp)
        print("humidity: ",humidity)
        setHeat(fTemp, idealTemp, heatPin)
        setHumid(humidity, idealHumid, humidPin)

if __name__ == "__main__":
    main()
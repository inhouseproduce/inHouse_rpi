#!/usr/bin/python3
import RPi.GPIO as gp
import os
import glob
import time
import json
import smbus
import datetime


def get_backup_temperature():
    pin = 7
    gp.setmode(gp.BOARD)
    gp.setwarnings(False)
    gp.setup(pin, gp.IN)

    return gp.input(pin)


def read_temp_raw():
    base_dir = '/sys/bus/w1/devices/'
    device_folder = glob.glob(base_dir + '28*')[0]
    device_file = device_folder + '/w1_slave'

    f = open(device_file, 'r')
    lines = f.readlines()
    f.close()
    return lines
 

def read_temp():
    lines = read_temp_raw()
    while lines[0].strip()[-3:] != 'YES':
        time.sleep(0.2)
        lines = read_temp_raw()
    equals_pos = lines[1].find('t=')
    if equals_pos != -1:
        temp_string = lines[1][equals_pos+2:]
        temp_c = float(temp_string) / 1000.0
        temp_f = temp_c * 9.0 / 5.0 + 32.0
        return 'Water Temperature in Celsius is : %.1f C\nWater Temperature in Farenheit is : %.1f F\n' %(temp_c,temp_f)


def get_climate():
    # Get I2C bus
    bus = smbus.SMBus(1)

    # SHT31 address, 0x44(68)
    bus.write_i2c_block_data(0x44, 0x2C, [0x06])

    time.sleep(0.5)

    # SHT31 address, 0x44(68)
    # Read data back from 0x00(00), 6 bytes
    # Temp MSB, Temp LSB, Temp CRC, Humididty MSB, Humidity LSB, Humidity CRC
    data = bus.read_i2c_block_data(0x44, 0x00, 6)

    # Convert the data
    temp = data[0] * 256 + data[1]
    cTemp = -45 + (175 * temp / 65535.0)
    fTemp = -49 + (315 * temp / 65535.0)
    humidity = 100 * (data[3] * 256 + data[4]) / 65535.0

    # Output data to file

    return cTemp, fTemp, humidity


def write_climate(filename):
    with open('%s' %filename, 'w+') as climate_file:

        cTemp, fTemp, humidity = get_climate()

        output = {
        'Temperature': {
            'Celsius' : round(cTemp,1),
            'Fahrenheit': round(fTemp,1)
        },
        'Humidity': round(humidity,1)
    }
        
        json.dump(output, climate_file)


def main(pathway, date):
    date = date or datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    filename = 'climate_readings_%s.txt' %date
    write_climate(filename)

    os.system('s3cmd put %s %s' %(filename, pathway + filename))
    os.system('rm %s' %filename)


if __name__ == "__main__":  
        main()
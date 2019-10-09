#!/usr/bin/python3
import os
import glob
import time
import smbus
import datetime
import configparser


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

def write_climate(file_path):
    climate_file = open('%s' %file_path, 'w+')
    # climate_file.write(read_temp())
    # Get I2C bus
    bus = smbus.SMBus(1)
     
    # SHT31 address, 0x44(68)
    bus.write_i2c_block_data(0x44, 0x2C, [0x06])
     
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
    climate_file.write("Temperature in Celsius is : %.1f C\n" %cTemp)
    climate_file.write("Temperature in Fahrenheit is : %.1f F\n" %fTemp)
    climate_file.write("Relative Humidity is : %.1f %%RH\n" %humidity)
    climate_file.close()


def main(date):
    os.system('modprobe w1-gpio')
    os.system('modprobe w1-therm')
    
    date = date or datetime.datetime.now().strftime("%m_%d_%Y_%H_%M_%S")
    file_path = '/home/pi/inHouse_rpi/climate_readings_%s.txt' %date
    write_climate(file_path)

    config = configparser.ConfigParser()
    config.read('/home/pi/inHouse_rpi/ihp_config.ini')
    remote_path = config['climate']['pathway']

    os.system('s3cmd put %s %s' %(file_path, remote_path))
    os.system('rm %s' %file_path)


if __name__ == "__main__":  
        main()
import redis
from datetime import datetime

print('Battery Event Recorder')
print('1: Battery Recived')
print('2: Discharge Test')
print('3: Deployed In Robot')
print('4: Returned to Storage')
print('')
choice = input('$~ ')
if choice == '1':
    print('Enroll New Battery')
    eventType = "0001"
    season = input('Season Recived: ')
    mounth = input('Month Recived: ')
    friendlyName = input('Name: ')
    batteryID = input('Battery ID: ')
    capacity = input('Capacity (Ah): ')

    events = redis.Redis(host='localhost', port=6969, decode_responses=True)

    events.hset(eventType+"-"+batteryID, mapping={
    'eventType': eventType,
    'season': season,
    'month': mounth,
    'friendlyName': friendlyName,
    'batteryID' : batteryID,
    'capacity' : capacity
    })
    events.close()
elif choice == '2':
    print('Battery Discharge Test')
    batterySearch = input("Battery ID")
    try:
        events = redis.Redis(host='localhost', port=6969, decode_responses=True)
        data = events.hgetall('0001-'+batterySearch)
        print()
        print("Battery Found:")
        print(data['friendlyName']+" | "+data['season']+" "+data['month'])
    except:
        print("An exception occurred") 
    print()
    mesuredAh = input("Amps: ")
    measuredWh = input("Watts: ")
    testTime = input("Time: ")
    fileName = input("File Name")
    now = datetime.now()
    timestamp = now
    events = redis.Redis(host='localhost', port=6969, decode_responses=True)
    events.hset('0002-'+batterySearch+'-'+timestamp, mapping={
    'name': 'John',
    "surname": 'Smith',
    "company": 'Redis',
    "age": 29
    })
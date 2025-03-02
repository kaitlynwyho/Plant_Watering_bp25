import requests

def get_plant(plant_name):
    url = 'https://perenual.com/api/v2/species-list?key=sk-GrGi67c47ffd7a5168921&q=' + plant_name
    print(url)
    
    try:
        response = requests.get(url)

        if response.status_code == 200:
            posts = response.json()
            return posts
        else:
            print("Error: ", response.status_code)
            print("you suck")
            return None
    except requests.exceptions.RequestException as err:
        print("Erorr: ", err)
        print("you suck pt 2")
        return None

def get_plant_info(plant_id):
    url = "https://perenual.com/api/v2/species/details/" + str(plant_id) + "?key=sk-GrGi67c47ffd7a5168921"

    try:
        response = requests.get(url)
        if response.status_code == 200:
            posts = response.json()
            return posts
        else:
            print("Error: ", response.status_code)
            print("you suck")
            return None
    except requests.exceptions.RequestException as err:
        print("Error: ", err)
        print("you really suck")
        return None


def main():
    print('it works!')
    plant_name = input("Enter the plant: ")
    print(plant_name)
    plant = get_plant(plant_name)
    if plant:
        plant_id = plant["data"][0]['id']
        print(plant_id)
        plant_info = get_plant_info(plant_id)
        if plant_info == None:
            print("Could not get info")
            return None
        watering = plant_info['watering']
        sunlight = plant_info['sunlight']
        #sunlight2 = plant_info['sunlight'][sunlight]
        hardiness_min = plant_info['hardiness']['min']
        hardiness_max = plant_info['hardiness']['max']
        print("Watering:", watering)
        print("Sunlight:", sunlight)
        #print("Sunlight2:", sunlight2)
        print("Hardiness Min:", hardiness_min)
        print("Hardiness Max:", hardiness_max)
    else:
        print('failed to get, you suck')
    
if __name__ == '__main__':
    main()
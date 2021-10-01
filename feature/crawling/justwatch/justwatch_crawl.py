from selenium import webdriver
import justwatch
import csv
import pickle

driver = webdriver.Chrome(executable_path = r'/usr/local/bin/chromedriver')

for i in range(2010, 2022):
    file_path = f'./links/{i}_link.txt'
    with open(file_path, 'rb') as readfile:
        links = pickle.load(readfile)
        print(links)


    csv_columns = ['title', 'ott']
    dict_data = []
    #temp = dict()
    for url in links:
        try:
            ott, name = justwatch.get_ott(url)
            temp = {'title': name, 'ott':ott}
            dict_data.append(temp)
        except:
            pass



    # Write CSV File
    csv_file = f'{i}_name_ott.csv'
    try : 
        with open(csv_file, 'w') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=csv_columns)
            writer.writeheader()
            for data in dict_data:
                writer.writerow(data)
    except  IOError:
        pass

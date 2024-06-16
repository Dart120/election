import re
import json
from fuzzywuzzy import process
import pandas as pd
regex = r"^([A-Z][A-HJ-Y]?[0-9][A-Z0-9]?\s*?[0-9][A-Z]{2}|GIR ?0A{2})$"
loaded = {}
df = pd.read_csv("./uk_election_2019_results.csv")

def findCons(postcode):
    firstLetter = postcode[0]
    activeConstituency = ""
    if not firstLetter in loaded.keys():
        return
    for consID in loaded[firstLetter]:
        if len(re.findall(loaded[firstLetter][consID], postcode)):
            activeConstituency = consID
    with open(f"./constituencies.json", "r") as json_file:
        IDtoName = json.load(json_file)
    return IDtoName[activeConstituency]
def postcodeToCons(postcode):
    strippedPostcode = postcode.replace(" ", "").upper()
    if strippedPostcode == '' or not re.findall(regex,strippedPostcode):
        return
    firstLetter = strippedPostcode[0]
    if not firstLetter in loaded.keys():
        with open(f"./data/{firstLetter}.json", "r") as json_file:
            my_dict = json.load(json_file)
            loaded[firstLetter] = my_dict
    return findCons(strippedPostcode)
def postcodeConsToDataCons(postcodeCons):
    choices = df['constituency'].unique()
    best_match = process.extractOne(postcodeCons, choices)
    return best_match
def return_election_data(postcode):
    cons = postcodeToCons(postcode)
    dataCons = postcodeConsToDataCons(cons)[0]
    return df.loc[df['constituency'] == dataCons].to_json()

            
#!/usr/bin/env python

import urllib
import xmltodict
import pprint
import json

base_url = "https://api-na.hosted.exlibrisgroup.com/almaws/v1/analytics/reports"
api_key = os.environ["API_KEY"]
path = (
    "/shared/Fashion Institute of Technology 01SUNY_FIT/Reports/20191213-new-book-list"
)
params = {"apikey": api_key, "path": path, "limit": "1000", "col_names": "true"}
url = base_url + "?" + urllib.parse.urlencode(params)
print(url)
with urllib.request.urlopen(url) as response:
    xml = response.read()
    dict = xmltodict.parse(xml)
    records = dict["report"]["QueryResult"]["ResultXml"]["rowset"]["Row"]
    with open("new-books.json", "w") as outfile:
        json.dump(records, outfile, indent=4)
    print(str(len(records)) + " results")
    for record in records:
        title = record["Column5"]
        print(title)

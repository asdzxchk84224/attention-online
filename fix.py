import urllib.request
import json

url = "https://firestore.googleapis.com/v1/projects/airforce-5b199/databases/(default)/documents/students?key=AIzaSyDfAu3HoMEqtYwOg1_P0qNOOJye2dKhw0I"

req = urllib.request.Request(url)
response = urllib.request.urlopen(req)
data = json.loads(response.read())

names_to_update = ["王小明", "李大華", "陳偉杰", "林俊宇", "張家豪", "黃建宏", "吳宗憲", "劉德華"]
statuses = ["軍樂", "軍儀", "校旗", "區隊長公差", "大美", "伙委", "洗委", "降旗"]
name_status_map = dict(zip(names_to_update, statuses))

print("Fetching documents...")
for doc in data.get('documents', []):
    fields = doc.get('fields', {})
    name = fields.get('name', {}).get('stringValue')
    
    # We optionally check if they belong to 一大一中 / 01班, but names are unique enough here.
    if name in names_to_update:
        status_to_set = name_status_map[name]
        doc_url = "https://firestore.googleapis.com/v1/" + doc['name'] + "?updateMask.fieldPaths=status&key=AIzaSyDfAu3HoMEqtYwOg1_P0qNOOJye2dKhw0I"
        
        patch_body = {
            "fields": {
                "status": {
                    "mapValue": {
                        "fields": {
                            "星期一_早點名": { "stringValue": status_to_set }
                        }
                    }
                }
            }
        }
        patch_req = urllib.request.Request(doc_url, data=json.dumps(patch_body).encode('utf-8'), method='PATCH')
        patch_req.add_header('Content-Type', 'application/json')
        urllib.request.urlopen(patch_req)
        print(f"Updated {name} to {status_to_set} on 星期一_早點名")

print("Done.")

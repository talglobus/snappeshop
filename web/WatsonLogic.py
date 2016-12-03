import json
from os.path import join, dirname
from os import environ
from watson_developer_cloud import VisualRecognitionV3



visual_recognition = VisualRecognitionV3('2016-05-20', api_key='0d83972e03cb13caa44c780ae1b20d8ed48779b9')

print(json.dumps(visual_recognition.classify(images_url="http://molotilo.com/wp-content/uploads/2016/07/black-shoes.jpg"), indent=2))


from watson_developer_cloud import VisualRecognitionV3

visual_recognition = VisualRecognitionV3('2016-05-20', api_key='0d83972e03cb13caa44c780ae1b20d8ed48779b9')

raw = visual_recognition.classify(images_url="http://molotilo.com/wp-content/uploads/2016/07/black-shoes.jpg")
#Might Not Be a Good Idea
if (raw['images'][0]['classifiers'][0]['classes'][1]['class']):
    append = raw['images'][0]['classifiers'][0]['classes'][0]['class']
    keyword = raw['images'][0]['classifiers'][0]['classes'][1]['class'] + " " + append
else:
    keyword = raw['images'][0]['classifiers'][0]['classes'][0]['class']


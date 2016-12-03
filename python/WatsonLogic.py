from watson_developer_cloud import VisualRecognitionV3
import pika

connection = pika.BlockingConnection(pika.ConnectionParameters(
        host='localhost'))
channel = connection.channel()

channel.queue_declare(queue='queue')

def callback(ch, method, properties, body):
    process(body)
    
channel.basic_consume(callback,
                      queue='queue',
                      no_ack=True)

def process(x):
    visual_recognition = VisualRecognitionV3('2016-05-20', api_key='0d83972e03cb13caa44c780ae1b20d8ed48779b9')

    file = x 
    URL = "www.snappeshop.com/retrieve/"
    raw = visual_recognition.classify(URL + file + ".png")
#Might Not Be a Good Idea
#if (raw['images'][0]['classifiers'][0]['classes'][1]['class']):
#    append = raw['images'][0]['classifiers'][0]['classes'][0]['class']
#    keyword = raw['images'][0]['classifiers'][0]['classes'][1]['class'] + " " + append
#else:
#    keyword = raw['images'][0]['classifiers'][0]['classes'][0]['class']
    keyword = raw['images'][0]['classifiers'][0]['classes'][0]['class']
    return keyword
    
print("Working")
channel.start_consuming()
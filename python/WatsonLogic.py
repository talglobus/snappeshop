from watson_developer_cloud import VisualRecognitionV3
import pika
import json
import sys
import numpy
from ebaysdk.finding import Connection as Finding
from ebaysdk.exception import ConnectionError

parameters = pika.URLParameters('amqp://mdyelefh:FUT71qDv9s22hi-F2ERasLIh_vYOg2Tw@zebra.rmq.cloudamqp.com/mdyelefh')
connection = pika.BlockingConnection(parameters)
channel = connection.channel()

channel.queue_declare(queue='task_queue', durable='False')

def callback(ch, method, properties, body):
    print("Recieved")
    data = json.loads(body.decode('ascii'))
    passing = data['url']
    ch.basic_ack(delivery_tag = method.delivery_tag)
    process(passing)
    
channel.basic_consume(callback,
                      queue='task_queue',
                      no_ack=False)

def process(x):
    print(x)
    visual_recognition = VisualRecognitionV3('2016-05-20', api_key='0d83972e03cb13caa44c780ae1b20d8ed48779b9')

    file = x
    file = file[1:]
    URL = "www.snappeshop.com"
    print("The file being used is " + URL + file)
    raw = visual_recognition.classify(URL + file + ".png")
#Might Not Be a Good Idea
#if (raw['images'][0]['classifiers'][0]['classes'][1]['class']):
#    append = raw['images'][0]['classifiers'][0]['classes'][0]['class']
#    keyword = raw['images'][0]['classifiers'][0]['classes'][1]['class'] + " " + append
#else:
#    keyword = raw['images'][0]['classifiers'][0]['classes'][0]['class']
    keywords = raw['images'][0]['classifiers'][0]['classes'][0]['class']
    fetch(keyword)
    
def fetch(keywords):
        api = Finding(appid="SpencerH-sand-PRD-245ed6035-eb73f8e2", config_file=None)
        response = api.execute('findItemsAdvanced', {'keywords': keywords})
        data = response.dict()
        data = data['searchResult']['item']
        maximum = 0
        minimum = sys.maxsize
        price_lst = []  
        output = []
        for product in data:
            a = dict()
            a['title'] = product['title']
            a['galleryURL'] = product['galleryURL']
            a['currencyId'] = product['sellingStatus']['currentPrice']['_currencyId']
            price = float(product['sellingStatus']['currentPrice']['value'])
            a['value'] = price
            price_lst.append(price)
            if price < minimum:
                minimum = price
            if price > maximum:
                maximum = price
            output.append(a)
        avg = numpy.mean(price_lst)
        median = numpy.median(price_lst)
        meanSmallestDiff = sys.maxsize
        medianSmallestDiff = sys.maxsize
        for i in range(0, len(price_lst)):
            curPrice = float(output[i]['value'])
            if curPrice == maximum:
                maxIndex = i
            if curPrice == minimum:
                minIndex = i
            if numpy.abs(curPrice - avg) < meanSmallestDiff:
                meanSmallestDiff = numpy.abs(curPrice - avg)
                meanIndex = i
            if numpy.abs(curPrice - median) < medianSmallestDiff:
                medianSmallestDiff = numpy.abs(curPrice - median)
                medIndex = i
       
        final = dict()
        final['maximum'] = output[maxIndex]
        final['minimum'] = output[minIndex]
        final['median'] = output[medIndex]
        final['mean'] = output[meanIndex]
    
    
        returnvalue = final
        channel.basic_publish(exchange='',
                    routing_key='completed_queue',
                      body=returnvalue)
    
print("Working")
channel.start_consuming()
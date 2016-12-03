import sys
import json
import numpy
from ebaysdk.finding import Connection as Finding
from ebaysdk.exception import ConnectionError

def main(argv):
    try:
        api = Finding(appid="SpencerH-sand-PRD-245ed6035-eb73f8e2", config_file=None)
        keywords = argv[0]
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
        
        with open('result.json', 'w') as fp:
            json.dump(final, fp)

    except ConnectionError as e:
        print(e)
        print(e.response.dict())

if __name__ == "__main__":
    main(sys.argv[1:])
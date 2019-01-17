#!/usr/bin/python3.6

import sys
import codecs

def parseFile():
    if len(sys.argv) != 2:
        sys.stderr.write("No file given.\n")
        sys.exit(84)
    try:    
        value = open(sys.argv[1]).read()
    except:
        sys.stderr.write("Invalid file.\n")
        sys.exit(84)
    if len(value) == 0:
        sys.stderr.write("Invalid file.\n")
        sys.exit(84)
    return value

def hexToBase64(data):
    if data[len(data) - 1] == '\n':
        data = data[:-1]
    try:
        base64 = codecs.encode(codecs.decode(data, 'hex'), 'base64').decode()
    except:
        sys.stderr.write("Non-hexadecimal character found.\n")
        sys.exit(84)
    return base64

data = parseFile()
result = hexToBase64(data)
result = result.replace('\n', '')
print(result),

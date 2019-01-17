#!/usr/bin/python3.6

import sys

def parseFile():
    if len(sys.argv) != 2:
        sys.stderr.write("No file given.\n")
        sys.exit(84)
    try:
        value = open(sys.argv[1]).read().split('\n')
    except:
        sys.stderr.write("Invalid file.\n")
        sys.exit(84)
    return value
try:
    data = parseFile()
    key = data[0]
    text = data[1]
    if len(text) == 0 or len(key) == 0:
        sys.stderr.write("Invalid file.\n")
        sys.exit(84)
    i = 0
    tmp = ""
    for char in text:
        tmp += hex(int(char, 16) ^ int(key[i], 16))[2:]
        i += 1
        if (i >= len(key)):
            i = 0
    tmp = tmp.upper()
    print(tmp)
except:
    sys.exit(84)
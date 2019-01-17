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

def xor(data):
    if data[len(data) - 1] == '':
        data = data[:-1]
    if (len(data) != 2):
        sys.stderr.write("Bad arguments.\n")
        sys.exit(84)
    if (len(data[0]) != len(data[1])):
        sys.stderr.write("Unequal buffers length.\n")
        sys.exit(84)
    if (len(data[0]) % 2 != 0 or len(data[1]) % 2 != 0):
        sys.stderr.write("Non-hexadecimal character found.\n")
        sys.exit(84)
    try:
        result = hex(int(data[0], 16) ^ int(data[1], 16))
    except:
        sys.stderr.write("Invalid number.\n")
        sys.exit(84)
    result = result[2:]
    result = result.upper()
    return result

data = parseFile()
result = xor(data)

result = result.replace('\n', '')
result = result.replace('L', '')

print(result),

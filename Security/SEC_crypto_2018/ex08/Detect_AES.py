#!/usr/bin/python3.6

import sys
import codecs
import base64

def detect_aes(file):
    array = file.read().split('\n')
    chunks = []
    i = 1
    for line in array:
        n = 0
        try:
            line = base64.b64decode(line)
            line = codecs.encode(line, 'hex')
        except:
            sys.stderr.write("Non-hexadecimal character found.\n")
            sys.exit(84)

        line2 = bytearray(line)
        chunks = []
        for m in range(0, len(line2), 32):
            n += 1
        for l in range(0, len(line2), 32):
            chunks.append(line2[l:l + 32])
        for j in range(0, len(chunks) - 1, 1):
            for index in range(j + 1, len(chunks), 1):
                if chunks[j] == chunks[index]:
                    return i
        i += 1
    return -1

try:
    file = open(sys.argv[1])
except:
    sys.stderr.write("Invalid file.\n")
    sys.exit(84)
ligne = detect_aes(file)
if ligne == -1:
    sys.stderr.write("Invalid value.\n")
    sys.exit(84)
print(ligne)
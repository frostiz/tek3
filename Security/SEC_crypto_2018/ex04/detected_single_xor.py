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
    if (value[0] == ""):
        sys.stderr.write("Empty file.\n")
        sys.exit(84)
    if (len(value) == 0):
        sys.stderr.write("Invalid file.\n")
        sys.exit(84)
    return value

def check_hex(string):
    for char in string:
        char = ord(char)
        if ((char >= ord('0') and char <= ord('9')) or
            (char >= ord('a') and char <= ord('f')) or
            (char >= ord('A') and char <= ord('F'))):
            pass
        else:
            sys.stderr.write("Non-hexadecimal character found.\n")
            sys.exit(84)

def single_xor(data, array):
    check_hex(data)
    result = 0
    max_score = 0.0
    for i in range(0, 256):
        score = b''
        data2 = bytes.fromhex(data)
        for byte in data2:
            score += bytes([byte ^ i])
        score2 = 0.0
        for char in score:
            try:
                score2 += float(array[chr(char)])
            except:
                pass
        score = score2
        if score > max_score:
            max_score = score
            result = i
    return [max_score, result]

data = parseFile()
for string in data:
    if (len(string) % 2 != 0):
        sys.stderr.write("Non-hexadecimal character found.\n")
        sys.exit(84)
if data[len(data) - 1] == '':
    data = data[:-1]
result = [0] * len(data)
biggest_score = 0
ligne = 0
array = {}
array["e"] = 12.70
array["t"] = 9.06
array["a"] = 8.17
array["o"] = 7.51
array["n"] = 6.75
array["r"] = 5.99
array["i"] = 6.97
array["s"] = 6.33
array["h"] = 6.09
array["d"] = 4.25
array["l"] = 4.03
array["f"] = 2.23
array["c"] = 2.78
array["m"] = 2.41
array["u"] = 2.76
array["g"] = 2.02
array["y"] = 1.97
array["p"] = 1.93
array["b"] = 1.29
array["v"] = 0.98
array["k"] = 0.77
array["j"] = 0.15
array["x"] = 0.15
array["q"] = 0.10
array["z"] = 0.07
array["w"] = 2.36

for i in range(0, len(data)):
    xor = single_xor(data[i], array)
    result[i] = xor[0]
    if biggest_score < result[i]:
        biggest_score = result[i]
        ligne = i
        a = xor[1]
result = hex(a)
result = result[2:].upper()
ligne += 1
print(ligne, end=" ")
if (len(result) % 2 != 0):
    print("0", end="")
print(result),
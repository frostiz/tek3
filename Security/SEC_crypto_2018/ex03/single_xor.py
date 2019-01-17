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

def get_score(i, array, data):
    score = b''
    data = bytes.fromhex(data)
    for byte in data:
        score += bytes([byte ^ i])
    score2 = 0.0
    for char in score:
        try:
            score2 += float(array[chr(char)])
        except:
            j = 0
    return score2
        

def check_hex(string):
    for char in string:
        char = ord(char)
        if ((char >= ord('0') and char <= ord('9')) or
            (char >= ord('a') and char <= ord('f')) or
            (char >= ord('A') and char <= ord('F'))):
            k = 2
        else:
            sys.stderr.write("Non-hexadecimal character found.\n")
            sys.exit(84)

def single_xor(data):
    if data[len(data) - 1] == '':
        data = data[:-1]
    if (len(data) != 1):
        sys.stderr.write("Bad arguments.\n")
        sys.exit(84)
    check_hex(data[0])
    if (data[0] == ""):
        sys.exit(84)

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

    result = ""
    max_score = 0.0
    for i in range(256):
        score = get_score(i, array, data[0])
        if score > max_score:
            max_score = score
            result = i
    return result

def analyseResult(tmp):
    if (len(tmp) % 2 != 0):
        print("0", end="")

data = parseFile()
string = data[0]
if (len(string) % 2 != 0):
        sys.exit(84)
result = single_xor(data)
result = hex(result)
result = result[2:]
analyseResult(result)
print(result.upper()),
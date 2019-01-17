#!/usr/bin/python3
import sys
import codecs

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
        sys.exit(84)
    return value

def hexToBase64(data):
    if data[len(data) - 1] == '\n':
        data = data[:-1]
    if len(data) % 2 != 0:
        data = "0" + data
    base64 = codecs.encode(codecs.decode(data, 'hex'), 'base64').decode()
    return base64
        

def count_diff(s1, s2):
    assert len(s1) == len(s2)
    a = ''.join(format(ord(x), 'b') for x in s1)
    b = ''.join(format(ord(x), 'b') for x in s2)
    a = int(a, 2)
    b = int(b, 2)
    diff = 0
    z = a ^ b
    while z:
        diff += 1
        z &= z - 1
    return diff

def get_score(i, array, data):
    score = b''
    if (len(data) % 2 != 0):
        data = "0" + data
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

def break_single_byte_xor(data):
    if data[len(data) - 1] == '':
        data = data[:-1]
    if (len(data) != 1):
        sys.stderr.write("Bad arguments.\n")
        sys.exit(84)
    check_hex(data[0])
    
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

data = parseFile()
text = hexToBase64(data[0])
print(count_diff("Hello", "World"))
print(break_single_byte_xor(data))
avg_dists = []

for keysize in range(2, 41):
    distances = []

    chunks = [text[i:i+keysize] for i in range(0, len(text), keysize)]
    while True:
        try:
            chunk_1 = chunks[0]
            chunk_2 = chunks[1]
            distance = count_diff(chunk_1, chunk_2)
            distances.append(distance/keysize)
            del chunks[0]
            del chunks[1]
        except Exception as e:
            break
    result = {
        'key': keysize,
        'avg_dist': sum(distances) / len(distances)
    }
    avg_dists.append(result)
probable_keysize = sorted(avg_dists, key=lambda x: x['avg_dist'])[0]
print(probable_keysize)

text_blocks = [text[i:i+probable_keysize['key']] for i in range(0, len(text), probable_keysize['key'])]
print(text_blocks)

for i in range(probable_keysize['key']):
    transposed = b''
    for block in text_blocks:
        transposed += block[i]
    print(transposed)
    
#except:
 #   sys.exit(84)

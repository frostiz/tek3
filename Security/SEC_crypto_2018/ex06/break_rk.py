#!/usr/bin/python3

import codecs
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
		sys.exit(84)
	return value

def calcHammingDistance(s1, s2):
	assert len(s1) == len(s2)

	str1 = b''
	str2 = b''

	for char in s1:
		str1 += bytes(bin(ord(char)), 'utf8')[2:].zfill(8)
	for char in s2:
		str2 += bytes(bin(ord(char)), 'utf8')[2:].zfill(8)
	diff = 0
	i = 0
	while i < len(str1):
		if (str1[i] != str2[i]):
			diff += 1
		i += 1
	return diff


def isHexa(string):
	for char in string:
		char = ord(char)
		if ((char >= ord('0') and char <= ord('9')) or
			(char >= ord('a') and char <= ord('f')) or
			(char >= ord('A') and char <= ord('F'))):
			k = 2
		else:
			return False
	return True

def getEnglishArray():
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
	return array

def getEnglishScore(i, array, data):
	chars = b''
	if (len(data) % 2 != 0):
		data = "0" + data
	data = bytes.fromhex(data)
	for byte in data:
		chars += bytes([byte ^ i])
	score = 0.0
	for char in chars:
		try:
			score += float(array[chr(char)])
		except:
			j = 0
	return score

def breakSingleByteXOR(text):
	if isHexa(text) == False:
		sys.stderr.write("Non-hexadecimal character found.")
		sys.exit(84)
	array = getEnglishArray()
	result = 0
	max_score = 0.0
	for i in range(256):
		score = getEnglishScore(i, array, text)
		if score > max_score:
			max_score = score
			result = i
	return result

def getKeySize(text, precision):
	averageDistances = []
	for keysize in range(2, 41):
		distances = []

		for i in range(precision):
			block1 = text[i : i + keysize]
			block2 = text[i + keysize : i + keysize * 2]

			try:
				distance = calcHammingDistance(block1, block2)
				distances.append(distance / keysize)
			except:
				break;
		averageDistances.append({
			'keysize': keysize,
			'averageDistance': sum(distances) / len(distances)
			})
	averageDistances = sorted(averageDistances, key=lambda x: x['averageDistance'])
	for i in averageDistances:
		print(i)
	return averageDistances[0]['keysize']

def cutText(probableKeysize, text):
	cutted = []
	for i in range(0, len(text), probableKeysize):
		cutted.append(text[i:i+probableKeysize])
	return cutted

def transposeText(probableKeysize, cutted):
	blocks = []
	for i in range(probableKeysize):
		transposed = b''
		for block in cutted:
			try:
				transposed += bytes(block[i], "utf8")
			except:
				transposed += bytes("", "utf8")
		blocks.append(transposed.decode("utf8").replace("'", ""))
	return blocks

def solveBlocks(blocks, text):
	keys = []
	possible_text = []
	for block in blocks:
		breaked = breakSingleByteXOR(block)
		key = hex(breaked)[2:].upper()
		keys.append(key)
		#concatKeys = ''.join(keys)
		#possible_text.append((repeating_key_xor(text, concatKeys), concatKeys))
	#print(possible_text)
	return keys

def repeating_key_xor(text, key):
	i = 0
	tmp = ""
	for char in text:
		tmp += hex(int(char, 16) ^ int(key[i], 16))[2:]
		i += 1
		if (i >= len(key)):
			i = 0
	tmp = tmp.upper()
	return tmp

def main():
	text = parseFile()[0]
	#step 1
	print (calcHammingDistance("Hello", "World"))
	#step 2
	print (breakSingleByteXOR(text))
	#step 3
	probableKeysize = getKeySize(text, 4)
	print ("Probable keysize: %d"%probableKeysize)
	#step 4
	cutted = cutText(probableKeysize, text)
	print("Cutted: ",cutted)
	#step 5
	blocks = transposeText(probableKeysize, cutted)
	print ("blocks: ",blocks)
	#step 6
	solved = solveBlocks(blocks, text)
	print ("solved: ", solved)
	print(''.join(solved))

	
	


if __name__ == '__main__':
	main()
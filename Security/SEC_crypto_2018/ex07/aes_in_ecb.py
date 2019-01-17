#!/usr/bin/python3

import sys
from Crypto.Cipher import AES

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

def padd(block, length):
	#if len(block) >= length:
	#	return block
	#number = length - len(block)
	#new = bytes(block)
	#for i in range(number):
	#	new += bytes([number])
	new = block
	i = 0
	#print (new)
	for char in new:
		i += 1
		if (i == length):
			i = 0
	while i < length:
		new = new + "0"
		i += 1
	return new

def unpadd(block):
	length = len(block)
	if length == 0:
		return block
	lastChar = block[length - 1]
	toCheck = block[-lastChar:]
	new = lastChar * bytes([lastChar])
	if new == toCheck:
		block = block[0:-lastChar]
	return block

def main():
	#step 1
	#a = padd(b'Rijndael', 10)
	#print(a)
	#step 2
	#a = unpadd(a)
	#print(a)

	#data = parseFile()
	#if (data[len(data) - 1] == ""):
	#	data = data[:-1]
	#if (len(data) != 2):
	#	sys.stderr.write("Invalid file.\n")
	#	sys.exit(84)
	#key = data[0]
	#text = data[1]

	#print(key)
	#print(text)

	#decipher = AES.new(bytes(key, "utf8"), AES.MODE_ECB)
	#decipher.decrypt(bytes(text, "utf8"))
	sys.exit(84)

if __name__ == '__main__':
	main()
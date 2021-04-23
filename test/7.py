a = 0
arr = [1, 2, 3, 4]
for i in arr:
    if i == 2:
        continue
        a = a + 10000
    elif i == 3:
        break
        a = a + 100000
    a = a + i

a
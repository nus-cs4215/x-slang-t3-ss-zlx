a = 1
b = 10
def f():
    global a, b
    a = 3
    b = 40

f()
a + b
a = 1
def f():
    a = 2
    def g():
        nonlocal a
        a = 3
    g()
    return a

f()

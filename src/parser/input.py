a = 1

def f():
    a = 7
    def g():
        nonlocal a
        a = 5
        def e():
            nonlocal a
            a = 3
        e()
    g()
    return a
f()



# c = 3

# def f(a):
#     c = a

# f(4)
# c

# def fac(n):
#     if n == 0:
#         return 1
#     else:
#         return n * fac(n - 1)

# a = fac(5)
# For Loop
# a = 0
# arr = [1, 2, 3]
# for i in arr:
#     if i == 2:
#         a = a + 4
#         continue
#         a = a + 10000
#     elif i == 3:
#         break
#         a = a + 100000
#     a = a + i
# a

# Arrays
# a = [1,3,7]
# a[1]

# Dictionary
# a = {
#     "hi": "hello",
#     "bye": "goodbye"
# }
# a["bye"]

## While Loop
# a = 5
# b = 0
# while(a > 0):
#     b = b + a
#     if(a == 2):
#         break
#     a = a - 1
# b

# # If Else
# a = True
# b = 5
# c = 10
# if(a):
#     c

# Unary Expressions
# a = False
# b = not a
# b

# Conditional Expression
# 1 if True else 0
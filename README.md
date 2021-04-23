# T3 Python 

Note: Readers can open `README.html` file to read the printed version of the document. <br/>
Read our full Developer Guide: [T3 Python Developer Guide](https://github.com/nus-cs4215/x-slang-t3-ss-zlx/wiki)

## Table of Contents
- [Python 3 implemented in Typescript](#python-3-implemented-in-typescript)
- [Why Python?](#why-python-)
- [Usage](#usage)
- [User Manual](#user-manual)
  * [Calculator](#calculator)
  * [Variable Assignment and Reuse](#variable-assignment-and-reuse)
  * [Python Built-in Data structures: Lists & Dictionaries](#python-built-in-data-structures--lists---dictionaries)
  * [Python Built-in Functions](#python-built-in-functions)
    + [`print` Function](#-print--function)
    + [`range` Function](#-range--function)
  * [Loops](#loops)
    + [For Loop](#for-loop)
    + [While Loop](#while-loop)
  * [If Statement / Conditional Statement](#if-statement---conditional-statement)
  * [Break / Continue / Pass Statement](#break---continue---pass-statement)
    + [Break Statement](#break-statement)
    + [Continue Statement](#continue-statement)
    + [Pass Statement](#pass-statement)
  * [Function Definition](#function-definition)
  * [Variable Scoping Statements](#variable-scoping-statements)
    + [Global Statement](#global-statement)
    + [Nonlocal Statement](#nonlocal-statement)
  * [Python For Loops](#python-for-loops)
  * [Python Built-in Data structures: Lists & Dictionaries](#python-built-in-data-structures--lists---dictionaries-1)
  * [Visualising the Environment](#visualising-the-environment)
- [Testing](#testing)
- [Error messages](#error-messages)
- [Using your x-slang in local Source Academy](#using-your-x-slang-in-local-source-academy)


## Python 3 implemented in Typescript
This page outlines our work done so far in implementing the Python 3 programming language in Typescript. This documentation serves as the User Manual for our project and contains various examples of what we have implemented thus far. For a more detailed discussion about our implementation logic, take a look at our Wiki.

Read our full Developer Guide: [T3 Python Developer Guide](https://github.com/nus-cs4215/x-slang-t3-ss-zlx/wiki) <br/>
Source Code for the X-Frontend: [x-frontend-ts-ss-zlx](https://github.com/nus-cs4215/x-frontend-t3-ss-zlx)
Slide Deck from our presentation: [T3 Python Presentation Slides](https://github.com/nus-cs4215/x-slang-t3-ss-zlx/blob/master/T3%20Python%20Presentation.pdf)

## Why Python?
As one of the most popular programming languages in the world, Python provides a lot of benefits to programming novices and experts alike. Through implementing the language's basic grammar and some of its most commonly used standard library functions, our team has a deepper understanding and appreciation for Python.

## Usage

To build,

``` {.}
$ git clone https://<url>/x-slang.git
$ cd x-slang
$ yarn
$ yarn build
```

To add \"x-slang\" to your PATH, build it as per the above instructions, then run

``` {.}
$ cd dist
$ npm link
```

If you do not wish to add \"x-slang\" to your PATH, replace \"x-slang\" with `node dist/repl/repl.js` in the following examples.

To try out *Python* in a REPL, run

``` {.}
$ x-slang '1 * 1'
```

Hint: In `bash` you can take the `PROGRAM_STRING` out of a file as follows:

``` {.}
$ x-slang "$(< my_source_program.js)"
```

## User Manual

All supported Python syntax will be listed in User Manual

### Calculator

This Python implementation can be used as calculator. It supports both number calculation and logical calculation. The supported operators are `+` (add), `-` (minus), `*` (multiply), `/` (division), `//` (Integer division), `~` (not), `%` (mod), `**` (power), `&` (logical and), `|` (logical or), `==` (equality), `!=` (not equal), `<` (less than), `>` (larger than), `<=` (less or equal), `>=` (greater or equal), `&&` (and), `||` (or), `and`, `or`, `not`, `True`, `False`.

For example, in order to calculate 2 to the power 10, use:

```python
2 ** 10  # Get 1024
```

Calculate a number will get the number itself:

```python
10     # Get 10
```

To test whether the integer 100 can be divide by 3 or not:

```python
100 % 3 == 0 # Get False
```

### Variable Assignment and Reuse

This Python implementation supports the assignment expression. Variables that been assigned can be reused in later program. The value that being assigned can be a number, a calculator expression, or a calculator expression that variable.

For example, assign number 1 to variable a and reuse a:

```python
a = 1

a      # Get 1
```

Assign the result of 2 to the power 10 to variable b:

```python
b = 2 ** 10

b     # Get 1024
```

Assign an expression that contains variables to a new variable:

```python
a = 1
b = 2
c = a + b + 1  # Get 4
```

### Python Built-in Data structures: Lists & Dictionaries

This Python implementation supports two Python basic built-in data structures: List and Dictionary. User can use square bracket subscripts to get elements of a list or dictionary

For example, define a list of [1, 2, 3, 4]

```python
arr = [1, 2, 3, 4]
arr[2]              # Get 3
```

Defines a mapping dictionary between strings:

```python
dictionary = {
    "hello": "Hello, World!",
    "bye": "Goodbye!"
}
dictionary["hello"]      # Get "Hello, World!"
```

### Python Built-in Functions

We have implemented two very commonly used built-in functions for Python - `print` and `range`. To implement these we took note of how standard library functions are implemented in *js-slang* to guide us.

#### `print` Function

The implementation of the print function involves evaluation the argument list of the function. 

Examples:

``` python
print("Hello, World")  # Get "Hello, World"

print(1 + 2)           # Get 3

a = 1
print(a)               # Get 1
```

#### `range` Function

The `range` function in python takes in a stop value as a required value and an optional start and step values in order to return a list of numbers. If the stop is not specified it defaults to 0 and if the step is not specified it defaults to 1.

In our implementation we have altered this function slightly in order to take in 2 required fields: the start and the stop.

Examples:


``` python
print(range(0, 5))    # Get [0, 1, 2, 3, 4]
```

### Loops

This Python implementation supports `for` loops and `while` loops in Python. 

#### For Loop

For loop will iterate every element of the given list. In each iteration, for loop will execute the body program once.

```python
arr = [1, 2, 3, 4, 5]
a = 0
for i in arr:
    a = a + i

print(a)  # Get 15 
```

Range function is usually used in for loop:

```python
b = 0
for i in range(1, 6):
    b = b + i

print(b)   # Get 15
```

#### While Loop

While loop tests an expression in every iteration. If the expression testing result is not False or 0, the while loop will execute its body program once and test the testing expression again before the next execution. The cycle will not stop until the testing result is False or 0.

For example, when a is larger than 0, add count by one in each iteration:

```python
a = 5
count = 0
while a > 0:
    count = count + 1
    a = a - 1

print(count)   # Get 5
```

If the testing expression will not be False or 0 in any case, the loop will not stop except using `break` statement

```python
a = 0
while True:     # Infinite Loop
    a = a + 1

a  # Will not be executed
```

### If Statement / Conditional Statement

This implementation of Python supports `if-elif-else` statement in Python. Different part of program will be executed according to the test of testing expression

For example, we can test variable a is positive or negative:

```python
a = 2
if a > 0:
    b = "Variable a is positive"
elif a < 0:
    b = "Variable a is negative"
else:
    b = "Variable a is 0"

print(b)  # "Variable a is positive"
```

The if statement with two branches can also uses conditional expression in Python.

For example, test if 3 is larger than 2:

```python
"larger" if 3 > 2 else "smaller"     # Get "larger"
```

### Break / Continue / Pass Statement

Sometimes it is necessary to jump out of the loop or jump to next cycle of the loop. The Break / Continue statement will do that. In other cases, we do not need the program to do anything in some if branches. Then we can use Pass statement.

#### Break Statement

When break statement is being executed, the program will jump out of the loop immediately. 

For example, jump out of the infinite loop when variable a is equal to 5:

```python
a = 0
while True:
    if a == 5:
        break
    a = a + 1

print(a)    # Get 5
```

#### Continue Statement

When continue statement is being executed, the program will jump to the next cycle of the loop immediately.

For example, add 1 to variable a except the case that a is equal to 3:

```python
a = 0
for i in range(0, 5):
    if a == 3:
        continue
    a = a + 1
    
print(a)  # Get 4
```

#### Pass Statement

When pass statement is being executed, the program will not do anything:

For example, do not do anything when variable is equal to 3:

```python
a = 0
for i in range(0, 5):
    if a == 3:
        pass
    else:
        a = a + 1
    
    
print(a)    # Get 4
```

### Function Definition

This Python implementation supports to define functions with default value, return value and recursion. 

For function definition, use `def` keyword with a function name and function arguments. The return statement will return the result of its body expression

```python
def f(a, b):
    return a + b

f(2, 4)   # Get 6
```

This Python implementation also supports default value, the default value can be defined in function declaration. The arguments with default value, however, can only located in the tail of the argument list.

```python
def f(a, b = 2):
    return a + b

f(2)      # Get 4
f(2, 4)   # Get 6
f(a = 3, b = 4) # Get 7

def f(a = 2, b):   # Illeagal
    return a + b 
```

This Python implementation also supports recursion. That is, call the function itself in the function definition.

For example, a classic recursion program: factorial

```python
def fac(n):
    if n == 0:
        return 1
    else:
        return n * fac(n - 1)

fac(6)   # Get 720
```

>   One thing to note is that, all variables that defined inside function are local variables. If global variable is needed inside a function, please use `global` statement

### Variable Scoping Statements

There are two keywords implemented in Python in order to define the scope of variables. These keywords are used inside of functions. This section will detail the use of these keywords and our implementation logic.

#### Global Statement

All variables that defined inside function are local variables. It will not affect the value of the global valuables:

```python
a = 1

def changeA():
    a = 2
    return a

print(a)    # Still get 1
```

The `global` keyword allows you to modify the variable in the global scope, i.e. the function body scope It is used to modify a global variable and make changes to the variable in a local context, which changes the value of the variable globally.

Example:

``` python
a = 1
def changeA():
    global a
    a = 2
changeA()
print(a)    # Get 2
```

#### Nonlocal Statement

Another method to make the scoping of variables larger is using nonlocal statement.

The `nonlocal` keyword allows you to modify the variable in the parent scope of the current scope, i.e. the function body scope It is used to modify a variable located in the parent environment frame and make changes to the variable in a local context, which changes the value of the variable in the parent environment frame.

Example:

``` python
a = 1
def f():
    a = 2
    def g():
        nonlocal a
        a = 3
    g()
    return a
f()   # Get 3
a     # Get 1
```

### Python For Loops 

The Python `for` loops are slightly different to the Javascript `for` loops, and bear more resemblance to the JS `forEach` function.

Essentially Python for loops consist of an iterator, an interated value and finally the for loop body. In every iteration of the for loop body, the iterator takes on the next value of the iterated and the loop body is performed. The final value of the iterator is retained in the current environment frame. 

Examples:

```python
arr = [1, 2, 3, 4, 5]
for i in arr:
    do something...

for i in range(1, 6):
    do something...
```

### Python Built-in Data structures: Lists & Dictionaries

We have implemented two of the basic Python built-in data structures - lists and dictionaries. User can use square bracket subscripts to get elements of a list or dictionary

Examples:

```python
arr = [1, 2, 3, 4]
print(arr[2])

dictionary = {
    "hello": "Hello, World!",
    "bye": "Goodbye!"
}
print(dictionary["hello"])
```

### Visualising the Environment 

For visualising the environment, our initial plan was to follow the environment visualiser in `cadet-frontend`. However we were unable to successfully integrate it - anytime a program was run with a breakpoint set, it would cause the frontend to error out.

We decided to try developing the environment visualiser with a different approach by applying what we had learnt when implementing the Python built-in functions. We created a new built-in function `env()` in order to return the environment at that point in the program's execution. This works very similarly to the debbuger + environment visualiser tools that are used in the source-academy frontend.

This function loops through the Context and seperates the different frames into that for the program (i.e. the global environment), and the function environments (if the `env()` function is called inside a function body). This function is especially useful when used in combination with the use of Python keywords.

Example 1:

``` python
    a = 1
    b = 2
    def f():
        c = 3
        return env()
    f()

>>> {"f": {"c": 3}, "program": {"a": 1, "b": 2, "f": "function declaration"}}
```

Example 2:

``` python
    a = 1
    b = "hello"
    def f():
        global a
        a = a + 7
    f()
    env()

>>> {"program": {"a": 8, "b": "hello", "f": "function declaration"}}
```

## Testing

There are several test case in `/test` folder. Tester can copy the code to the local source academy and execute the program.

Error messages
--------------

To enable verbose messages, have the statement `"enable verbose";` as the first line of your program.

There are two main kinds of error messages: those that occur at runtime and those that occur at parse time. The first can be found in `interpreter-errors.ts`, while the second can be found in `rules/`.

Each error subclass will have `explain()` and `elaborate()`. Displaying the error will always cause the first to be called; the second is only called when verbose mode is enabled. As such, `explain()` should be made to return a string containing the most basic information about what the error entails. Any additional details about the error message, including specifics and correction guides, should be left to `elaborate()`.

Please remember to write test cases to reflect your added functionalities. The god of this repository is self-professed to be very particular about test cases.

Using your x-slang in local Source Academy
-------------------------------------------

A common issue when developing modifications to x-slang is how to test it using your own local frontend. Assume that you have built your own x-frontend locally, here is how you can make it use your own x-slang, instead of the one that the Source Academy team has deployed to npm.

First, build and link your local x-slang:
``` {.}
$ cd x-slang
$ yarn build
$ yarn link
```
Then, from your local copy of x-frontend:
``` {.}
$ cd x-frontend
$ yarn link "x-slang"
```

Then start the frontend and the new x-slang will be used. 

# T3 Python 

## Python 3 implemented in Typescript
This page outlines our work done so far in implementing the Python 3 programming language in Typescript. This documentation covers the key considerations taken when building the Parser using the Antlr tool, some noteworthy features of Python 3 that we have covered in our interpreter, example use cases and how we have tried to implement our own version of an environment model visualiser for Python.

Source Code for the X-Frontend: [x-frontend-ts-ss-zlx](https://github.com/nus-cs4215/x-frontend-t3-ss-zlx)

## Why Python?
As one of the most popular programming languages in the world, Python provides a lot of benefits to programming novices and experts alike. Through implementing the language's basic grammar and some of its most commonly used standard library functions, our team has a depper understanding and appreciation for Python.

## The Parser
This section details the 

## The Interpreter
This section details the implementation logic of key components of the Python 3 grammar that we have implemented in our project. 

### Python Keywords
There are two keywords implemented in Python in order to define the scope of variables. These keywords are used inside of functions. This section will detail the use of these keywords and our implementation logic.

#### `global` Keyword
The `global` keyword allows you to modify the variable outside of the current scope, i.e. the function body scope It is used to create a global variable and make changes to the variable in a local context, which changes the value of the variable globally.

Example:
``` python
    c = 1
    def add():
        global c
        c = c + 2
    add()
    print(c)
```
The logic we have used to implement this keyword is as follows:
1. Assign variable names inside globallist (which is inside the Program Frame) as local list variable “global” in current frame
2. Check local variable “global” before function finishes
3. If the list “global” exists ->  Copy the names and their values in the list “global” into Program Frame
4. If the list “global” does not exist -> Pass

#### `nonlocal` Keyword
In Python the `nonlocal` keyword is used for variables in nested functions whose local scope is not defined. This means that the variable can be neither in the local (the current scope) nor the global scope (the Program scope).

Example:
``` python
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
```
The logic we have used to implement this keyword is as follows:

1. Assign variable names in nonlocallist as local list variable “nonlocal” in current frame
2. Check local variable “nonlocal” before function finishes
3. List “nonlocal” exists ->  Copy the names and their values into tail frame
4. List “nonlocal” not exists -> Pass

### Python Built-in Functions
We have implemented two very commonly used built-in functions for Python - `print` and `range`. To implement these we took note of how standard library functions are implemented in *js-slang* to guide us.

#### `print` Function
The implementation of the print function involves evaluation the argument list of the function. Then the returned value is printed using  `console.log` and returned as the return value. 

Examples:
``` python
    print("Hello, World")

    print(1 + 2)

    a = 1
    print(a)
```

#### `range` Function
The `range` function in python takes in a stop value as a required value and an optional start and step values in order to return a list of numbers. If the stop is not specified it defaults to 0 and if the step is not specified it defaults to 1.

In our implementation we have altered this function slightly in order to take in 2 required fields: the start and the stop.

Examples:
``` python
    print(range(0, 5))
    >>> [0, 1, 2, 3, 4]

    for i in range(1, 6):
        do something...
```

### Python For Loops 
The Python `for` loops are slightly different to the Javascript `for` loops, and bear more resemblance to the JS `forEach` function. <br/>
Essentially Python for loops consist of an iterator, an interated value and finally the for loop body. In every iteration of the for loop body, the iterator takes on the next value of the iterated and the loop body is performed. The final value of the iterator is retained in the current environment frame. 

Examples:

```python
    arr = [1, 2, 3, 4, 5]
    for i in arr:
        do something...
    
    for i in range(1, 6):
        do something...
```

### Python Built-in Datastructures: Lists & Dictionaries
We have implemented two of the basic Python built-in datastructures - lists and dictionaries.

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
## Visualising the Environment 
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

Running the Project
=====
Open-source implementations of the programming language *Source*. Source
is a series of small subsets of JavaScript, designed for teaching
university-level programming courses for computer science majors,
following Structure and Interpretation of Computer Programs, JavaScript
Adaptation (<https://sicp.comp.nus.edu.sg>).

Usage
=====

To build,

``` {.}
$ git clone https://<url>/x-slang.git
$ cd x-slang
$ yarn
$ yarn build
```

To add \"x-slang\" to your PATH, build it as per the above
instructions, then run

``` {.}
$ cd dist
$ npm link
```

If you do not wish to add \"x-slang\" to your PATH, replace
\"x-slang\" with \"node dist/repl/repl.js\" in the following examples.

To try out *Source* in a REPL, run

``` {.}
$ x-slang '1 * 1'
```

Hint: In `bash` you can take the `PROGRAM_STRING` out
of a file as follows:

``` {.}
$ x-slang "$(< my_source_program.js)"
```

Documentation
=============

Source is documented here: <https://sicp.comp.nus.edu.sg/source/>

Testing
=======
`x-slang` comes with an extensive test suite. To run the tests after you made your modifications, run 
`yarn test`. Regression tests are run automatically when you want to push changes to this repository. 
The regression tests are generated using `jest` and stored as snapshots in `src/\_\_tests\_\_`.  After modifying `x-slang`, carefully inspect any failing regression tests reported in red in the command line. If you are convinced that the regression tests and not your changes are at fault, you can update the regression tests as follows:  
``` {.}
$ yarn test -- --updateSnapshot
```

Error messages
==============

To enable verbose messages, have the statement `"enable verbose";` as the first line of your program.

There are two main kinds of error messages: those that occur at runtime
and those that occur at parse time. The first can be found in
`interpreter-errors.ts`, while the second can be found in `rules/`.

Each error subclass will have `explain()` and `elaborate()`. Displaying the
error will always cause the first to be called; the second is only
called when verbose mode is enabled. As such, `explain()` should be made
to return a string containing the most basic information about what the
error entails. Any additional details about the error message, including
specifics and correction guides, should be left to `elaborate()`.

Please remember to write test cases to reflect your added
functionalities. The god of this repository is self-professed to be very
particular about test cases.

Using your x-slang in local Source Academy
===========================================

A common issue when developing modifications to x-slang is how to test
it using your own local frontend. Assume that you have built your own
x-frontend locally, here is how you can make it use your own
x-slang, instead of the one that the Source Academy team has deployed
to npm.

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

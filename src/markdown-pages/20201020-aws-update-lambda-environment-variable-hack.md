---
slug: 'aws-update-lambda-environment-variables-hack'
date: '2020-10-20'
title: 'Using AWS Lambda as a (mini) database - Part 1: update Lambda environment variables hack'
---

Sometimes we need to save/update environment variables, suppose you have a small set of data and you do not want to save it on external services like S3, DynamoDB

And you might think create a code likes this:

```
  process.env["my_var_1"] = "something";
  process.env["my_var_2"] = "something_different";
```

But each time you run AWS lambda, it will create an isolated environments so you can not set environment variables likes the example above.

Fortunately, we can use AWS Lambda as a mini database. I have used it for very long time ago and I want to share it here for fun and profit because as you know AWS Lambda is pretty dirty cheap. The hacky way is we can use Lambda update function configuration to update environment variable. Here is my example with Nodejs (you can use any language just Google Lambda update function configuration + your SDK):

1. Create a lambda function with any name that you like for example: test-update-env

2. Paste the code below to your function:

```javascript{numberLines: false}
const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

exports.handler = async event => {
  const params = {
    FunctionName: 'test-update-env',
    Environment: {
      Variables: {
        MY_VAR_1: 'Foo', // Set process.env.MY_VAR_1 = 'Foo'
      },
    },
  }
  await lambda.updateFunctionConfiguration(params).promise()
  const response = {
    statusCode: 200,
    body: JSON.stringify('Update env successfully!'),
  }
  return response
}
```

3. Now run this function and press F5 and you can see the function now has environment variable `MY_VAR_1` with value: `Foo`

4. Modify the code a bit:

```javascript{numberLines: false}
const AWS = require('aws-sdk')
const lambda = new AWS.Lambda()

exports.handler = async event => {
  const params = {
    FunctionName: 'test-update-env',
    Environment: {
      Variables: {
        MY_VAR_1: 'New Foo', // update process.env.MY_VAR_1 = 'New Foo'
        MY_VAR_2: 'Bar', // Set process.env.MY_VAR_2 = 'Bar'
      },
    },
  }
  await lambda.updateFunctionConfiguration(params).promise()
  const response = {
    statusCode: 200,
    body: JSON.stringify('Update env successfully!'),
  }
  return response
}
```

5. Now run this again and you can see the function now has updated environment variable `MY_VAR_1` with a new value: `New foo` and new environment variable `MY_VAR_2` with value: `Bar`

Now you get the idea, you can get any value likes token from API call, calendar/booking data, ... and set/update it to environment variables.

Note: AWS Lambda environment variable has 4Kb limit, it means if you use normal English characters we can store 4000 characters (not so bad at all). See detail [here](https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html)!

You can use my tool here for counting bytes online: https://minitool.github.io/countbytesonline/

In the next article I will share a post about using Lambda as a real database so we do not need to worry about the limitation above.

Please share this article and comment if you like the article!

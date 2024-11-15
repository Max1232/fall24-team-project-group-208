#!/bin/bash

# Welcome message
echo 'Welcome to the test script'

# Define the output file
OUTPUT_FILE="testResults.json"

# Default test path
TEST_PATH="tests/*"

# Check if a running time argument is provided
if [ -z "$1" ]; then
    echo 'No running time argument provided, running all tests'
else
    echo "Running time argument provided: $1"
    if [ "$1" == "-f" ]; then
        if [ -z "$2" ]; then
        echo "No test path provided, running all tests"
        else
        TEST_PATH="tests/$2"
        fi
    fi
fi

# Run the tests and save the output
echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH\""
script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH" $OUTPUT_FILE

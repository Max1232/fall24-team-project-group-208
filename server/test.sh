#!/bin/bash

# Welcome message
echo 'Welcome to the test script'

# Get the current date time in the format of "HHHH_DDMONTHYYYY" with shortened month name
CURRENT_DATE=$(date +"%H%M_%b%Y")

# Create the output file
touch "testResults"$CURRENT_DATE".json"

# Define the output file with the current date time
OUTPUT_FILE="testResults"$CURRENT_DATE".json"

# Default test path
TEST_PATH="tests/*"

# Boolean variable to control verbosity
# True by default
VERBOSE=false

# Set verbosity option
if [ "$VERBOSE" == true ]; then
    VERBOSE_OPTION="--verbose"
else
    VERBOSE_OPTION="--verbose=false"
fi

# Check if a running time argument is provided
if [ -z "$1" ]; then
    echo 'No running time argument provided, running all tests'
    echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false\""
    script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false" $OUTPUT_FILE
else
    echo "Running time argument provided: $1"
    if [ "$1" == "-f" ]; then
        if [ -z "$2" ]; then
            echo "No test path provided, running all tests"
            echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false\""
            script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false" $OUTPUT_FILE
        else
            TEST_PATH="tests/$2"
            if [ -z "$3" ]; then
                echo "No test name provided, running all tests"
                echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false\""
                script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false" $OUTPUT_FILE
            else
                echo "Running time argument provided: $3"
                if [ "$3" == "-t" ]; then
                    if [ -z "$4" ]; then
                        echo "No test name provided, running all tests in $TEST_PATH"
                        echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false\""
                        script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH $VERBOSE_OPTION --silent=false" $OUTPUT_FILE
                    else
                        echo "Test name provided: $4"
                        TEST_NAME=$(echo $4 | sed 's/^["'\'']//;s/["'\'']$//')
                        TEST_PATH="tests/$2"
                        echo "Running tests with \"npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH -t '$TEST_NAME' $VERBOSE_OPTION --silent=false\""
                        script -q -c "npx jest --detectOpenHandles --maxWorkers=50% $TEST_PATH -t '$TEST_NAME' $VERBOSE_OPTION --silent=false" $OUTPUT_FILE
                    fi
                fi
            fi
        fi
    fi
fi

# Check if the $OUTPUT_FILE contains the string "COMMAND_EXIT_CODE="130""
if grep -q "COMMAND_EXIT_CODE=\"130\"" $OUTPUT_FILE; then
    echo "Test script was interrupted"
    echo "Removing the $OUTPUT_FILE"
    rm $OUTPUT_FILE
else    
    mv $OUTPUT_FILE testResults/
fi
# Change to mv after finished editing
# rm $OUTPUT_FILE
# mv $OUTPUT_FILE testResults/
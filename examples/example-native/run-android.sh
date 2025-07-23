#!/bin/bash
cd android
./gradlew installDebug
adb shell am start -n com.examplenative/.MainActivity

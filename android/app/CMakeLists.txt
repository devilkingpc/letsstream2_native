cmake_minimum_required(VERSION 3.22.1)

project(app)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Add dummy library
add_library(${PROJECT_NAME} SHARED dummy.cpp)

# Define libraries to link against
target_link_libraries(${PROJECT_NAME})

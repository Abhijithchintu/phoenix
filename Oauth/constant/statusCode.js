/*
* STATUS CODE FORMAT
* first two letters: Indicates service, ex: OA - OAuth
* next two letters: Indicates route/aspect, ex: RE - Register route
* fifth letter: Indicates type of code, ex: V - Client data validation error
* next digits: error code numbering
*
* ************** Routes/Aspect Codes ***************
* RE: register
* LO: login
* */
module.exports = Object.freeze({
    OA_1000: "Invalid username or mobile",
    OA_1001: "Invalid password",
    OA_1002: "User Name is invalid",
    OA_1003: "User Name is too long, it should be in the range of (8-20)",
    OA_1004: "User Name is too short, it should be in the range of (8-20)",
    OA_1005: "User Name should start with an alphabet, it should contain only alphabets and numbers",
    OA_1006: "Mobile Number is invalid",
    OA_1007: "Mobile number is too long, it should contain 10 digits",
    OA_1008: "Mobile number is too short, it should contain 10 digits",
    OA_1009: "Mobile Number should only contain 10 digits",
    OA_1010: "Password is invalid",
    OA_1011: "Password is too long, it should be in the range of (8-31)",
    OA_1012: "Password is too short, it should be in the range of (8-31)",
    OA_1013: "Password must contain atleast 1 Capital letter, 1 small letter and 1 special character",
    OA_1014: "Name is too short, it should contain atleast 3 characters",
    OA_1015: "Name is too long, it should contain only 40 characters",
    OA_1016: "Mobile number or User is already registered",
    OA_1017: "Invalid username or mobile",
    OA_1018: "Invalid gender",
    OA_1019: "Invalid dob",
    OA_1020: "Invalid username",
    OA_1021: "Name is not invalid"
});
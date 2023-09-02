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
    PL_1000: "Invalid username"
});
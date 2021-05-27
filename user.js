var test = Cookies.get('datamember');
if (test != undefined) {
    test = JSON.parse(test)
} else {
    test = Cookies.get('datamemberID');
    test = JSON.parse(test)
}
console.log(test)
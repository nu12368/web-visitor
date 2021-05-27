//const userId = '5fe2c8a089d27d3818e4bcba'
//console.log(Cookies.get('datatoken'))
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var IDUSER = JSON.parse(Cookies.get('datajwt'));


var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;

function acctoken() {
    //  console.log('acctoken')
    // console.log(obj.refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            // console.log('aaaaaaaaaaaaaa')
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
                //   console.log('bbb')
                // console.log(response.data.message.access_token)
                resolve(response.data.message.access_token);

            }).catch(function (res) {
                const { response } = res
              //  console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}

function getvisitorType(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitorType/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                //  console.log(response.data.message.visitorType)
                resolve(response.data.message.visitorType);

            }).catch(function (res) {
                const { response } = res
              //  console.log(response.data)
            });
        });
    });
}
var cnt_Log;
function getvisitorReportLog(refresh_token) {

    // console.log('sassdsdsdsdsdsdsd')
    var today = new Date();
    const _m = (today.getMonth() + 1).toString().padStart(2, '0');
    const _d = (today.getDate()).toString().padStart(2, '0');
    var date = today.getFullYear().toString() + _m + _d;
    var paramLog;
    //var _page =2;

    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 10; _page++) {
                //10.0.0.205:4004/visitorLog?_id=5fe2c8a089d27d3818e4bcba&_time=20210202&_before=false&_page=1&_limit=100&_sort=-1&_type=all
                paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=-1&_type=all'
                // console.log(paramLog)
                //  console.log(refresh_token)
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    cnt_Log = responseLog.data.message.result.length;
              //      console.log(responseLog.data.message.result.length)

                    //    console.log(responseLog.data.message.result)
                    if (cnt_Log != 0) {
                    //    console.log('เข้า-ออกวันนี้')
                    //    console.log(responseLog.data.message.result)
                        //  console.log(responseLog.data.message.result.length)
                        for (i = 0; i < cnt_Log; i++) {
                            // console.log(i)
                            // console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {
                                _arr[n] = {
                                    visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                    visitorType: responseLog.data.message.result[i].visitorType,
                                    citizenId: responseLog.data.message.result[i].citizenId,
                                    name: responseLog.data.message.result[i].name,
                                    licensePlate: responseLog.data.message.result[i].licensePlate,
                                    vehicleType: responseLog.data.message.result[i].vehicleType,
                                    contactPlace: responseLog.data.message.result[i].contactPlace,
                                    recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                    etc: responseLog.data.message.result[i].etc,
                                    image: responseLog.data.message.result[i].image1 + " " + responseLog.data.message.result[i].image2 + " " + responseLog.data.message.result[i].image3 + " " + responseLog.data.message.result[i].image4,
                                    visitorId: responseLog.data.message.result[i].visitorId,
                                    timestamp: responseLog.data.message.result[i].timestamp
                                }
                                n = n + 1
                            }
                        }
                  //     console.log('ทั้งหมดวันนี้')
                  //      console.log(_arr)
                        resolve(_arr);
                    } else {

                   //     console.log(_arr)
                        if (n == 0 && _arr.length == 0) {
                            // console.log(_arrSearch)
                            resolve(_arr)
                        }
                        if (_arr.length == 0) {
                            // console.log(_arrSearch)
                            n = 0
                            resolve(_arr)
                        }
                    }

                }).catch(function (res) {
                    const { response } = res
                  //  console.log(response.data)
                });
            }
        });

    });

}
var cnt_InfoDate
function getvisitorReportInfoNewdate(refresh_token) {  ////// เอา log มา add Array ต่อจาก Log
    //console.log('Info')
    var today = new Date();
    const _m = (today.getMonth() + 1).toString().padStart(2, '0');
    const _d = (today.getDate()).toString().padStart(2, '0');
    var date = today.getFullYear().toString() + _m + _d;
    var paramInfo;
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            for (_page = 1; _page <= 10; _page++) {
                //10.0.0.205:4004/visitorInfo?_id=5fe2c8a089d27d3818e4bcba&_time=20210202&_before=false&_page=1&_limit=2&_sort=-1&_type=all
                paramInfo = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=-1&_type=all'
                axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseInfo) {
                    cnt_InfoDate = responseInfo.data.message.result.length;
                //    console.log(cnt_InfoDate)
                    if (cnt_InfoDate != 0) {
                        // console.log(responseInfo.data.message.result)
                        for (i = 0; i < cnt_InfoDate; i++) {
                            // console.log(i)
                            // console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseInfo.data.message.result[i].visitorType == undefined && responseInfo.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {
                                _arr[n] = {
                                    visitorNumber: responseInfo.data.message.result[i].visitorNumber,
                                    visitorType: responseInfo.data.message.result[i].visitorType,
                                    citizenId: responseInfo.data.message.result[i].citizenId,
                                    name: responseInfo.data.message.result[i].name,
                                    licensePlate: responseInfo.data.message.result[i].licensePlate,
                                    vehicleType: responseInfo.data.message.result[i].vehicleType,
                                    contactPlace: responseInfo.data.message.result[i].contactPlace,
                                    recordTimeIn: responseInfo.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseInfo.data.message.result[i].recordTimeOut,
                                    etc: responseInfo.data.message.result[i].etc,
                                    image: responseInfo.data.message.result[i].image1 + " " + responseInfo.data.message.result[i].image2 + " " + responseInfo.data.message.result[i].image3 + " " + responseInfo.data.message.result[i].image4,
                                    visitorId: responseInfo.data.message.result[i].visitorId,
                                    timestamp: responseInfo.data.message.result[i].timestamp
                                }
                                n = n + 1
                            }
                        }
                       // console.log('รวมวั้นนี้')
                      //  console.log(_arr)

                        resolve(_arr);
                    } else {

                        resolve(_arr)

                    }

                }).catch(function (res) {
                    const { response } = res
                  //  console.log(response.data)
                });
            }
        });

    });

}

var cnt_Info;
function getvisitorReportInfo(refresh_token) {  ////// เอา log มา add Array ต่อจาก Log
    // console.log('Info')
    var today = new Date();
    const _m = (today.getMonth() + 1).toString().padStart(2, '0');
    const _d = (today.getDate()).toString().padStart(2, '0');
    var date = today.getFullYear().toString() + _m + _d;
    var paramInfo;
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            for (_page = 1; _page <= 10; _page++) {
                //10.0.0.205:4004/visitorInfo?_id=5fe2c8a089d27d3818e4bcba&_time=20210202&_before=false&_page=1&_limit=2&_sort=-1&_type=all
                paramInfo = '_id=' + userId + '&_time=' + date + '&_before=true&_page=' + _page + '&_limit=100&_sort=-1&_type=all'

                axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseInfo) {
                    cnt_Info = responseInfo.data.message.result.length;
                 //   console.log(cnt_Info)
                    if (cnt_Info != 0) {

                        // console.log('visitorInfo')
                        //console.log(responseInfo.data.message.result)
                        //    console.log(responseInfo.data.message.result.length)
                        for (i = 0; i < cnt_Info; i++) {
                            // console.log(i)
                            // console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseInfo.data.message.result[i].visitorType == undefined && responseInfo.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {
                                _arrInfo[n_info] = {
                                    visitorNumber: responseInfo.data.message.result[i].visitorNumber,
                                    visitorType: responseInfo.data.message.result[i].visitorType,
                                    citizenId: responseInfo.data.message.result[i].citizenId,
                                    name: responseInfo.data.message.result[i].name,
                                    licensePlate: responseInfo.data.message.result[i].licensePlate,
                                    vehicleType: responseInfo.data.message.result[i].vehicleType,
                                    contactPlace: responseInfo.data.message.result[i].contactPlace,
                                    recordTimeIn: responseInfo.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseInfo.data.message.result[i].recordTimeOut,
                                    etc: responseInfo.data.message.result[i].etc,
                                    image: responseInfo.data.message.result[i].image1 + " " + responseInfo.data.message.result[i].image2 + " " + responseInfo.data.message.result[i].image3 + " " + responseInfo.data.message.result[i].image4,
                                    visitorId: responseInfo.data.message.result[i].visitorId,
                                    timestamp: responseInfo.data.message.result[i].timestamp
                                }
                                n_info = n_info + 1
                            }
                        }
                        resolve(_arrInfo);
                    } else {
                        resolve(_arrInfo);
                    }

                }).catch(function (res) {
                    const { response } = res
                   // console.log(response.data)
                });
            }
        });

    });

}

///////////////////////////////// เข้าวันนี้



$(async function () {
    const result = await acctoken();
   // console.log(result)

    const responseLog = await getvisitorReportLog(result);
  //  console.log('responseLog')
   // console.log(responseLog)


    const responseReportNewdate = await getvisitorReportInfoNewdate(result);
   // console.log('วันนี้ทังหมด')
   // console.log(responseReportNewdate)


    const responseReport = await getvisitorReportInfo(result);
    //console.log('responseReport')
   // console.log(responseReport)



   // console.log('//////////////////////////////////////////////////////////////////////////')

    var responsevisitorType = await getvisitorType(result);

    var _arrvisitorview = new Array();
    var v_type;
    var _n = 0
    var num = 0;
    var TimeIn = 0;
    var Timeout = 0;
    for (i = 0; i < responsevisitorType.length; i++) { //// ประเภท
        //  v_type = responsevisitorType[i];
      //  console.log(responsevisitorType[i])
        for (i_res = 0; i_res < responseReport.length; i_res++) {  ///ทั้งหมด
            if (responsevisitorType[i] == responseReport[i_res].visitorType) {

                num = num + 1

            }
        }

        for (i_date = 0; i_date < responseReportNewdate.length; i_date++) {
            if (responsevisitorType[i] == responseReportNewdate[i_date].visitorType) {
                TimeIn = TimeIn + 1
                if (responseReportNewdate[i_date].recordTimeOut != '') {
                    Timeout = Timeout + 1
                }
            }
        }
        //console.log(v_type)
        _arrvisitorview[_n] = {
            visitorType: responsevisitorType[i],
            recordTimeIn: TimeIn,
            recordTimeOut: Timeout,
            balance: num
        }
      //  console.log(TimeIn)
        TimeIn = 0
        Timeout = 0
        num = 0
        _n = _n + 1
    }

   // console.log(_arrvisitorview)


    $('#tablevisitor').DataTable({
        "pageLength": 20,
        "bPaginate": false,
        "bLengthChange": false,
        "bInfo": false,
        "bAutoWidth": false,
        "searching": false,
        'data': _arrvisitorview,
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "visitorType" },
            { data: "recordTimeIn" },
            { data: "recordTimeOut" },
            { data: "balance" },
        ],
        "footerCallback": function (row, data, start, end, display) {
            var api = this.api(),
                data;
            //console.log(api)
            // Remove the formatting to get integer data for summation
            var intVal = function (i) {
                return typeof i === 'string' ?
                    i.replace(/[\$,]/g, '') * 1 :
                    typeof i === 'number' ?
                        i : 0;
            };

            // Total over all pages
            for (i = 1; i < 4; i++) {

                total = api
                    .column(i)
                    .data()
                    .reduce(function (a, b) {
                   //     console.log(intVal(a) + intVal(b))
                        return intVal(a) + intVal(b);
                    }, 0);

                // Total over this page
                pageTotal = api
                    .column(i, {
                        page: 'current'
                    })
                    .data()
                    .reduce(function (a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                // Update footer
                $(api.column(i).footer()).html(
                    total
                );
                $(api.column(i).footer()).html(
                    pageTotal
                );

                $('#total').text('£' + Number(pageTotal).toFixed(i));
            }
        }


    });





    $(function () {
        new Chart(document.getElementById("bar_chartnew").getContext("2d"), getChartJs('bar'));
        new Chart(document.getElementById("pie_chart").getContext("2d"), getChartJs('pieIn'));
        new Chart(document.getElementById("pie_chartout").getContext("2d"), getChartJs('pieOut'));
        new Chart(document.getElementById("pie_chartbalance").getContext("2d"), getChartJs('pieBalance'));


    });
    function getChartJs(type) {
        var config = null;
      //  console.log(responsevisitorType)

        var chartTimeIn = new Array();
        var chartTimeOut = new Array();
        var chartBalance = new Array();

        var PicchartTimeIn = new Array();
        var PicchartTimeOut = new Array();
        var PicchartBalance = new Array();

        var Pic = new Array();
        ///////////////////////////////////////////////////// กราฟ
        for (i = 0; i < _arrvisitorview.length; i++) {
            chartTimeIn[i] =
                _arrvisitorview[i].recordTimeIn

            PicchartTimeIn[i] =
                _arrvisitorview[i].recordTimeIn
        }
        for (i = 0; i < _arrvisitorview.length; i++) {
            chartTimeOut[i] =
                _arrvisitorview[i].recordTimeOut

            PicchartTimeOut[i] =
                _arrvisitorview[i].recordTimeOut
        }
        for (i = 0; i < _arrvisitorview.length; i++) {
            chartBalance[i] =
                _arrvisitorview[i].balance

            PicchartBalance[i] =
                _arrvisitorview[i].balance

        }


        if (type === 'line') {
            config = {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],

                    datasets: [{
                        label: "My First dataset",
                        data: [65, 59, 80, 81, 56, 55, 40],
                        borderColor: 'rgba(0, 188, 212, 0.75)',
                        backgroundColor: 'rgba(0, 188, 212, 0.3)',
                        pointBorderColor: 'rgba(0, 188, 212, 0)',
                        pointBackgroundColor: 'rgba(0, 188, 212, 0.9)',
                        pointBorderWidth: 1
                    }, {
                        label: "My Second dataset",
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: 'rgba(233, 30, 99, 0.75)',
                        backgroundColor: 'rgba(233, 30, 99, 0.3)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.9)',
                        pointBorderWidth: 1
                    }


                    ]
                },
                options: {
                    responsive: true,
                    legend: false
                }
            }
        }
        else if (type === 'bar') {
            // var s = 0;
            // for (i = 0; i < chartTimeIn.length; i++) {
            //     s += parseInt(chartTimeIn[i]) + parseInt(chartTimeIn[i])
            // }
            // if (s != 0) {
            // }


            config = {
                type: 'bar',
                data: {
                    labels: responsevisitorType,
                    datasets: [{
                        label: "เข้า",
                        data: chartTimeIn,
                        backgroundColor: 'rgba(139, 195, 74)'

                    }, {
                        label: "ออก",
                        data: chartTimeOut,
                        backgroundColor: 'rgba(233, 30, 99, 0.8)'
                    }, {
                        label: "คงเหลือ",
                        data: chartBalance,
                        backgroundColor: 'rgba(0, 188, 212, 0.8)'
                    }

                    ]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'right',
                    },
                }
            }
        }
        else if (type === 'radar') {
            config = {
                type: 'radar',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July"],
                    datasets: [{
                        label: "My First dataset",
                        data: [65, 25, 90, 81, 56, 55, 40],
                        borderColor: 'rgba(0, 188, 212, 0.8)',
                        backgroundColor: 'rgba(0, 188, 212, 0.5)',
                        pointBorderColor: 'rgba(0, 188, 212, 0)',
                        pointBackgroundColor: 'rgba(0, 188, 212, 0.8)',
                        pointBorderWidth: 1
                    }, {
                        label: "My Second dataset",
                        data: [72, 48, 40, 19, 96, 27, 100],
                        borderColor: 'rgba(233, 30, 99, 0.8)',
                        backgroundColor: 'rgba(233, 30, 99, 0.5)',
                        pointBorderColor: 'rgba(233, 30, 99, 0)',
                        pointBackgroundColor: 'rgba(233, 30, 99, 0.8)',
                        pointBorderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    legend: false
                }
            }
        }
        else if (type === 'pieIn') {
            var s = 0;
            for (i = 0; i < PicchartTimeIn.length; i++) {
                s += parseInt(PicchartTimeIn[i]) + parseInt(PicchartTimeIn[i])
            }

            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: PicchartTimeIn,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: responsevisitorType,

                    },
                    options: {
                        responsive: true,
                        display: true,
                        legend: {
                            position: 'right',
                        },
                    }
                }
            }

        }
        else if (type === 'pieOut') {

          //  console.log(PicchartTimeOut)
            var s = 0;
            for (i = 0; i < PicchartTimeOut.length; i++) {
                s += parseInt(PicchartTimeOut[i]) + parseInt(PicchartTimeOut[i])
             
            }
          //  console.log(s)
          
            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: PicchartTimeOut,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: responsevisitorType,
                    },
                    options: {
                        responsive: true,
                        legend: {
                            position: 'right',
                        },
                    }
                }
            }

        }
        else if (type === 'pieBalance') {
            var s = 0;
            for (i = 0; i < PicchartBalance.length; i++) {
                s += parseInt(PicchartBalance[i]) + parseInt(PicchartBalance[i])
            }
            if (s != 0) {
                config = {
                    type: 'doughnut',
                    data: {
                        datasets: [{
                            data: PicchartBalance,
                            backgroundColor: [
                                "rgb(233, 30, 99)",
                                "rgb(255, 193, 7)",
                                "rgb(0, 188, 212)",
                                "rgb(139, 195, 74)",
                                "rgb(255, 255,0 )",
                                "rgb(255, 102,102)",
                                "rgb(255, 128, 0 )",
                                "rgb(0, 0, 255)",
                                "rgb(127, 0, 255)",
                                "rgb(25,25,112)",
                                "rgb(210,105,30)"
                            ],
                        }],
                        labels: responsevisitorType,
                    },
                    options: {
                        responsive: true,
                        legend: {
                            display: true,
                            position: 'right',
                        },

                    },

                }
            }



        }
        return config;
    }

    function labelFormatter(label, series) {
        return '<div style="font-size:8pt; text-align:center; padding:2px; color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
    }
});
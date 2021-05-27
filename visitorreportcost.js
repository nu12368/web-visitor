//const userId = '5fe2c8a089d27d3818e4bcba'
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var _arrSearch = new Array();
var n = 0;
//console.log(userId)
function acctoken() {
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
             //   console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}

function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return leftPad(rhours, 2) + ":" + leftPad(rminutes, 2);
}
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function getvisitorReportLog(refresh_token) {
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
                paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                //  console.log(paramLog)
                //  console.log(refresh_token)
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    var cnt_Log = responseLog.data.message.result.length;
                  //  console.log(responseLog.data.message.result)
                    // console.log(responseLog.data.message.result)
                    if (cnt_Log != 0) {
                        //  console.log('responseLog')
                        //  console.log(responseLog.data.message.result)
                        //  console.log(responseLog.data.message.result.length)
                        for (i = 0; i < cnt_Log; i++) {
                            // console.log(i)
                            //  console.log(timeConvert(responseLog.data.message.result[i].cost.totalMinute));
                            var _total = timeConvert(responseLog.data.message.result[i].cost.totalMinute)

                            var sum = parseInt(responseLog.data.message.result[i].cost.totalExpenses) + parseInt(responseLog.data.message.result[i].cost.extraCost)
                            if (responseLog.data.message.result[i].cost.costType != '') {
                                var _payment = 'ไม่จ่าย'
                                if (responseLog.data.message.result[i].cost.paymentStatus == 'Y') {
                                    _payment = 'จ่าย'
                                } else
                                    if (responseLog.data.message.result[i].cost.paymentStatus == 'C') {
                                        _payment = 'แก้ไขเงิน'
                                    }
                                _arr[n] = {
                                    recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                    contactPlace: responseLog.data.message.result[i].contactPlace,
                                    visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                    visitorType: responseLog.data.message.result[i].visitorType,
                                    costType: responseLog.data.message.result[i].cost.costType,
                                    totalMinute: _total,
                                    totalMinute2: responseLog.data.message.result[i].cost.totalMinute,
                                    totalExpenses: sum,
                                    paymentStatus: _payment,
                                }
                                n = n + 1
                            }


                        }
                        //   console.log(_arr)
                        resolve(_arr);
                    } else {
                        // console.log(n)
                        //  console.log(_arr)
                        if (n == 0 && _arr.length == 0) {
                            // n =0
                            //      console.log(_arr)
                            resolve(_arr)
                        }
                    }

                }).catch(function (res) {
                    const { response } = res
                   // console.log(response.data)
                });
            }
        });

    });

}




var cnt_Log;
var _cnt_Log;
var paramLog;
//const datt = async (aa) => {
const SearchLog = async (refresh_token, d) => {

   // console.log('getvisitorReportLogSearch' + d)
    if (d != undefined) {
        var co = 0;
        var _pagecount;
        var _total;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 1; _page++) {
               // console.log(d)
                paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    cnt_Log = responseLog.data.message.result.length;
                    _total = responseLog.data.message.result;
                   // console.log('ssssssssssssssssssssssssss')
                   // console.log(_total)
                    if (_total > 1000) {
                        co = _total / 100
                        _pagecount = co;
                        for (_p = 1; _p <= _pagecount; _p++) {
                           // console.log('AAAAAAAAAAAAAAAAAAA')
                          //  console.log(_pagecount + 1)
                          ////  console.log(_p)

                            _paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'

                            axios.get(urlipaddress + 'visitorLog?' + _paramLog, {
                                headers: {
                                    'Authorization': refresh_token
                                }
                            }).then(function (responseLogsearch) {
                                _cnt_Log = responseLogsearch.data.message.result.length;
                                if (_cnt_Log != 0) {
                                    for (i = 0; i < _cnt_Log; i++) {
                                        var _total = timeConvert(responseLogsearch.data.message.result[i].cost.totalMinute)
                                        var sum = parseInt(responseLog.data.message.result[i].cost.totalExpenses) + parseInt(responseLog.data.message.result[i].cost.extraCost)
                                        if (responseLog.data.message.result[i].cost.costType != '') {
                                            var _payment = 'ไม่จ่าย'
                                            if (responseLog.data.message.result[i].cost.paymentStatus == 'Y') {
                                                _payment = 'จ่าย'
                                            } else
                                                if (responseLog.data.message.result[i].cost.paymentStatus == 'C') {
                                                    _payment = 'แก้ไขเงิน'
                                                }
                                            _arrSearch[n] = {
                                                recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                                recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                                contactPlace: responseLog.data.message.result[i].contactPlace,
                                                visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                                visitorType: responseLog.data.message.result[i].visitorType,
                                                costType: responseLog.data.message.result[i].cost.costType,
                                                totalMinute: _total,
                                                totalMinute2: responseLog.data.message.result[i].cost.totalMinute,
                                                totalExpenses: sum,
                                                paymentStatus: _payment,
                                            }
                                            n = n + 1
                                        }

                                    }

                                } else {
                                }
                            }).catch(function (res) {
                                const { responseLogsearch } = res
                              //  console.log(responseLogsearch.data)
                            });

                        }
                    }


                 //   console.log(responseLog.data.message.result)
                    if (cnt_Log != 0) {
                        for (i = 0; i < cnt_Log; i++) {
                            var _total = timeConvert(responseLog.data.message.result[i].cost.totalMinute)
                            var sum = parseInt(responseLog.data.message.result[i].cost.totalExpenses) + parseInt(responseLog.data.message.result[i].cost.extraCost)
                            if (responseLog.data.message.result[i].cost.costType != '') {
                                var _payment = 'ไม่จ่าย'
                                if (responseLog.data.message.result[i].cost.paymentStatus == 'Y') {
                                    _payment = 'จ่าย'
                                } else
                                    if (responseLog.data.message.result[i].cost.paymentStatus == 'C') {
                                        _payment = 'แก้ไขเงิน'
                                    }
                                _arrSearch[n] = {
                                    recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                    contactPlace: responseLog.data.message.result[i].contactPlace,
                                    visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                    visitorType: responseLog.data.message.result[i].visitorType,
                                    costType: responseLog.data.message.result[i].cost.costType,
                                    totalMinute: _total,
                                    totalMinute2: responseLog.data.message.result[i].cost.totalMinute,
                                    totalExpenses: sum,
                                    paymentStatus: _payment,
                                }
                                n = n + 1
                            }
                        }

                        //console.log(_arrSearch)


                    } else {

                    }

                }).catch(function (res) {
                    const { response } = res
                  //  console.log(response.data)
                });
            }
        });
    }
}















var _arrnewcost = new Array();
var c_search = '';
var n2 = 0;
var _sSearch = '';
$(async function () {



    $('#cancel').on('click', function (e) {
        location.href = "visitorreportcost.html";
    });

    const result = await acctoken();
    // console.log('result')
    //console.log(result)



    // console.log('responseLog')
    // console.log(responseLog)
    $('#table1').DataTable().destroy();

    if (_sSearch != 'Search') {
        var responseLog = await getvisitorReportLog(result);
        viewCost(result, responseLog)
    }

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        $('#SearchdateReportCost').on('click', async function (e) {
            n = 0;
            _sSearch = 'Search';
            _arrSearch = new Array()
            _arrnewcost == new Array()
            var startdate = document.getElementById("startdate").value.split('/'); /// 2 1 0
            var enddate = document.getElementById("enddate").value.split('/');

            var s = startdate[2] + startdate[1] + startdate[0];
            var e = enddate[2] + enddate[1] + enddate[0];
            // console.log(s)
            // console.log(e)
            var cc = parseInt(startdate[0]);
            var aa = parseInt(enddate[0]) + 1;

            var dd = aa - cc;
         //   console.log(dd);
            var s_date;
            var re;

            for (i = 0; i < dd; i++) {
                //  console.log(startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0'));
                s_date = startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')

               // console.log(s_date);
                const result = await acctoken();
              //  console.log(result)
               responseLog =  SearchLog(result, s_date);
                //  console.log('responseLog')
                //    console.log(responseLog)
                cc = cc + 1;
              //  console.log('fffffff')

            }

      

         viewCost(result, _arrSearch)


        });

    });


});


function newCost(log, cnt_cost) {
    var _costtime = '';

   // console.log(log)
    for (i2 = 0; i2 < cnt_cost.length; i2++) {
        if (log.visitorType == cnt_cost[i2].visitorType && log.costType == cnt_cost[i2].costType) {
            costTime = cnt_cost[i2].costTime
            for (i3 = 0; i3 < costTime.length; i3++) {
                if (parseInt(log.totalMinute2) < parseInt(costTime[0])) {  /////ยังไม่ถึง 1 ชั่วโมง

                    _costtime = timeConvert(0)

                    break;
                }

                if (parseInt(log.totalMinute2) == parseInt(costTime[0])) {  /////ครบ 1 ชั่วโมง

                    var _sum = parseInt(log.totalMinute2) - parseInt(costTime[0])
                    _costtime = timeConvert(_sum)

                    break;
                }

                if (parseInt(log.totalMinute2) > parseInt(costTime[i3])) {  /////////////จอดเกิน 1 ชั่วโมง

                    var _sum = parseInt(log.totalMinute2) - parseInt(costTime[i3])
                    _costtime = timeConvert(_sum)

                    break;
                }
            }


        }
    }


    return _costtime;
}



function viewCost(result, responseLog) {

    //console.log(responseLog)
    _arrnewcost = new Array();
    n2 = 0;
    ////////////////////////////////////////////////////////////////////   เช็คชั่วโมง
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var paramcost = '_id=' + userId + '&_page=1&_limit=100'
        axios.get(urlipaddress + 'cost?' + paramcost, {
            headers: {
                'Authorization': result
            }
        }).then(function (responsecost) {
            var cnt_cost = responsecost.data.message.result;


            for (i = 0; i < responseLog.length; i++) {
                var Timein = responseLog[i].recordTimeIn.split('-')
              //  console.log(Timein[0])
                var today = new Date();
                var date = today.getFullYear().toString();

                if (Timein[0] == date) {
                    var _costtime = newCost(responseLog[i], cnt_cost)
                    _arrnewcost[n2] = {
                        recordTimeIn: responseLog[i].recordTimeIn,
                        recordTimeOut: responseLog[i].recordTimeOut,
                        contactPlace: responseLog[i].contactPlace,
                        visitorNumber: responseLog[i].visitorNumber,
                        visitorType: responseLog[i].visitorType,
                        costType: responseLog[i].costType,
                        totalMinute: responseLog[i].totalMinute,
                        totalMinute2: _costtime,
                        totalExpenses: responseLog[i].totalExpenses,
                        paymentStatus: responseLog[i].paymentStatus
                    }
                    n2 = n2 + 1

                }
            }

            // console.log(responseLog)
            // console.log(responsecost.data.message.result)
            // var costTime = '';
            // var _costtime = '';
            // for (i = 0; i < responseLog.length; i++) {

            // var Timein = responseLog[i].recordTimeIn.split('-')
            // console.log(Timein[0])
            // var today = new Date();
            // const _m = (today.getMonth() + 1).toString().padStart(2, '0');
            // const _d = (today.getDate()).toString().padStart(2, '0');
            // var date = today.getFullYear().toString();
            // var num = 0;
            // if (Timein[0] == date) {
            //     for (i2 = 0; i2 < cnt_cost.length; i2++) {

            //         if (responseLog[i].visitorType == cnt_cost[i2].visitorType && responseLog[i].costType == cnt_cost[i2].costType) {
            //             costTime = cnt_cost[i2].costTime
            //             //   console.log(costTime)
            //             for (i3 = 0; i3 < costTime.length; i3++) {
            //                 //  console.log(responseLog[i].totalMinute2)
            //                 if (parseInt(responseLog[i].totalMinute2) < parseInt(costTime[0])) {  /////ยังไม่ถึง 1 ชั่วโมง

            //                     _costtime = timeConvert(0)

            //                     break;
            //                 }

            //                 if (parseInt(responseLog[i].totalMinute2) == parseInt(costTime[0])) {  /////ครบ 1 ชั่วโมง

            //                     var _sum = parseInt(responseLog[i].totalMinute2) - parseInt(costTime[0])
            //                     _costtime = timeConvert(_sum)

            //                     break;
            //                 }

            //                 if (parseInt(responseLog[i].totalMinute2) > parseInt(costTime[i3])) {  /////////////จอดเกิน 1 ชั่วโมง

            //                     var _sum = parseInt(responseLog[i].totalMinute2) - parseInt(costTime[i3])
            //                     _costtime = timeConvert(_sum)

            //                     break;
            //                 }
            //             }
            //             _arrnewcost[n2] = {
            //                 recordTimeIn: responseLog[i].recordTimeIn,
            //                 recordTimeOut: responseLog[i].recordTimeOut,
            //                 contactPlace: responseLog[i].contactPlace,
            //                 visitorNumber: responseLog[i].visitorNumber,
            //                 visitorType: responseLog[i].visitorType,
            //                 costType: responseLog[i].costType,
            //                 totalMinute: responseLog[i].totalMinute,
            //                 totalMinute2: _costtime,
            //                 totalExpenses: responseLog[i].totalExpenses,
            //                 paymentStatus: responseLog[i].paymentStatus
            //             }
            //             n2 = n2 + 1

            //         }
            //     }
            // }

            // }


            $('#table1').DataTable().destroy();
            var table = $('#table1').DataTable({
                "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                "pageLength": 25,
                'data': _arrnewcost,
                "ordering": false,
                "bAutoWidth": false,
                "responsive": true,
                "autoWidth": false,
                orderCellsTop: true,
                fixedHeader: true,
                "order": [],
                columns: [
                    {
                        data: "recordTimeIn",
                        render: function (data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                        }
                    },
                    {
                        data: "recordTimeOut",
                        render: function (data) {

                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                        }
                    },
                    { data: "contactPlace" },
                    { data: "visitorNumber" },
                    { data: "visitorType" },
                    { data: "costType" },
                    { data: "totalMinute" },
                    { data: "totalMinute2" },
                    { data: "totalExpenses" },
                    { data: "paymentStatus" },
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
                    //for (i = 1; i < 4; i++) {

                    total = api
                        .column(8)
                        .data()
                        .reduce(function (a, b) {
                       //     console.log(intVal(a) + intVal(b))
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Total over this page
                    pageTotal = api
                        .column(8, {
                            page: 'current'
                        })
                        .data()
                        .reduce(function (a, b) {
                            return intVal(a) + intVal(b);
                        }, 0);

                    // Update footer
                    $(api.column(8).footer()).html(
                        total
                    );
                    $(api.column(8).footer()).html(
                        pageTotal
                    );

                    $('#total').text('£' + Number(pageTotal).toFixed(8));
                    // }
                },
                dom: 'lBfrtip',
                buttons: [
                    {
                        title: 'export',
                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                        footer: true

                        // exportOptions: {
                        //     format: {
                        //         header: function (data, column, row) {
                        //             return header[column]; //header is the array I used to store header texts
                        //         }
                        //     },
                        //     columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
                        // }
                    }
                ],
                "createdRow": function (row, data, dataIndex) {
                   // console.log(data.paymentStatus)
                    if (data.paymentStatus == "จ่าย") {
                        $(row).addClass('green');
                    } else if (data.paymentStatus == "ไม่จ่าย") {
                        $(row).addClass('red');
                    }
                    else {
                        $(row).addClass('yellow');
                    }
                }
            });

            table.buttons().container().appendTo($('#test'));
        });
    });
}
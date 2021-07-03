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
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 10; _page++) {
                paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(async function (responseLog) {
                    var cnt_Log = responseLog.data.message.result.length;
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
                        //   document.getElementById("div_preloader").style.display = 'block'
                        await viewCost(refresh_token, _arr)


                        resolve(_arr);
                    } else {
                        if (n == 0 && _arr.length == 0) {
                            resolve(_arr)
                        }
                    }
                }).catch(function (res) {
                    const { response } = res
                });
            }
        });

    });

}

var cnt_Log;
var _cnt_Log;
var paramLog;
async function SearchLog(refresh_token, d) {
    if (d != undefined) {
        var co = 0;
        var _pagecount;
        var _total;
        //return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 1; _page++) {

                paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(async function (responseLog) {
                    cnt_Log = responseLog.data.message.result.length;
                    _total = responseLog.data.message.result;
                    //   console.log(responseLog.data.message.result)
                    if (_total > 1000) {
                        co = _total / 100
                        _pagecount = co;
                        for (_p = 1; _p <= _pagecount; _p++) {
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
                    } else {
                    }
                    //  await div_preloader()
                    //    document.getElementById("div_preloader").style.display = 'block'
                    await viewCost(_arrSearch)

                    n = 0;
                    _arrSearch = new Array()
                }).catch(function (res) {
                    const { response } = res
                });
            }
        });
        //});
    }


}

var _arrnewcost = new Array();
var c_search = '';
var n2 = 0;
var _sSearch = '';
var interval = null;
$(async function () {
    $('#cancel').on('click', function (e) {
        location.href = "visitorreportcost.html";
    });
    const result = await acctoken();
    $('#table1').DataTable().destroy();
    if (_sSearch != 'Search') {
        var responseLog = await getvisitorReportLog(result);
    }
    $('#SearchdateReportCost').on('click', async function (e) {
        document.getElementById("div_preloader").style.display = 'block'
        $('#table1').DataTable().destroy();
        //document.getElementById('table2').style.display = 'block'
        var _t = $('#table1').DataTable()
        _t.clear();
        _t.draw();
        n = 0;
        _sSearch = 'Search';
        _arrSearch = new Array()
        _arrnewcost == new Array()
        var startdate = document.getElementById("startdate").value.split('/'); /// 2 1 0
        var enddate = document.getElementById("enddate").value.split('/');
        var s = startdate[2] + startdate[1] + startdate[0];
        var e = enddate[2] + enddate[1] + enddate[0];
        var cc = parseInt(startdate[0]);
        var aa = parseInt(enddate[0]) + 1;
        var dd = aa - cc;
        var s_date;
        var re;
        for (i = 0; i < dd; i++) {
            s_date = startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')
            responseLog = await SearchLog(result, s_date);
            cc = cc + 1;
        }
        //await div_preloaderStop()
    });
});

async function myFunction(id) {
    var mytime = setInterval(function () {
        if (id != '') {
            div_preloader()
            id = ''
        } else {
            clearInterval(mytime)
            div_preloaderStop()
        }
    }, 1000);
    id = ''
}

async function div_preloader() {
    document.getElementById('div_preloader').style.display = 'block'
}
async function div_preloaderStop() {
    document.getElementById('div_preloader').style.display = 'none'
}

async function newCost(log, cnt_cost) {
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

async function viewCost(result, datalog) {
    _arrnewcost = new Array();
    n2 = 0;
    if (_arrSearch.length == 0) {
        datalog = _arr               ///// ของวันนี้ วันปัจจุบัน
    } else {
        datalog = _arrSearch   /////// ค้นหา
    }
    ////////////////////////////////////////////////////////////////////   เช็คชั่วโมง
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var paramcost = '_id=' + userId + '&_page=1&_limit=100'
        axios.get(urlipaddress + 'cost?' + paramcost, {
            headers: {
                'Authorization': result
            }
        }).then(async function (responsecost) {
            var cnt_cost = responsecost.data.message.result;
            for (i = 0; i < datalog.length; i++) {
                var Timein = datalog[i].recordTimeIn.split('-')
                var today = new Date();
                var date = today.getFullYear().toString();
                if (Timein[0] == date) {
                    var _costtime = await newCost(datalog[i], cnt_cost)
                    _arrnewcost[n2] = {
                        recordTimeIn: datalog[i].recordTimeIn,
                        recordTimeOut: datalog[i].recordTimeOut,
                        contactPlace: datalog[i].contactPlace,
                        visitorNumber: datalog[i].visitorNumber,
                        visitorType: datalog[i].visitorType,
                        costType: datalog[i].costType,
                        totalMinute: datalog[i].totalMinute,
                        totalMinute2: _costtime,
                        totalExpenses: datalog[i].totalExpenses,
                        paymentStatus: datalog[i].paymentStatus
                    }
                    n2 = n2 + 1

                }
            }
            $('#table1').DataTable().destroy();
            // document.getElementById("div_preloader").style.display = 'block'

            await viewdata_table(_arrnewcost)

        });
    });


}

async function viewdata_table(datacost) {
    var pre_data;
    $('#table1').DataTable().destroy();
    var table = $('#table1').DataTable({
        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
        "pageLength": 25,
        'data': datacost,
        "processing": true,
        "ordering": false,
        "bAutoWidth": false,
        "responsive": true,
        "autoWidth": false,
        'orderCellsTop': true,
        'fixedHeader': true,
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
            {
                data: "visitorNumber",
                render: function (data) {
                    myFunction(data)
                    return data
                }
            },
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
                total + ' บาท'
                //pageTotal + ' (' + ' ทั้งหมด ' + total + ')'
            );
            console.log(pageTotal)

            console.log(total)
            //  $('#total').text('Number(total).toFixed(8)');
            // $('#total').text('£' + Number(total).toFixed(8));
            // }
        },
        dom: 'lBfrtip',
        buttons: [
            {
                title: 'export',
                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                extend: 'excel',
                //  footer: false,
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                footer: true
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
}

async function viewdata_table2(datacost) {
    var pre_data;
    $('#table2').DataTable().destroy();
    var table = $('#table2').DataTable({
        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
        "pageLength": 25,
        'data': datacost,
        "processing": true,
        "ordering": false,
        "bAutoWidth": false,
        "responsive": true,
        "autoWidth": false,
        'orderCellsTop': true,
        'fixedHeader': true,
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
            {
                data: "visitorNumber",
                render: function (data) {
                    myFunction(data)
                    return data
                }
            },
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
            // $('#total').text('£' + Number(total).toFixed(8) + '(' + +')');
            $('#total').text('£' + Number(pageTotal).toFixed(8) + '(' + total + ')');
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
}
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
              //  console.log(response.data.message)

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
             //   console.log(_page)
                paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    cnt_Log = responseLog.data.message.result.length;
                    _total = responseLog.data.message.result;
                 //   console.log('ssssssssssssssssssssssssss')

                    if (_total > 1000) {
                        co = _total / 100
                        _pagecount = co;
                        for (_p = 1; _p <= _pagecount; _p++) {
                           // console.log('AAAAAAAAAAAAAAAAAAA')
                           // console.log(_pagecount + 1)
                            //console.log(_p)

                            _paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'

                            axios.get(urlipaddress + 'visitorLog?' + _paramLog, {
                                headers: {
                                    'Authorization': refresh_token
                                }
                            }).then(function (responseLogsearch) {
                                _cnt_Log = responseLogsearch.data.message.result.length;
                                if (_cnt_Log != 0) {
                                    for (i = 0; i < _cnt_Log; i++) {
                                        var _total = timeConvert(responseLogsearch.data.message.result[i].cost.totalMinute)
                                        if (responseLog.data.message.result[i].cost.costType != '') {
                                            var _payment = 'ไม่จ่าย'
                                            if (responseLog.data.message.result[i].cost.paymentStatus == 'Y') {
                                                _payment = 'จ่าย'
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
                                                totalExpenses: responseLog.data.message.result[i].cost.totalExpenses,
                                                paymentStatus: _payment,
                                            }
                                            n = n + 1
                                        }

                                    }

                                } else {
                                }
                            }).catch(function (res) {
                                const { responseLogsearch } = res
                            //    console.log(responseLogsearch.data)
                            });

                        }
                    }


                   // console.log(responseLog.data.message.result)
                    if (cnt_Log != 0) {
                        for (i = 0; i < cnt_Log; i++) {
                            var _total = timeConvert(responseLog.data.message.result[i].cost.totalMinute)
                            if (responseLog.data.message.result[i].cost.costType != '') {

                                var _payment = 'ไม่จ่าย'
                                if (responseLog.data.message.result[i].cost.paymentStatus == 'Y') {
                                    _payment = 'จ่าย'
                                }

                             //   console.log(responseLog.data.message.result[i])
                                _arrSearch[n] = {
                                    recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                                    recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                                    contactPlace: responseLog.data.message.result[i].contactPlace,
                                    visitorNumber: responseLog.data.message.result[i].visitorNumber,
                                    visitorType: responseLog.data.message.result[i].visitorType,
                                    costType: responseLog.data.message.result[i].cost.costType,
                                    totalMinute: _total,
                                    totalMinute2: responseLog.data.message.result[i].cost.totalMinute,
                                    totalExpenses: responseLog.data.message.result[i].cost.totalExpenses,
                                    paymentStatus: _payment,
                                }
                                n = n + 1
                            }
                        }

                      //  console.log(_arrSearch)



                        ////////////////////////////////////////////////////////////////////   เช็คชั่วโมง
                        var paramcost = '_id=' + userId + '&_page=1&_limit=100'
                        axios.get(urlipaddress + 'cost?' + paramcost, {
                            headers: {
                                'Authorization': result
                            }
                        }).then(function (responsecost) {
                            var cnt_cost = responsecost.data.message.result;
                          //  console.log(cnt_cost)
                            var costTime = '';
                            var _costtime = '';
                            for (i = 0; i < _arrSearch.length; i++) {
                                for (i2 = 0; i2 < cnt_cost.length; i2++) {
                                    if (_arrSearch[i].visitorType == cnt_cost[i2].visitorType && _arrSearch[i].costType == cnt_cost[i2].costType) {
                                        costTime = cnt_cost[i2].costTime
                                       // console.log(costTime)
                                        for (i3 = 0; i3 < costTime.length; i3++) {
                                           // console.log(_arrSearch[i].totalMinute2)
                                            if (parseInt(_arrSearch[i].totalMinute2) < parseInt(costTime[0])) {  /////ยังไม่ถึง 1 ชั่วโมง
                                            //    console.log(costTime[0])

                                                // _costtime = timeConvert(responseLog[i].totalMinute2)
                                                _costtime = timeConvert(0)
                                              //  console.log(_costtime)
                                                break;
                                            }

                                            if (parseInt(_arrSearch[i].totalMinute2) == parseInt(costTime[0])) {  /////ครบ 1 ชั่วโมง
                                          //      console.log(costTime[0])
                                                var _sum = parseInt(_arrSearch[i].totalMinute2) - parseInt(costTime[0])
                                                _costtime = timeConvert(_sum)
                                         //       console.log(_costtime)
                                                break;
                                            }

                                            if (parseInt(_arrSearch[i].totalMinute2) > parseInt(costTime[i3])) {  /////////////จอดเกิน 1 ชั่วโมง
                                        //        console.log(costTime[i3])
                                                var _sum = parseInt(_arrSearch[i].totalMinute2) - parseInt(costTime[i3])
                                                _costtime = timeConvert(_sum)

                                      //          console.log(_costtime)
                                                break;
                                            }
                                        }

                                        _arrnewcost[n2] = {
                                            recordTimeIn: _arrSearch[i].recordTimeIn,
                                            recordTimeOut: _arrSearch[i].recordTimeOut,
                                            contactPlace: _arrSearch[i].contactPlace,
                                            visitorNumber: _arrSearch[i].visitorNumber,
                                            visitorType: _arrSearch[i].visitorType,
                                            costType: _arrSearch[i].costType,
                                            totalMinute: _arrSearch[i].totalMinute,
                                            totalMinute2: _costtime,
                                            totalExpenses: _arrSearch[i].totalExpenses,
                                            paymentStatus: _arrSearch[i].paymentStatus
                                        }
                                        n2 = n2 + 1
                                    }

                                }
                            }
                         //   console.log(_arrnewcost)


                            var table = $('#table1').DataTable({
                                "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                                "pageLength": 25,
                                'data': _arrnewcost,
                                "ordering": false,
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
                                dom: 'lBfrtip',
                                buttons: [
                                    {
                                        title: 'export',
                                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                                        extend: 'excel',
                                        footer: false,
                                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
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
                            });
                        });
                        // return;
                    } else {

                    }

                }).catch(function (res) {
                    const { response } = res
                //    console.log(response.data)
                });
            }
        });
    }
}


var _arrnewcost = new Array();
var c_search = '';
var n2 = 0;
$(async function () {

    const result = await acctoken();
    // console.log('result')
   // console.log(result)


    var responseLog = await getvisitorReportLog(result);
    // console.log('responseLog')
//    console.log(responseLog)

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        $('#SearchdateReportCost').on('click', async function (e) {
            n = 0;
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
          //  console.log(dd);
            var s_date;
            var re;

            for (i = 0; i < dd; i++) {
                //  console.log(startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0'));
                s_date = startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')

              //  console.log(s_date);
                const result = await acctoken();
             //   console.log(result)
                responseLog = SearchLog(result, s_date);
                //  console.log('responseLog')
                //    console.log(responseLog)
                cc = cc + 1;
               // console.log('fffffff')

            }


        });

    });


});
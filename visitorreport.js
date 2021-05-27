//const userId = '5fe2c8a089d27d3818e4bcba'
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
//console.log(userId)
function acctoken() {

    // console.log('acctoken')
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
             //   console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}

function getvisitorType(refresh_token) {
    //console.log(refresh_token)
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
               // console.log(response.data)
            });
        });
    });
}

// function getvisitorReportLog(refresh_token) {

//   //  console.log('sassdsdsdsdsdsdsd')
//     var today = new Date();
//     const _m = (today.getMonth() + 1).toString().padStart(2, '0');
//     const _d = (today.getDate()).toString().padStart(2, '0');
//     var date = today.getFullYear().toString() + _m + _d;
//     var paramLog;
//     //var _page =2;

//     return new Promise(resolve => {
//         $.getScript("ip.js", function (data, textStatus, jqxhr) {
//             var urlipaddress = data.substring(1, data.length - 1);
//             for (_page = 1; _page <= 10; _page++) {

//                 // paramInfo = '_id=' + userId + '&_time=' + date + '&_before=true&_page=' + _page + '&_limit=10&_sort=-1&_type=all'
//                 paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=-1&_type=all'
//               //  console.log(paramLog)
//               //  console.log(refresh_token)
//                 axios.get(urlipaddress + 'visitorLog?' + paramLog, {
//                     headers: {
//                         'Authorization': refresh_token
//                     }
//                 }).then(function (responseLog) {
//                     var cnt_Log = responseLog.data.message.result.length;
//                     // console.log(cnt_Log)
//                     //   console.log(responseLog.data.message.result)
//                     if (cnt_Log != 0) {
//                       //  console.log('responseLog')
//                       //  console.log(responseLog.data.message.result)
//                         //  console.log(responseLog.data.message.result.length)
//                         for (i = 0; i < cnt_Log; i++) {
//                             // console.log(i)
//                             // console.log(responseLog.data.message.result[i].visitorNumber)
//                             if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
//                                 // console.log('sdsdsdsds')
//                             } else {
//                                 _arr[n] = {
//                                     visitorNumber: responseLog.data.message.result[i].visitorNumber,
//                                     visitorType: responseLog.data.message.result[i].visitorType,
//                                     citizenId: responseLog.data.message.result[i].citizenId,
//                                     name: responseLog.data.message.result[i].name,
//                                     licensePlate: responseLog.data.message.result[i].licensePlate,
//                                     vehicleType: responseLog.data.message.result[i].vehicleType,
//                                     contactPlace: responseLog.data.message.result[i].contactPlace,
//                                     recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
//                                     recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
//                                     etc: responseLog.data.message.result[i].etc,
//                                     image: responseLog.data.message.result[i].image1 + " " + responseLog.data.message.result[i].image2 + " " + responseLog.data.message.result[i].image3 + " " + responseLog.data.message.result[i].image4,
//                                     visitorId: responseLog.data.message.result[i].visitorId,
//                                     timestamp: responseLog.data.message.result[i].timestamp
//                                 }
//                                 n = n + 1
//                             }
//                         }
//                         // console.log(_arr)
//                         resolve(_arr);
//                     } else {
//                        // console.log(n)
//                       //  console.log(_arr)
//                         if (n == 0 && _arr.length == 0) {
//                             // n =0
//                       //      console.log(_arr)
//                             resolve(_arr)
//                         }
//                     }

//                 }).catch(function (res) {
//                     const { response } = res
//                     console.log(response.data)
//                 });
//             }
//         });

//     });

// }

// function getvisitorReportInfo(refresh_token) {  ////// เอา log มา add Array ต่อจาก Log
//    // console.log('Info')
//     var today = new Date();
//     const _m = (today.getMonth() + 1).toString().padStart(2, '0');
//     const _d = (today.getDate()).toString().padStart(2, '0');
//     var date = today.getFullYear().toString() + _m + _d;
//     var paramInfo;
//     return new Promise(resolve => {
//         $.getScript("ip.js", function (data, textStatus, jqxhr) {
//             var urlipaddress = data.substring(1, data.length - 1);
//             for (_page = 1; _page <= 10; _page++) {
//                 paramInfo = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=-1&_type=all'
//                 // paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=10&_sort=-1&_type=all'
//                 //console.log(paramLog)
//                 axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
//                     headers: {
//                         'Authorization': refresh_token
//                     }
//                 }).then(function (responseInfo) {
//                     var cnt_Log = responseInfo.data.message.result.length;
//                     if (cnt_Log != 0) {
//                         // console.log('visitorInfo')
//                         //console.log(responseInfo.data.message.result)
//                         //    console.log(responseInfo.data.message.result.length)
//                         for (i = 0; i < cnt_Log; i++) {
//                             // console.log(i)
//                             // console.log(responseLog.data.message.result[i].visitorNumber)
//                             if (responseInfo.data.message.result[i].visitorType == undefined && responseInfo.data.message.result[i].visitorNumber == undefined) {
//                                 // console.log('sdsdsdsds')
//                             } else {
//                                 _arr[n] = {
//                                     visitorNumber: responseInfo.data.message.result[i].visitorNumber,
//                                     visitorType: responseInfo.data.message.result[i].visitorType,
//                                     citizenId: responseInfo.data.message.result[i].citizenId,
//                                     name: responseInfo.data.message.result[i].name,
//                                     licensePlate: responseInfo.data.message.result[i].licensePlate,
//                                     vehicleType: responseInfo.data.message.result[i].vehicleType,
//                                     contactPlace: responseInfo.data.message.result[i].contactPlace,
//                                     recordTimeIn: responseInfo.data.message.result[i].recordTimeIn,
//                                     recordTimeOut: responseInfo.data.message.result[i].recordTimeOut,
//                                     etc: responseInfo.data.message.result[i].etc,
//                                     image: responseInfo.data.message.result[i].image1 + " " + responseInfo.data.message.result[i].image2 + " " + responseInfo.data.message.result[i].image3 + " " + responseInfo.data.message.result[i].image4,
//                                     visitorId: responseInfo.data.message.result[i].visitorId,
//                                     timestamp: responseInfo.data.message.result[i].timestamp
//                                 }
//                                 n = n + 1
//                             }
//                         }
//                         //     console.log(_arr)
//                         resolve(_arr);
//                     }

//                 }).catch(function (res) {
//                     const { response } = res
//                     console.log(response.data)
//                 });
//             }
//         });

//     });

// }


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
                // paramInfo = '_id=' + userId + '&_time=' + date + '&_before=true&_page=' + _page + '&_limit=10&_sort=-1&_type=all'
                paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                //  console.log(paramLog)
                //  console.log(refresh_token)
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    var cnt_Log = responseLog.data.message.result.length;
                    //  console.log(cnt_Log)
                    //   console.log(responseLog.data.message.result)
                    if (cnt_Log != 0) {
                        //  console.log('responseLog')
                        //  console.log(responseLog.data.message.result)
                        //  console.log(responseLog.data.message.result.length)
                        for (i = 0; i < cnt_Log; i++) {
                            // console.log(i)
                            // console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {
                                var Timein = responseLog.data.message.result[i].recordTimeIn.split('-')

                                var today = new Date();
                                const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const _d = (today.getDate()).toString().padStart(2, '0');
                                var date = today.getFullYear().toString();
                            //    console.log(Timein[0])
                                if (Timein[0] == date) {   //////ปีปัจจุบัน
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
                        }
                        // console.log(_arr)
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
                  //  console.log(response.data)
                });
            }
        });

    });

}

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
                paramInfo = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                // paramLog = '_id=' + userId + '&_time=' + date + '&_before=false&_page=' + _page + '&_limit=10&_sort=-1&_type=all'
                //console.log(paramLog)
                axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseInfo) {
                    var cnt_Log = responseInfo.data.message.result.length;
                    if (cnt_Log != 0) {
                        // console.log('visitorInfo')
                        //console.log(responseInfo.data.message.result)
                        //    console.log(responseInfo.data.message.result.length)
                        for (i = 0; i < cnt_Log; i++) {
                            // console.log(i)
                            // console.log(responseLog.data.message.result[i].visitorNumber)
                            if (responseInfo.data.message.result[i].visitorType == undefined && responseInfo.data.message.result[i].visitorNumber == undefined) {
                                // console.log('sdsdsdsds')
                            } else {


                                var Timein = responseInfo.data.message.result[i].recordTimeIn.split('-')

                                var today = new Date();
                                const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const _d = (today.getDate()).toString().padStart(2, '0');
                                var date = today.getFullYear().toString();
                              //  console.log(Timein[0])
                                if (Timein[0] == date) {   //////ปีปัจจุบัน
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
                        }
                        //console.log(_arr)
                        resolve(_arr);
                    } else {
                        resolve(_arr);
                    }

                }).catch(function (res) {
                    const { response } = res
                    //console.log(response.data)
                });
            }
        });

    });

}


//////////////////////////////////////////////////////ชนิดรถ
function getvehicleType(refresh_token) {
  //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'vehicleType/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.vehicleType);

            }).catch(function (res) {
                const { response } = res
                //console.log(response.data)
            });
        });
    });
}



$(async function () {

    const result = await acctoken();
    // console.log('result')
   // console.log(result)

    const responsevisitorType = await getvisitorType(result);

    const responsevehicleType = await getvehicleType(result);   ///////  ชนิดรถ
    //console.log(responsevehicleType)



    const responseLog = await getvisitorReportLog(result);
    // console.log('responseLog')
    // console.log(responseLog)


    const responseReport = await getvisitorReportInfo(result);
   // console.log('responseReport')
   // console.log(responseReport)








    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var _arrvisitorType = new Array();
        var cnt = responsevisitorType.length;


        var _arrvehicleType = new Array();
        var cnt_vehicleType = responsevehicleType.length;



        var n = 0;
        var _num = 1;
        for (i = 0; i < cnt; i++) {
            _arrvisitorType[n] = {
                num: _num,
                visitorType: responsevisitorType[i],
                charge: ""
            }
            n = n + 1
            _num = _num + 1;
        }

        n = 0;
        _num = 1;
        for (i = 0; i < cnt_vehicleType; i++) {  /////ชนิดรถ
            _arrvehicleType[n] = {
                num: _num,
                vehicleType: responsevehicleType[i],
            }
            n = n + 1
            _num = _num + 1;
        }


        var header = [];
        header.push("เลข visitor");
        header.push("ประเภท");
        header.push("เวลาเข้า");
        header.push("เวลาออก");
        header.push("ทะเบียนรถ");
        header.push("ชนิดของรถ");
        header.push("สถานที่ติดต่อ");
        header.push("เลขประจำตัว");
        header.push("ชื่อ-สกุล");
        header.push("อื่นๆ");
        header.push("");






        var table = $('#table1').DataTable({
            "lengthMenu": [[25, 50, 100], [25, 50, 100]],
            "pageLength": 25,
            'data': [...responseReport],
            "ordering": false,
            "responsive": true,
            "autoWidth": false,
            orderCellsTop: true,
            fixedHeader: true,
            "order": [],
            columns: [
                // { data: "num" },
                { data: "visitorNumber" },
                { data: "visitorType" },
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
                { data: "licensePlate" },
                { data: "vehicleType" },
                { data: "contactPlace" },
                { data: "citizenId", },
                { data: "name", },
                { data: "etc" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="view_img" style="font-size:16px;color:blue; cursor: pointer;">รูปภาพ </i>'
                },
            ],
            dom: 'lBfrtip',
            buttons: [
                {
                    title: 'export',
                    text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                    extend: 'excel',
                    footer: false,
                    exportOptions: {
                        format: {
                            header: function (data, column, row) {
                                return header[column]; //header is the array I used to store header texts
                            }
                        },
                        columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                    }
                }

            ],
            initComplete: function () {
                ///////////////เลข visitor
                this.api().columns(0).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><br/>")
                    $('<input type="text" class="form-control" style=" width: 80px ;" placeholder="ค้นหา" />')
                        .appendTo($(column.header()))
                        .on('keyup change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .column(0)
                                .search(this.value)
                                .draw();
                        });
                });


                //////////////////// ประเภท Visitor  ไปเอามาจาก
                this.api().columns(1).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><p></p>")
                    var select = $('<select style=" width: 80px ;"><option>ทั้งหมด</option></select>')
                        .appendTo($(column.header()))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()

                            );
                            //   console.log(val.toString().replace("",''))
                            //   console.log(val.length)
                            if (val == 'ทั้งหมด') {
                                val = '';
                            }
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });

                    $.each(_arrvisitorType, function (key, value) {
                        select.append('<option value=' + value.visitorType + '>' + value.visitorType + '</option>');
                    });
                });
                ///////////////เวลาเข้า
                this.api().columns(2).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><br/>")
                    var select = $('<input type="text" class="form-control" style=" width: 100px ;" placeholder="ค้นหา" />')
                        .appendTo($(column.header()))
                        .on('keyup change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .column(2)
                                .search(this.value)
                                .draw();
                        });
                });

                ///////////////เวลาออก
                this.api().columns(3).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><br/>")
                    var select = $('<input type="text" class="form-control" style=" width: 100px ;" placeholder="ค้นหา" />')
                        .appendTo($(column.header()))
                        .on('keyup change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .column(3)
                                .search(this.value)
                                .draw();
                        });
                });
                ///////////////ค้นหาทะเบียนรถ
                this.api().columns(4).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><br/>")
                    var select = $('<input type="text" class="form-control" style=" width: 100px ;" placeholder="ค้นหา" />')
                        .appendTo($(column.header()))
                        .on('keyup change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .column(4)
                                .search(this.value)
                                .draw();
                        });
                });
                /////////////// ชนิดของรถ

                this.api().columns(5).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><p></p>")
                    var select = $('<select style=" width: 100px ;"><option>ทั้งหมด</option></select>')
                        .appendTo($(column.header()))
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()

                            );

                            if (val == 'ทั้งหมด') {
                                val = '';
                            }
                            column
                                .search(val ? '^' + val + '$' : '', true, false)
                                .draw();
                        });

                    $.each(_arrvehicleType, function (key, value) {
                        select.append('<option value=' + value.vehicleType + '>' + value.vehicleType + '</option>');
                    });
                });




                ///////////////สถานที่ติดต่อ
                this.api().columns(6).every(function () {
                    var column = this;
                    $(column.header()).append("<br/><br/>")
                    var select = $('<input type="text" class="form-control" style=" width: 100px ;" placeholder="ค้นหา" />')
                        .appendTo($(column.header()))
                        .on('keyup change', function () {
                            var val = $.fn.dataTable.util.escapeRegex(
                                $(this).val()
                            );
                            column
                                .column(6)
                                .search(this.value)
                                .draw();
                        });
                });

            }




        });



        table.buttons().container().appendTo($('#test'));
        //  table.page.len( -1 ).draw();
        //console.log(table.page.len(46).draw(false))
        //  table.page(50).draw(false);

        $('#table1').on('click', 'tbody td i.view_img', function (e) {
            var table = $('#table1').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            var data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }
            $("#myModal").modal();
            $("#viewImage").empty();

            //console.log(data.image)
            var img = data.image.split(' ');
            // console.log(img[0])

            for (let i in img) {
                //  console.log(img[i])
                if (img[i] != '') {
                    axios.get(urlipaddress + "view/images/" + img[i], {
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': result
                        }
                    }).then(function (response) {
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                        var mimetype = "image/png"; // or whatever your image mime type is
                        $("#viewImage").append(`<img name="${b64encoded}" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail">`);
                    });

                }
            }
        });
    });

});
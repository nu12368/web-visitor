var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arrSearch = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;
function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
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

var cnt_Log;
//const datt = async (aa) => {
const getvisitorReportLogSearch = async (refresh_token, d) => {
    // console.log('getvisitorReportLogSearch' + d)
    if (d != undefined) {
        var paramLog;
        var co = 0;
        var _pagecount;
        var _total;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 1; _page++) {
                //  console.log(_page)
                paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                //  console.log(paramLog)
                axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseLog) {
                    cnt_Log = responseLog.data.message.result.length;
                    _total = responseLog.data.message.result;
                    // console.log('ssssssssssssssssssssssssss')

                    if (_total > 1000) {
                        co = _total / 100
                        _pagecount = co;
                        for (_p = 1; _p <= _pagecount; _p++) {
                            //     console.log('AAAAAAAAAAAAAAAAAAA')
                            //   console.log(_pagecount + 1)
                            //   console.log(_p)

                            _paramLog = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _p + '&_limit=100&_sort=1&_type=all'

                            axios.get(urlipaddress + 'visitorLog?' + paramLog, {
                                headers: {
                                    'Authorization': refresh_token
                                }
                            }).then(function (responseLogsearch) {
                                cnt_Log = responseLogsearch.data.message.result.length;
                                if (cnt_Log != 0) {
                                    for (i = 0; i < cnt_Log; i++) {
                                        if (responseLogsearch.data.message.result[i].visitorType == undefined && responseLogsearch.data.message.result[i].visitorNumber == undefined) {

                                        } else {

                                            var Timein = responseLogsearch.data.message.result[i].recordTimeIn.split('-')

                                            var today = new Date();
                                            const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                            const _d = (today.getDate()).toString().padStart(2, '0');
                                            var date = today.getFullYear().toString();
                                            //    console.log(Timein[0])

                                            if (Timein[0] == date) {   //////ปีปัจจุบัน
                                                _arrSearch[n] = {
                                                    visitorNumber: responseLogsearch.data.message.result[i].visitorNumber,
                                                    visitorType: responseLogsearch.data.message.result[i].visitorType,
                                                    citizenId: responseLogsearch.data.message.result[i].citizenId,
                                                    name: responseLogsearch.data.message.result[i].name,
                                                    licensePlate: responseLogsearch.data.message.result[i].licensePlate,
                                                    vehicleType: responseLogsearch.data.message.result[i].vehicleType,
                                                    contactPlace: responseLogsearch.data.message.result[i].contactPlace,
                                                    recordTimeIn: responseLogsearch.data.message.result[i].recordTimeIn,
                                                    recordTimeOut: responseLogsearch.data.message.result[i].recordTimeOut,
                                                    etc: responseLogsearch.data.message.result[i].etc,
                                                    image: responseLogsearch.data.message.result[i].image1 + " " + responseLogsearch.data.message.result[i].image2 + " " + responseLogsearch.data.message.result[i].image3 + " " + responseLogsearch.data.message.result[i].image4,
                                                    visitorId: responseLogsearch.data.message.result[i].visitorId,
                                                    timestamp: responseLogsearch.data.message.result[i].timestamp
                                                }
                                                n = n + 1
                                            }


                                        }
                                    }
                                } else {
                                }
                            }).catch(function (res) {
                                const { responseLogsearch } = res
                                // console.log(responseLogsearch.data)
                            });

                        }
                    }

                    //  console.log(responseLog.data.message.result)

                    if (cnt_Log != 0) {
                        for (i = 0; i < cnt_Log; i++) {
                            if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
                            } else {
                                var Timein = responseLog.data.message.result[i].recordTimeIn.split('-')
                                var today = new Date();
                                const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const _d = (today.getDate()).toString().padStart(2, '0');
                                var date = today.getFullYear().toString();
                                // console.log(Timein[0])
                                if (Timein[0] == date) {   //////ปีปัจจุบัน
                                    _arrSearch[n] = {
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
//console.log(n)
                      //  console.log(_arrSearch)

                    } else {

                    }
                }).catch(function (res) {
                    const { response } = res
                    // console.log(response.data)
                });
            }
        });
    }
}

var table;
var cnt_InfoDate
async function getvisitorReportInfoSearch(refresh_token, d) {  ////// เอา log มา add Array ต่อจาก Log
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
    //  console.log(_arrSearch.length)
    // n = _arrSearch.length
    //  console.log(n)
    if (d != undefined) {
        var paramInfo;
        var co = 0;
        var _pagecount;
        var _total;
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            for (_page = 1; _page <= 1; _page++) {
                //10.0.0.205:4004/visitorInfo?_id=5fe2c8a089d27d3818e4bcba&_time=20210202&_before=false&_page=1&_limit=2&_sort=-1&_type=all
                paramInfo = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _page + '&_limit=100&_sort=1&_type=all'
                //  console.log(paramInfo)
                axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function (responseInfo) {
                    cnt_InfoDate = responseInfo.data.message.result.length;
                    //    console.log(cnt_InfoDate)
                    _total = responseInfo.data.message.result.data;
                    //   console.log(responseInfo.data.message.result)
                    // _total = 2000


                    if (_total > 1000) {  /////////////// มากกว่า 1000
                        co = _total / 100
                        _pagecount = co;

                        for (_p = 1; _p <= _pagecount; _p++) {
                            // console.log('AAAAAAAvisitorInfoAAAAAAAAAAAA')
                            // console.log(_pagecount + 1)
                            // console.log(_p)

                            paramInfo = '_id=' + userId + '&_time=' + d + '&_before=false&_page=' + _p + '&_limit=100&_sort=1&_type=all'

                            axios.get(urlipaddress + 'visitorInfo?' + paramInfo, {
                                headers: {
                                    'Authorization': refresh_token
                                }
                            }).then(function (responseInfosearch) {
                                cnt_InfoDate = responseInfosearch.data.message.result.length;
                                if (cnt_InfoDate != 0) {
                                    for (i = 0; i < cnt_InfoDate; i++) {
                                        if (responseInfosearch.data.message.result[i].visitorType == undefined && responseInfosearch.data.message.result[i].visitorNumber == undefined) {
                                        } else {


                                            var Timein = responseInfosearch.data.message.result[i].recordTimeIn.split('-')

                                            var today = new Date();
                                            const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                            const _d = (today.getDate()).toString().padStart(2, '0');
                                            var date = today.getFullYear().toString();
                                            // console.log(Timein[0])
                                            if (Timein[0] == date) {   //////ปีปัจจุบัน

                                                _arrSearch[n] = {
                                                    visitorNumber: responseInfosearch.data.message.result[i].visitorNumber,
                                                    visitorType: responseInfosearch.data.message.result[i].visitorType,
                                                    citizenId: responseInfosearch.data.message.result[i].citizenId,
                                                    name: responseInfosearch.data.message.result[i].name,
                                                    licensePlate: responseInfosearch.data.message.result[i].licensePlate,
                                                    vehicleType: responseInfosearch.data.message.result[i].vehicleType,
                                                    contactPlace: responseInfosearch.data.message.result[i].contactPlace,
                                                    recordTimeIn: responseInfosearch.data.message.result[i].recordTimeIn,
                                                    recordTimeOut: responseInfosearch.data.message.result[i].recordTimeOut,
                                                    etc: responseInfosearch.data.message.result[i].etc,
                                                    image: responseInfosearch.data.message.result[i].image1 + " " + responseInfosearch.data.message.result[i].image2 + " " + responseInfosearch.data.message.result[i].image3 + " " + responseInfosearch.data.message.result[i].image4,
                                                    visitorId: responseInfosearch.data.message.result[i].visitorId,
                                                    timestamp: responseInfosearch.data.message.result[i].timestamp
                                                }
                                                n = n + 1

                                            }

                                        }
                                    }
                                } else {

                                }
                            }).catch(function (res) {
                                const { responseLogsearch } = res
                                //     console.log(responseLogsearch.data)
                            });

                        }
                    }
                    //     console.log(responseInfo.data.message.result)
                    if (cnt_InfoDate != 0) {  /////// กรณี ไม่มากกว่า 1000 เข้าทำงานปกติ
                        for (i = 0; i < cnt_InfoDate; i++) {
                            if (responseInfo.data.message.result[i].visitorType == undefined && responseInfo.data.message.result[i].visitorNumber == undefined) {

                            } else {
                              //  console.log(_arrSearch)
                                // console.log(responseInfo.data.message.result[i].recordTimeIn)
                                var Timein = responseInfo.data.message.result[i].recordTimeIn.split('-')
                                var today = new Date();
                                const _m = (today.getMonth() + 1).toString().padStart(2, '0');
                                const _d = (today.getDate()).toString().padStart(2, '0');
                                var date = today.getFullYear().toString();
                                //   console.log(Timein[0])
                                if (Timein[0] == date) {   //////ปีปัจจุบัน
                                    //    console.log(date)
                                    _arrSearch[n] = {
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
                    }

                    $('#table1').DataTable().destroy();
                 //   console.log([..._arrSearch])

                    $.getScript("ip.js", function (data, textStatus, jqxhr) {
                        var urlipaddress = data.substring(1, data.length - 1);
                        $('#table1').DataTable().destroy();
                        table = $('#table1').DataTable({
                            "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                            "pageLength": 25,
                            'data': [..._arrSearch],
                            "ordering": false,
                            "responsive": true,
                            "autoWidth": false,
                            orderCellsTop: true,
                            fixedHeader: true,
                            "order": [],
                            columns: [
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
                                this.api().columns(0).every(function () {
                                    var that = this;
                                    $('input', this.header()).on('keyup change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        that
                                            .column(0)
                                            .search(this.value)
                                            .draw();
                                    });
                                });

                                this.api().columns(1).every(function () {
                                    var that = this;
                                    $('select', this.header()).on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        if (val == 'ทั้งหมด') {
                                            val = '';
                                        }
                                        that
                                            .column(1)
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });
                                });

                                this.api().columns(2).every(function () {
                                    var that = this;
                                    $('input', this.header()).on('keyup change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        that
                                            .column(2)
                                            .search(this.value)
                                            .draw();
                                    });
                                });

                                this.api().columns(3).every(function () {
                                    var that = this;
                                    $('input', this.header()).on('keyup change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        that
                                            .column(3)
                                            .search(this.value)
                                            .draw();
                                    });
                                });

                                this.api().columns(4).every(function () {
                                    var that = this;
                                    $('input', this.header()).on('keyup change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        that
                                            .column(4)
                                            .search(this.value)
                                            .draw();
                                    });
                                });


                                this.api().columns(5).every(function () {
                                    var that = this;
                                    $('select', this.header()).on('change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        if (val == 'ทั้งหมด') {
                                            val = '';
                                        }
                                        that
                                            .column(5)
                                            .search(val ? '^' + val + '$' : '', true, false)
                                            .draw();
                                    });
                                });



                                this.api().columns(6).every(function () {
                                    var that = this;
                                    $('input', this.header()).on('keyup change', function () {
                                        var val = $.fn.dataTable.util.escapeRegex(
                                            $(this).val()
                                        );
                                        that
                                            .column(6)
                                            .search(this.value)
                                            .draw();
                                    });
                                });
                            },

                        });




                        table.buttons().container().appendTo($('#test'));
                        //  table.page.len( -1 ).draw();
                        //console.log(table.page.len(46).draw(false))
                        //  table.page(50).draw(false);


                        // var otable = $('#table1').DataTable();

                        // // Apply the search
                        // otable.columns(0).every(function () {
                        //     var that = this;
                        //     $('input', this.header()).on('keyup change', function () {
                        //         if (that.search() !== this.value) {
                        //             that
                        //                 .column(0)
                        //                 .search(this.value)
                        //                 .draw();
                        //         }
                        //     });
                        // });






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
                                        $("#viewImage").append(`<img name="${b64encoded}" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);
                                    });

                                }
                            }

                        });
                    });


                }).catch(function (res) {
                    const { response } = res
                    //     console.log(response.data)
                });
            }
        });

        //});
    }
}

const datt = async (aa) => {
    const result = await acctoken();
    // console.log('aaaaaaaaaaaaaaaaaaa');
    // console.log(aa);
    const url = `http://10.0.0.205:4004/visitorInfo?_id=5fe2c8a089d27d3818e4bcba&_time=${aa}&_before=false&_page=1&_limit=1&_sort=-1&_type=all`;

    try {
        const id = await axios.get(url, {
            headers: {
                'Authorization': result
            }
        });
        //  console.log(id.data.message)
    } catch (error) {
        //  console.log(error)
    }
};

var c_search = '';
$(async function () {
    $('#cancel').on('click', function (e) {
        location.href = "visitorreport.html";
    });

    $('#Searchdate').on('click', async function (e) {

        // datt()
        // let d = 20210202;
        // for (let i = 0; i < 2; i++) {
        //     datt(d+i);
        //     console.log(d)
        // }
        // return;

        n = 0;
        c_search = 'search'
        _arrSearch = new Array()

        var startdate = document.getElementById("startdate").value.split('/'); /// 2 1 0
        var enddate = document.getElementById("enddate").value.split('/');

        var s = startdate[2] + startdate[1] + startdate[0];
        var e = enddate[2] + enddate[1] + enddate[0];

        var cc = parseInt(startdate[0]);
        var aa = parseInt(enddate[0]) + 1;

        var dd = aa - cc;
        var s_date;

        for (i = 0; i < dd; i++) {
        //    console.log(startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0'));
            s_date = startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')

            const result = await acctoken();
            var responseLog = getvisitorReportLogSearch(result, s_date);
            //var responseinfo = getvisitorReportInfoSearch(result, s_date);
            cc = cc + 1;
        }

        cc = parseInt(startdate[0]);
        aa = parseInt(enddate[0]) + 1;

        dd = aa - cc;
        s_date = '';

        for (i = 0; i < dd; i++) {
            s_date = startdate[2] + startdate[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')
            //console.log(s_date)
            const result = await acctoken();
            var responseinfo = getvisitorReportInfoSearch(result, s_date);

            cc = cc + 1;
        }
    });
    // });
});
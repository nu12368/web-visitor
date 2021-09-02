var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');

var date_click;
var arr_getprop = new Array()
var arr_bookingCancel = new Array()
var arr_time = new Array();
var databookingPropId;
var _i_loop_newdate = 0;
var arr_prpo = new Array()
var arr_booking = new Array()
var _i_loop_booking = 0;
var arr_datesearch = new Array()
var day_view = new Array()
var _arrusername = new Array()

function acctoken() {
    var obj = JSON.parse(Cookies.get('datatoken'));
    var userId = Cookies.get('datauserId');
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function(response) {
                resolve(response.data.message.access_token);

            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                }
            });
        });
    });
}

async function getProp(refresh_token) {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'getProp/' + userId, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.result)
            for (const i in response.data.message.result) {
                arr_prpo[i] = {
                    category: response.data.message.result[i].category
                }
            }

        }).catch(function(res) {
            const { response } = res
        });
    });
}
async function dateToday() {
    var n_today = new Date();
    var n_date = n_today.toISOString();
    let date = new Date(n_date);
    let options = { hour12: false };
    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
    chk_date = chk_date.split(' ')
    const thisTime = dayjs(chk_date, "DD-MM-YYYY HH:mm")

    return thisTime
}

function convert(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("/");
}

async function getbookingCancelloop(refresh_token, _page, bookingCancelDate) {
    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        if (bookingCancelDate == '') {
            prm = '?bookingCancelDate=' + gettime.replace('/', '').replace('/', '') + '&'
            _i_loop_booking = 0
        } else {
            prm = '?bookingCancelDate=' + bookingCancelDate + '&'
        }
        axios.get(urlipaddress + 'logBookingCancel/' + userId + prm + '&_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function(response) {
            for (i = 0; i < response.data.message.result.length; i++) {
                await getuser_member(response.data.message.result[i].bookingCancelData.bookingPersonId, refresh_token)
                var add;
                var h;
                var pho;
                if (_arrusername.length == 0) {
                    add = '', h = '', pho = ''
                } else {
                    if (_arrusername[0].houseNo == undefined) {
                        h = ''
                    } else {
                        h = _arrusername[0].houseNo
                    }
                    add = _arrusername[0].address
                    pho = _arrusername[0].phone
                }
                arr_bookingCancel[_i_loop_newdate] = {
                    bookingDate: response.data.message.result[i].bookingCancelData.bookingDate,
                    bookingId: response.data.message.result[i].bookingCancelData.bookingId,
                    bookingPersonId: response.data.message.result[i].bookingCancelData.bookingPersonId,
                    cancelBookingPersonId: response.data.message.result[i].bookingCancelData.cancelBookingPersonId,
                    category: response.data.message.result[i].bookingCancelData.category,
                    description: response.data.message.result[i].bookingCancelData.description,
                    reasonForCancellation: response.data.message.result[i].bookingCancelData.reasonForCancellation,
                    registrationDate: response.data.message.result[i].bookingCancelData.registrationDate,
                    status: 'ยกเลิก',
                    timeOfBooking: response.data.message.result[i].bookingCancelData.timeOfBooking + ' น.',
                    bookingCancelDate: response.data.message.result[i].bookingCancelDate,
                    bookingCancelId: response.data.message.result[i].bookingCancelId,
                    _address: add,
                    _houseNo: h,
                    _phone: pho,

                }
                _i_loop_newdate = _i_loop_newdate + 1
            }
        }).catch(function(res) {
            const { response } = res
        });
    });

}
async function getbookingCancel(refresh_token, bookingCancelDate) {
    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            if (bookingCancelDate == '') {
                prm = '?bookingCancelDate=' + gettime.replace('/', '').replace('/', '') + '&'
                _i_loop_booking = 0
            } else {
                prm = '?bookingCancelDate=' + bookingCancelDate + '&'
            }
            axios.get(urlipaddress + 'logBookingCancel/' + userId + prm + '&_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function(response) {
                console.log(response.data.message.result)
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 100)
                var _page = 1;
                _i_loop_newdate = 0
                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        console.log(i)
                        getbookingCancelloop(refresh_token, _page, '');
                        _page = _page + 1
                    }
                    resolve(arr_bookingCancel)
                } else {
                    for (i = 0; i < response.data.message.result.length; i++) {
                        await getuser_member(response.data.message.result[i].bookingCancelData.bookingPersonId, refresh_token)
                        console.log(_arrusername)
                        var add;
                        var h;
                        var pho;
                        if (_arrusername.length == 0) {
                            add = '', h = '', pho = ''
                        } else {
                            if (_arrusername[0].houseNo == undefined) {
                                h = ''
                            } else {
                                h = _arrusername[0].houseNo
                            }
                            add = _arrusername[0].address
                            pho = _arrusername[0].phone
                        }

                        arr_bookingCancel[_i_loop_newdate] = {
                            bookingDate: response.data.message.result[i].bookingCancelData.bookingDate,
                            bookingId: response.data.message.result[i].bookingCancelData.bookingId,
                            bookingPersonId: response.data.message.result[i].bookingCancelData.bookingPersonId,
                            cancelBookingPersonId: response.data.message.result[i].bookingCancelData.cancelBookingPersonId,
                            category: response.data.message.result[i].bookingCancelData.category,
                            description: response.data.message.result[i].bookingCancelData.description,
                            reasonForCancellation: response.data.message.result[i].bookingCancelData.reasonForCancellation,
                            registrationDate: response.data.message.result[i].bookingCancelData.registrationDate,
                            status: 'ยกเลิก',
                            timeOfBooking: response.data.message.result[i].bookingCancelData.timeOfBooking + ' น.',
                            bookingCancelDate: response.data.message.result[i].bookingCancelDate,
                            bookingCancelId: response.data.message.result[i].bookingCancelId,
                            _address: add,
                            _houseNo: h,
                            _phone: pho,
                        }
                        _i_loop_newdate = _i_loop_newdate + 1
                    }
                    resolve(arr_bookingCancel)
                }
            }).catch(function(res) {
                const { response } = res
            });
        });
    });
}

async function getbookingloop(refresh_token, _page, bookingDate) {
    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        if (bookingDate == '') {
            prm = '?bookingDate=' + gettime.replace('/', '').replace('/', '') + '&'
            _i_loop_booking = 0
        } else {
            prm = '?bookingDate=' + bookingDate + '&'
        }
        axios.get(urlipaddress + 'booking/' + userId + prm + '?_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function(response) {
            for (i = 0; i < response.data.message.result.length; i++) {
                const interDiff = response.data.message.result[i].interDiff
                var number = 1
                for (let f in interDiff) {
                    if (interDiff[f].status !== 'blank') {
                        if (interDiff[f].registrationDate != undefined) {
                            let date = new Date(interDiff[f].registrationDate);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

                            await getuser_member(interDiff[f].bookingPersonId, refresh_token)
                            console.log(_arrusername)
                            var add;
                            var h;
                            var pho;
                            if (_arrusername.length == 0) {
                                add = '', h = '', pho = ''
                            } else {
                                if (_arrusername[0].houseNo == undefined) {
                                    h = ''
                                } else {
                                    h = _arrusername[0].houseNo
                                }
                                add = _arrusername[0].address
                                pho = _arrusername[0].phone
                            }
                            arr_booking[_i_loop_booking] = {
                                num: number,
                                category: response.data.message.result[i].category,
                                timeOfBooking: f + ' น.',
                                status: 'จองแล้ว',
                                description: interDiff[f].description,
                                registrationDate: interDiff[f].registrationDate,
                                _address: add,
                                _houseNo: h,
                                _phone: pho,
                                bookingDate: response.data.message.result[i].bookingDate
                            }
                            _i_loop_booking = _i_loop_booking + 1
                            number = number + 1
                        }
                    }
                }
            }

        }).catch(function(res) {
            const { response } = res
        });
    });


}
async function getbooking(refresh_token, bookingDate) {

    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            if (bookingDate == '') {
                prm = '?bookingDate=' + gettime.replace('/', '').replace('/', '') + '&'
                _i_loop_booking = 0
            } else {
                prm = '?bookingDate=' + bookingDate + '&'
            }
            axios.get(urlipaddress + 'booking/' + userId + prm + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function(response) {
                console.log(response.data.message.result)
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 100)
                var _page = 1;

                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        console.log(i)
                        getbookingloop(refresh_token, _page, '');
                        _page = _page + 1
                    }
                    resolve(arr_booking)
                } else {
                    for (i = 0; i < response.data.message.result.length; i++) {
                        const interDiff = response.data.message.result[i].interDiff
                        var number = 1
                        for (let f in interDiff) {
                            if (interDiff[f].status !== 'blank') {
                                if (interDiff[f].registrationDate != undefined) {
                                    let date = new Date(interDiff[f].registrationDate);
                                    let options = { hour12: false };
                                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                    await getuser_member(interDiff[f].bookingPersonId, refresh_token)
                                    var add;
                                    var h;
                                    var pho;
                                    if (_arrusername.length == 0) {
                                        add = '', h = '', pho = ''
                                    } else {
                                        if (_arrusername[0].houseNo == undefined) {
                                            h = ''
                                        } else {
                                            h = _arrusername[0].houseNo
                                        }
                                        add = _arrusername[0].address
                                        pho = _arrusername[0].phone
                                    }
                                    arr_booking[_i_loop_booking] = {
                                        num: number,
                                        category: response.data.message.result[i].category,
                                        timeOfBooking: f + ' น.',
                                        status: 'จองแล้ว',
                                        description: interDiff[f].description,
                                        registrationDate: interDiff[f].registrationDate,
                                        _address: add,
                                        _houseNo: h,
                                        _phone: pho,
                                        bookingDate: response.data.message.result[i].bookingDate
                                    }
                                    _i_loop_booking = _i_loop_booking + 1
                                    number = number + 1
                                }
                            }
                        }
                    }
                    console.log(arr_booking)
                    resolve(arr_booking)
                }
            }).catch(function(res) {
                const { response } = res
            });
        });
    });
}

async function dateSearch() {
    var _sp = $("#daterangebooking").val().replace(' ', '').replace(' ', '').split('-')
    var Startvaldate_sp = _sp[0].split('/')
    var Endvaldate_sp = _sp[1].split('/')
    var d_gmt = new Date(Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + " GMT");
    var lastDayOfMonth = new Date(d_gmt.getFullYear(), d_gmt.getMonth() + 1, 0); /////วันสุดท้ายของเดือน
    var sp_last = convert(lastDayOfMonth).split('/');
    var cnt_betaween = parseInt(Endvaldate_sp[1]) - parseInt(Startvaldate_sp[1]) //วันสิ้นสุด - วันเริ่มต้น 
    var s_d = parseInt(Startvaldate_sp[1]);
    var cnt = 0;
    var loop_month = ''
    if (parseInt(Endvaldate_sp[0]) > parseInt(Startvaldate_sp[0])) { /////เลือก ข้ามเดือน
        cnt_betaween = parseInt(sp_last[2]) + parseInt(Endvaldate_sp[1]) ///// วันสุดท้ายของเดือน + กับวัน ของเดือนถัดไป
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + s_d.toString().padStart(2, '0')
                cnt = parseInt(s_d)
            } else {
                if (cnt > sp_last[2]) {
                    cnt = 1;
                    loop_month = 'newmonth'
                    day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                } else {
                    if (loop_month == '') {
                        day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + cnt.toString().padStart(2, '0')
                    } else {
                        if (parseInt(Endvaldate_sp[1]) == cnt) {
                            day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                            break
                        }
                        day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                    }
                }
            }
            cnt = cnt + 1
        }
    } else {
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + s_d.toString().padStart(2, '0')
                cnt = parseInt(s_d)
            } else {

                if (cnt == sp_last[2]) {
                    cnt = 1;

                } else {
                    day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + cnt.toString().padStart(2, '0')
                }
            }
            cnt = cnt + 1
        }
    }

    // arr_datesearch[0] = Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + ' ' + '00:00' + ':00'
    // arr_datesearch[1] = Endvaldate_sp[2] + '/' + Endvaldate_sp[0] + '/' + Endvaldate_sp[1] + ' ' + '23:59' + ':59'

    // console.log(day_view)
    //console.log(arr_datesearch)
    return day_view
}
async function dateSearch_Cancel() {
    var _sp = $("#daterange").val().replace(' ', '').replace(' ', '').split('-')
    var Startvaldate_sp = _sp[0].split('/')
    var Endvaldate_sp = _sp[1].split('/')
    var d_gmt = new Date(Startvaldate_sp[2] + '/' + Startvaldate_sp[0] + '/' + Startvaldate_sp[1] + " GMT");
    var lastDayOfMonth = new Date(d_gmt.getFullYear(), d_gmt.getMonth() + 1, 0); /////วันสุดท้ายของเดือน
    var sp_last = convert(lastDayOfMonth).split('/');
    var cnt_betaween = parseInt(Endvaldate_sp[1]) - parseInt(Startvaldate_sp[1]) //วันสิ้นสุด - วันเริ่มต้น 
    var s_d = parseInt(Startvaldate_sp[1]);
    var cnt = 0;
    var loop_month = ''
    if (parseInt(Endvaldate_sp[0]) > parseInt(Startvaldate_sp[0])) { /////เลือก ข้ามเดือน
        cnt_betaween = parseInt(sp_last[2]) + parseInt(Endvaldate_sp[1]) ///// วันสุดท้ายของเดือน + กับวัน ของเดือนถัดไป
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + s_d.toString().padStart(2, '0')
                cnt = parseInt(s_d)
            } else {
                if (cnt > sp_last[2]) {
                    cnt = 1;
                    loop_month = 'newmonth'
                    day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                } else {
                    if (loop_month == '') {
                        day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + cnt.toString().padStart(2, '0')
                    } else {
                        if (parseInt(Endvaldate_sp[1]) == cnt) {
                            day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                            break
                        }
                        day_view[i] = Startvaldate_sp[2] + Endvaldate_sp[0] + cnt.toString().padStart(2, '0')
                    }
                }
            }
            cnt = cnt + 1
        }
    } else {
        for (i = 0; i < cnt_betaween + 1; i++) { //// วนลูป จำนวนวันเริ่มต้น - วันสิ้นสุด เดือนเดียวกัน
            if (i == 0) {
                day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + s_d.toString().padStart(2, '0')
                cnt = parseInt(s_d)
            } else {

                if (cnt == sp_last[2]) {
                    cnt = 1;

                } else {
                    day_view[i] = Startvaldate_sp[2] + Startvaldate_sp[0] + cnt.toString().padStart(2, '0')
                }
            }
            cnt = cnt + 1
        }
    }
    return day_view
}

async function viewTable_booking(booking_report) {
    $('#tbl_booking_report').DataTable().destroy();
    var header = [];
    header.push("รายการ");
    header.push("วันที่จอง");
    header.push("ช่วงเวลาที่จอง");
    header.push("รายละเอียด");
    header.push("เบอร์โทร");
    header.push("บ้านเลขที่");
    header.push("ที่อยู่");
    header.push("วันที่บันทึก");
    header.push("สถานะ");
    //////////////////////////////// รายการจอง
    $('#tbl_booking_report').DataTable().destroy();
    var tablebooking = $('#tbl_booking_report').DataTable({
        "lengthMenu": [
            [25, 50, 100],
            [25, 50, 100]
        ],
        "pageLength": 25,
        'data': booking_report,
        "ordering": false,
        "responsive": true,
        "autoWidth": false,
        orderCellsTop: true,
        fixedHeader: true,
        "order": [],
        columns: [
            { data: "category" },
            {
                data: "bookingDate",
                render: function(data) {
                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substr(0, 4);
                }
            },
            { data: "timeOfBooking" },
            { data: "description" },
            { data: "_phone" },
            { data: "_houseNo" },
            { data: "_address" },
            {
                data: "registrationDate",
                render: function(data) {

                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substr(0, 4);
                }
            },
            { data: "status" },

        ],
        dom: 'lBfrtip',
        buttons: [{
            title: 'export',
            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            extend: 'excel',
            footer: false,
            exportOptions: {
                format: {
                    header: function(data, column, row) {
                        return header[column]; //header is the array I used to store header texts
                    }
                },
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8]
            }
        }],
        initComplete: function() {
            //////////////////// รายการ
            //if (day_view.length == 0) {
            this.api().columns(0).every(function() {
                var column = this;
                $(column.header()).empty()
                $(column.header()).append("<br/><p></p>")
                    // $(select).empty()
                var select = $('<select style=" width: 150px ;"><option>รายการทั้งหมด</option></select>')
                    .appendTo($(column.header()))
                    .on('change', function() {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        console.log(val)
                        val = val.replace(';', ' ')
                        console.log(val)
                        if (val == 'รายการทั้งหมด') {
                            val = '';
                        }
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                $.each(arr_prpo, function(key, value) {

                    select.append('<option value=' + value.category.replace(' ', ';') + '>' + value.category + '</option>');
                });
            });
            // }
        }
    });
    tablebooking.buttons().container().appendTo($('#test1'));

}

async function viewTable_booking_cancel(databookingcancel_report) {
    var headercancel = [];
    headercancel.push("รายการ");
    headercancel.push("วันที่จอง");
    headercancel.push("ช่วงเวลาที่จอง");
    headercancel.push("รายละเอียด");
    headercancel.push("เหตุผลที่ยกเลิก");
    headercancel.push("เบอร์โทร");
    headercancel.push("บ้านเลขที่");
    headercancel.push("ที่อยู่");

    headercancel.push("วันที่บันทึก");
    headercancel.push("วันที่ยกเลิก");
    headercancel.push("สถานะ");

    ////////////////////////////////รายการ ยกเลิก
    $('#tbl_booking_reportcancel').DataTable().destroy();
    var table = $('#tbl_booking_reportcancel').DataTable({
        "lengthMenu": [
            [25, 50, 100],
            [25, 50, 100]
        ],
        "pageLength": 25,
        'data': databookingcancel_report,
        "ordering": false,
        "responsive": true,
        "autoWidth": false,
        orderCellsTop: true,
        fixedHeader: true,
        "order": [],
        columns: [
            { data: "category" },
            {
                data: "bookingDate",
                render: function(data) {
                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substr(0, 4);
                }
            },
            { data: "timeOfBooking" },
            { data: "description" },
            { data: "reasonForCancellation" },
            { data: "_phone" },
            { data: "_houseNo" },
            { data: "_address" },
            {
                data: "registrationDate",
                render: function(data) {

                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substr(0, 4);
                }
            },
            {
                data: "bookingCancelDate",
                render: function(data) {

                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].substr(0, 4);
                }
            },
            { data: "status" },

        ],
        dom: 'lBfrtip',
        buttons: [{
                title: 'export',
                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                extend: 'excel',
                footer: false,
                exportOptions: {
                    format: {
                        header: function(data, column, row) {
                            return headercancel[column]; //header is the array I used to store header texts
                        }
                    },
                    columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                }
            }

        ],
        initComplete: function() {
            //////////////////// รายการ
            this.api().columns(0).every(function() {
                var column = this;
                $(column.header()).empty()
                $(column.header()).append("<br/><p></p>")
                var select = $('<select style=" width: 150px ;"><option>รายการทั้งหมด</option></select>')
                    .appendTo($(column.header()))
                    .on('change', function() {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );
                        console.log(val)
                        val = val.replace(';', ' ')
                        if (val == 'รายการทั้งหมด') {
                            val = '';
                        }
                        column
                            .search(val ? '^' + val + '$' : '', true, false)
                            .draw();
                    });

                $.each(arr_prpo, function(key, value) {
                    console.log(value.category)
                    select.append('<option value=' + value.category.replace(' ', ';') + '>' + value.category + '</option>');
                });
            });
        }
    });
    table.buttons().container().appendTo($('#test'));


}
$(async function() {
    const result = await acctoken();
    await getProp(result)

    var databookingcancel = await getbookingCancel(result, '')
    console.log(databookingcancel)
    var booking_report = await getbooking(result, '')
    console.log(booking_report)

    await viewTable_booking(booking_report)
    await viewTable_booking_cancel(databookingcancel)

    /////////////////////////////////// รายงานการจอง
    $('#submitbookingReport').on('click', async function(e) {
        document.getElementById('btn_cancelbooking').style.display = 'block'
        document.getElementById('div_preloader').style.display = 'block'
        $('#tbl_booking_report').DataTable().destroy();
        day_view = new Array()
        arr_booking = new Array()
        _i_loop_booking = 0
        var datetimesearch = await dateSearch()
        booking_report = ''
        console.log(datetimesearch)
        for (const i in datetimesearch) {
            console.log(datetimesearch[i])
            booking_report = await getbooking(result, datetimesearch[i])
        }
        await viewTable_booking(booking_report)
        document.getElementById('div_preloader').style.display = 'none'
    });


    /////////////////////////////// รายงานการยกเลิก
    $('#submitbookingReportDatetimeCancel').on('click', async function(e) {
        document.getElementById('btn_cancel').style.display = 'block'
        document.getElementById('div_preloader_cancel').style.display = 'block'
        $('#tbl_booking_reportcancel').DataTable().destroy();
        day_view = new Array()
        arr_bookingCancel = new Array()
        _i_loop_newdate = 0
        var datetimesearch = await dateSearch_Cancel()
        databookingcancel = ''
        console.log(datetimesearch)
        for (const i in datetimesearch) {
            console.log(datetimesearch[i])
            databookingcancel = await getbookingCancel(result, datetimesearch[i])
        }
        await viewTable_booking_cancel(databookingcancel)
        document.getElementById('div_preloader_cancel').style.display = 'none'
    });

});

async function getuser_member(userid_member, access_token) {
    const dataUserID = {
            userId: userId
        }
        //  return new Promise(resolve => {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': access_token
            }
        }).then(function(response) {
            var cnt = response.data.message.data.length;
            for (i = 0; i < cnt; i++) {
                if (response.data.message.data[i].userId == userid_member) {
                    _arrusername[0] = response.data.message.data[i]
                    return
                }
            }
        });
    });
    //});

}
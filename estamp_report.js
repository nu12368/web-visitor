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
var number = 1

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

async function getestamploop(refresh_token, _page, timeEstamp) {
    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        if (timeEstamp == '') {
            prm = '?timeEstamp=' + gettime.replace('/', '').replace('/', '') + '&'
            _i_loop_booking = 0
        } else {
            prm = '?timeEstamp=' + timeEstamp + '&'
        }
        axios.get(urlipaddress + 'estamp/' + userId + prm + '?_page=1&_limit=100&_sort=1', {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function(response) {
            for (i = 0; i < response.data.message.result.length; i++) {
                arr_booking[_i_loop_booking] = {
                    num: number,
                    visitorNumber: response.data.message.result[i].visitorNumber,
                    houseNumber: response.data.message.result[i].houseNumber,
                    estampStatus: response.data.message.result[i].estampStatus,
                    timeEstamp: response.data.message.result[i].timeEstamp,

                }
                _i_loop_booking = _i_loop_booking + 1
                number = number + 1
            }

        }).catch(function(res) {
            const { response } = res
        });
    });


}
async function getestamp(refresh_token, timeEstamp) {

    var thistime = await dateToday()
    var gettime = convert(thistime)
    var prm;
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            if (timeEstamp == '') {
                prm = '?timeEstamp=' + gettime.replace('/', '').replace('/', '') + '&'
                _i_loop_booking = 0
            } else {
                prm = '?timeEstamp=' + timeEstamp + '&'
            }
            axios.get(urlipaddress + 'estamp/' + userId + prm + '?_page=1&_limit=100&_sort=1', {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function(response) {
                console.log(response.data.message)
                var totle = response.data.message.total
                var looptotle = Math.ceil(totle / 100)
                var _page = 1;

                if (looptotle > 1) { ///// คิวมากกว่า loop 100
                    for (i = 0; i < looptotle; i++) {
                        console.log(i)
                        getestamploop(refresh_token, _page, '');
                        _page = _page + 1
                    }
                    console.log(arr_booking)
                    resolve(arr_booking)
                } else {
                    for (i = 0; i < response.data.message.result.length; i++) {
                        arr_booking[_i_loop_booking] = {
                            num: number,
                            visitorNumber: response.data.message.result[i].visitorNumber,
                            houseNumber: response.data.message.result[i].houseNumber,
                            estampStatus: response.data.message.result[i].estampStatus,
                            timeEstamp: response.data.message.result[i].timeEstamp,

                        }
                        _i_loop_booking = _i_loop_booking + 1
                        number = number + 1
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


async function viewTable_estamp(data_estamp) {

    $('#tbl_estamp_report').DataTable().destroy();
    var tablebooking = $('#tbl_estamp_report').DataTable({
        "lengthMenu": [
            [25, 50, 100],
            [25, 50, 100]
        ],
        "pageLength": 25,
        'data': data_estamp,
        "ordering": false,
        "responsive": true,
        "autoWidth": false,
        orderCellsTop: true,
        fixedHeader: true,
        "order": [],
        columns: [
            { data: "visitorNumber" },
            { data: "houseNumber" },
            { data: "estampStatus" },
            {
                data: "timeEstamp",
                render: function(data) {
                    let date = new Date(data);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                        return '-';
                    }
                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
                }
            },



        ],
        dom: 'lBfrtip',
        buttons: [{
            title: 'export',
            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
            extend: 'excel',
            footer: false,
            exportOptions: {

                columns: [0, 1, 2, 3]
            }
        }],
        "createdRow": function(row, data, dataIndex) {
            console.log(data)
            if (data.estampStatus == "มา") {
                $('td:eq(2)', row).addClass('blue');
            }
            if (data.estampStatus == "พบ") {
                $('td:eq(2)', row).addClass('green');
            }
            // console.log(data.approve)
            // if (data.approve == "รออนุมัติ") {
            //     $(row).addClass('yellow');
            // }
        }
    });
    tablebooking.buttons().container().appendTo($('#test1'));

}


$(async function() {
    const result = await acctoken();
    var dataestampl = await getestamp(result, '')
    console.log(dataestampl)



    await viewTable_estamp(dataestampl)

    /////////////////////////////////// รายงานการจอง
    $('#submitbookingReport').on('click', async function(e) {
        document.getElementById('btn_cancelbooking').style.display = 'block'
        document.getElementById('div_preloader').style.display = 'block'
        $('#tbl_estamp_report').DataTable().destroy();
        day_view = new Array()
        arr_booking = new Array()
        _i_loop_booking = 0
        var datetimesearch = await dateSearch()
        booking_report = ''
        console.log(datetimesearch)
        for (const i in datetimesearch) {
            console.log(datetimesearch[i])
            booking_report = await getestamp(result, datetimesearch[i])
        }
        await viewTable_estamp(booking_report)
        document.getElementById('div_preloader').style.display = 'none'
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
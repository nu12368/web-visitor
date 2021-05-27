//const userId = '5fe2c8a089d27d3818e4bcba'
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
console.log(userId)

var datamember;
datamember = Cookies.get('datamemberID');
if (datamember != undefined) {
    datamember = JSON.parse(datamember)

} else {
    datamember = Cookies.get('datamember');
    datamember = JSON.parse(datamember)

}

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

const getvisitorappointment = async (refresh_token, page) => {
    // console.log(refresh_token)
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId + '?uId=' + datamember.userId + '&_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'meeting/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            if (response.data.message.result.length != 0) {
                $("#div_reportappointment").text(response.data.message.result.length + " รายการ");
                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                response.data.message.result.sort(compareByDate);
                const reversed = response.data.message.result.reverse()

                console.log(reversed)

                /////////////////////////////////// ค้นหา นัดหมาย
                if (document.getElementById('startdate').value != '') {
                    var startdate = document.getElementById('startdate').value.split('/')
                    var _date = startdate[2] + '/' + startdate[1] + '/' + startdate[0]
                    // console.log(_date)
                    var _arrsearch = new Array();
                    var num_search = 0;
                    for (i = 0; i < reversed.length; i++) {


                        let date = new Date(reversed[i].daysToCome);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]

                        s_date = s_date.split(' ')
                        s_date = s_date[0].split('/')

                        var datenew = s_date[2] + '/' + s_date[0] + '/' + s_date[1]
                        // console.log(_date)
                        console.log(datenew)
                        //  console.log(dayjs('2011/01/30').isSame(dayjs('2011/01/30')))
                        //  console.log(dayjs('2011-01-30').isSame(dayjs('2011-01-30')))
                        var checkdate = dayjs(_date).isSame(dayjs(datenew))


                        if (checkdate == true) {
                            _arrsearch[num_search] = {
                                daysToCome: reversed[i].daysToCome,
                                licensePlate: reversed[i].licensePlate,
                                meetUpLocal: reversed[i].meetUpLocal,
                                meetingId: reversed[i].meetingId,
                                name: reversed[i].name,
                                registerDate: reversed[i].registerDate,
                                status: reversed[i].status,
                                uId: reversed[i].uId
                            }
                            num_search = num_search + 1;
                        }

                    }


                    const toDatesearch = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDatesearch = (x, y) => toDatesearch(y.registerDate) - toDatesearch(x.registerDate);
                    _arrsearch.sort(compareByDatesearch);
                    const reversedsearch = _arrsearch.reverse()
                    console.log(reversedsearch)

                    $('#tableappointment').DataTable().destroy();

                    var table = $('#tableappointment').DataTable({
                        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                        "pageLength": 25,
                        'data': [...reversedsearch],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "meetUpLocal" },
                            { data: "name" },
                            { data: "licensePlate" },
                            { data: "status" },
                            {
                                data: "daysToCome",
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
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">แก้ไข </i> / <i href="" class="delete_appointment" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
                            }
                        ],

                        dom: 'lBfrtip',
                        buttons: [
                            {
                                title: 'export',
                                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                                extend: 'excel',
                                footer: false,
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 4]
                                }
                            }
                        ],
                        "createdRow": function (row, data, dataIndex) {
                            if (data.status == "นัด") {
                                $(row).addClass('yellow');
                            } else if (data.status == "ไม่พบ" || data.status == "ยกเลิก") {
                                $(row).addClass('red');
                            }
                            else {
                                $(row).addClass('green');
                            }
                        }
                    });
                    table.buttons().container().appendTo($('#test'));
                }


                else {

                    var table = $('#tableappointment').DataTable({
                        "lengthMenu": [[25, 50, 100], [25, 50, 100]],
                        "pageLength": 25,
                        'data': [...reversed],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "meetUpLocal" },
                            { data: "name" },
                            { data: "licensePlate" },
                            { data: "status" },
                            {
                                data: "daysToCome",
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
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">แก้ไข </i> / <i href="" class="delete_appointment" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
                            }
                        ],

                        dom: 'lBfrtip',
                        buttons: [
                            {
                                title: 'export',
                                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                                extend: 'excel',
                                footer: false,
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 4]
                                }
                            }
                        ],
                        "createdRow": function (row, data, dataIndex) {
                            if (data.status == "นัด") {
                                $(row).addClass('yellow');
                            } else if (data.status == "ไม่พบ" || data.status == "ยกเลิก") {
                                $(row).addClass('red');
                            }
                            else {
                                $(row).addClass('green');
                            }
                        }
                    });
                    table.buttons().container().appendTo($('#test'));


                }



            }



        }).catch(function (res) {
            const { response } = res
        });
    });

}

const getuserappointment = async (refresh_token) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const dataUserID = {
            userId: userId
        }
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            //   console.log(response.data.message.data)
            var cnt = response.data.message.data.length;
            var n = 0;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {
                if (response.data.message.data[i].rule == "member") {
                    _arr[n] = {
                        houseNo: response.data.message.data[i].houseNo,
                        memberId: response.data.message.data[i].userId + "@" + response.data.message.data[i].phone
                    }
                    n = n + 1
                }
            }
            //  console.log(_arr)
            var $select = $('#houseNo');
            $select.find('option').remove();
            $select.append('<option value=' + 0 + '>' + '-- เลือกบ้านเลขที่ --' + '</option>');
            for (i = 0; i < _arr.length; i++) {
                $select.append('<option value=' + _arr[i].memberId + '>' + _arr[i].houseNo + '</option>');
            }
        });
    });
}

$(async function () {

    const result = await acctoken();
    for (let i = 1; i < 10; i++) {
        await getvisitorappointment(result, i)

    }

    getuserappointment(result)



    $('#searchappointment').on('click', async function (e) {
        if (document.getElementById('startdate').value == '') {
            showCancelMessagesearchappointment('กรุณาเลือกวันที่','')

            return;
        }
        for (let i = 1; i < 10; i++) {
            await getvisitorappointment(result, i)

        }
    });


    function showCancelMessagesearchappointment(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function (isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }

    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        $('#submitappointment').on('click', function (e) {
            var timedaysToCome = document.getElementById('daysToCome').value.split('/');
            var s_time = document.getElementById('txtdaysToCome').value;
            //var strdaysToCome = new Date(timedaysToCome[2] + '-' + timedaysToCome[1] + '-' + timedaysToCome[0] + ' ' + s_time + ':' + '00').toISOString();
            var strdaysToCome = new Date(`${timedaysToCome[2] + '-' + timedaysToCome[1] + '-' + timedaysToCome[0]}T${s_time}:00`).toISOString()

            var memberId;
            var datamember = Cookies.get('datamember');
            if (datamember != undefined) {
                datamember = JSON.parse(datamember)

                memberId = datamember.userId
            } else {
                var _houseNoID = document.getElementById("houseNo").value.split('@')
                memberId = _houseNoID[0]
            }
            console.log(memberId)
            console.log(userId)
            const datameeting = {
                userId: userId,
                uId: memberId,
                name: document.getElementById("name").value,
                meetUpLocal: document.getElementById("meetUpLocal").value,
                daysToCome: strdaysToCome,
                licensePlate: document.getElementById("licensePlate").value,
                status: 'นัด'

            }

            document.getElementById("save").innerText = ''
            axios.post(urlipaddress + 'meeting', datameeting, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                console.log(response.data.message)

                if (response.data.message == 'add meeting completed') {
                    showSuccessMessage('สำเร็จ', 'บันทึกข้อมูลสำเร็จ', 'appointment.html')
                    // document.getElementById("save").innerText = 'บันทึกสำเร็จ'
                    // document.getElementById("save").style.color = 'green'
                }
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message, '')

            });
        });



        function showCancelMessage(title, text) {
            swal({
                title: title,
                text: text,
                type: "error",
            }, function (isConfirm) {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            });
        }

        function showSuccessMessage(title, text, page) {
            swal({
                title: title,
                text: text,
                type: "success",
            }, function (isConfirm) {
                if (isConfirm) {
                    location.href = page;
                }
            });
        }



        var _data;
        $('#tableappointment').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            $("#myModaledit").modal();
            var table = $('#tableappointment').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            _data = _ro.data();
            if (_data == undefined) {
                _data = table.row(this).data();
            }
            console.log(_data)

            document.getElementById("name").value = _data.name
            document.getElementById("meetUpLocal").value = _data.meetUpLocal
            document.getElementById("licensePlate").value = _data.licensePlate

            let date = new Date(_data.daysToCome);
            let options = { hour12: false };
            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

            var _day = sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
            _day = _day.split(' ')
            document.getElementById('daysToCome').value = _day[0]
            document.getElementById('txtdaysToCome').value = _day[1]

            document.getElementById("status").value = _data.status

            document.getElementById("updateappointment").disabled = false;


            if (_data.status == 'พบ') {
                document.getElementById("updateappointment").disabled = true;

            }

        });


        $('#updateappointment').on('click', function (e) {
            var timedaysToCome = document.getElementById('daysToCome').value.split('/');
            //  var s_time = document.getElementById('txtdaysToCome').value;
            var s_time = document.getElementById('txtdaysToCome').value.replace(' ', '');
            s_time = s_time.substring(0, 5);
            var strdaysToCome = new Date(`${timedaysToCome[2] + '-' + timedaysToCome[1] + '-' + timedaysToCome[0]}T${s_time}:00`).toISOString()

            //var strdaysToCome = new Date(timedaysToCome[2] + '-' + timedaysToCome[1] + '-' + timedaysToCome[0] + ' ' + s_time + ':' + '00').toISOString();

            const datameeting = {
                userId: userId,
                meetingId: _data.meetingId,
                name: document.getElementById("name").value,
                meetUpLocal: document.getElementById("meetUpLocal").value,
                daysToCome: strdaysToCome,
                licensePlate: document.getElementById("licensePlate").value,
                status: document.getElementById("status").value
            }
            axios.put(urlipaddress + 'meeting', datameeting, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                console.log(response.data.message.data)
                if (response.data.message.data == 'update completed') {
                    showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ', 'reportappointment.html')
                    // document.getElementById("update").innerText = 'อัพเดทสำเร็จ'
                    // location.href = "reportappointment.html";

                }

            }).catch(function (res) {
                const { response } = res
                //    console.log(response.data.message)
                showCancelMessage(response.data.message, '')
                // document.getElementById("update").innerText = response.data.message.data;
            });
        });

        $('#tableappointment').on('click', 'i.delete_appointment', function (e) {
            e.preventDefault();
            var table = $('#tableappointment').DataTable();
            var _ro = table.row($(this).parents('tr'));
            _data = _ro.data();
            if (_data == undefined) {
                _data = table.row(this).data();
            }
            $("#myModaldelete").modal();
            $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

        });
        $('#Deleteappointment').on('click', function (e) {
            const datanew = {
                userId: userId,
                meetingId: _data.meetingId
            }
            $.getScript("ip.js", function (data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                axios({
                    url: urlipaddress + 'meeting',
                    method: 'delete',
                    data: datanew,
                    headers: { 'Authorization': result }
                }).then(function (response) {
                    if (response.data.message == "delete completed") {
                        //  console.log(response.data.message)
                        $("#myModaldelete").empty()
                        showSuccessMessage('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'reportappointment.html')
                    }
                }).catch(function (res) {
                    const { response } = res
                });
            });
        });

    });




});
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var _arrusername = new Array()
var n = 0;
console.log(userId)
var datamember = Cookies.get('datamember');
if (datamember != undefined) {
    datamember = JSON.parse(datamember)
} else {
    datamember = Cookies.get('datamemberID');
    datamember = JSON.parse(datamember)
}
console.log(datamember)

function acctoken() {
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            // console.log('aaaaaaaaaaaaaa')
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function(response) {
                resolve(response.data.message.access_token);

            }).catch(function(res) {
                const { response } = res
                if (response.data.message == "Unauthorized") {
                    location.href = "index.html";
                }
            });
        });
    });
}

const getserviecOpen = async(refresh_token, page, _type) => {

    const dataUserID = {
        userId: userId
    }
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        //http://10.0.0.205:4004/ticket/605aaff01e8e0873c0a5956c?uId=605ab0261e8e0873c0a59570&type=appeal&status=Open%20OR%20In%20Progress&_page=1&_limit=100&_sort=1
        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function(response) {
            console.log(response.data.message.result)

            if (response.data.message.result.length != 0) {
                if (datamember.rule == 'member') {
                    var _arr = new Array();
                    var n = 0;
                    var _status = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        _arr[n] = {
                            ticketId: response.data.message.result[i].ticketId,
                            title: response.data.message.result[i].title,
                            priority: response.data.message.result[i].priority,
                            status: response.data.message.result[i].status,
                            registerDate: response.data.message.result[i].registerDate,
                            _houseNo: '',
                            _phone: '',
                            _username: '',
                            gps: response.data.message.result[i].gps
                        }
                        n = n + 1;
                    }

                    const toDate = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                    _arr.sort(compareByDate);
                    const reversed = _arr.reverse()
                    var tablemember = $('#table1_open').DataTable({
                        "lengthMenu": [
                            [25, 50, 100],
                            [25, 50, 100]
                        ],
                        "pageLength": 25,
                        'data': [..._arr],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "title" },
                            { data: "priority" },
                            { data: "status" },
                            {
                                data: "registerDate",
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
                            { data: "_username", 'visible': false },
                            { data: "_houseNo", 'visible': false },
                            { data: "_phone", 'visible': false },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_service" style="font-size:14px;color:blue; cursor: pointer;">??????????????? </i> / <i href="" class="delete_service" style="font-size:14px;color:red; cursor: pointer;">?????? </i>'
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="chat_service" style="font-size:14px;color:blue; cursor: pointer;">?????????????????????????????? </i> '
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href=""  class="i_map" style="font-size:14px;color:blue; cursor: pointer;">????????????????????? </i> '
                            },

                        ],
                        "createdRow": function(row, data, dataIndex) {
                            console.log(data.priority)
                            if (data.priority == "low") {
                                $('td:eq(1)', row).addClass('green');
                                // $(row['priority']).eq(2).addClass('green');

                            } else if (data.priority == "high") {

                                $('td:eq(1)', row).addClass('red');
                            } else {

                                $('td:eq(1)', row).addClass('yellow');
                            }
                        }
                    });



                } else {
                    ///////////////// ?????????????????????????????????
                    var _arr_dataticket = new Array()
                    var _number = 0
                    const toDate = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                    response.data.message.result.sort(compareByDate);
                    const reversed = response.data.message.result.reverse()
                        //   var xxx = await getuser_member(reversed[i_view].uId, refresh_token)
                        // console.log(xxx)

                    axios.post(urlipaddress + 'user', dataUserID, {
                        headers: {
                            'Authorization': refresh_token
                        }
                    }).then(async function(responseuser) {
                        var cnt = responseuser.data.message.data.length;
                        for (i_view = 0; i_view < reversed.length; i_view++) {
                            for (i = 0; i < cnt; i++) {
                                if (responseuser.data.message.data[i].userId == reversed[i_view].uId) {
                                    _arrusername[0] = responseuser.data.message.data[i]
                                    _arr_dataticket[_number] = {
                                        ticketId: reversed[i_view].ticketId,
                                        title: reversed[i_view].title,
                                        priority: reversed[i_view].priority,
                                        status: reversed[i_view].status,
                                        registerDate: reversed[i_view].registerDate,
                                        _houseNo: _arrusername[0].houseNo,
                                        _phone: _arrusername[0].phone,
                                        _username: _arrusername[0].username,
                                        gps: reversed[i_view].gps
                                    }
                                    _number = _number + 1;
                                }
                            }
                        }
                        // $('#table1_open').DataTable().destroy()
                        var table = $('#table1_open').DataTable({
                            "lengthMenu": [
                                [25, 50, 100],
                                [25, 50, 100]
                            ],
                            "pageLength": 25,
                            'data': [..._arr_dataticket],
                            "ordering": false,
                            "responsive": true,
                            "autoWidth": false,
                            orderCellsTop: true,
                            fixedHeader: true,
                            "order": [],
                            columns: [{
                                    data: "title",
                                },
                                { data: "priority" },
                                { data: "status" },
                                {
                                    data: "registerDate",
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
                                { data: "_username" },
                                { data: "_houseNo" },
                                { data: "_phone" },
                                {
                                    data: null,
                                    className: "center",
                                    defaultContent: '<i href="" class="edit_service" style="font-size:14px;color:blue; cursor: pointer;">??????????????? </i> / <i href="" class="delete_service" style="font-size:14px;color:red; cursor: pointer;">?????? </i>'
                                },
                                {
                                    data: null,
                                    className: "center",
                                    defaultContent: '<i href="" class="chat_service" style="font-size:14px;color:blue; cursor: pointer;">?????????????????????????????? </i> '
                                },
                                {
                                    data: null,
                                    className: "center",
                                    defaultContent: '<i href=""  class="i_map" style="font-size:14px;color:blue; cursor: pointer;">????????????????????? </i> '
                                },

                            ],

                            dom: 'lBfrtip',
                            buttons: [{
                                title: 'export',
                                text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                                extend: 'excel',
                                footer: false,
                                exportOptions: {
                                    columns: [0, 1, 2, 3, 4, 5, 6]
                                }
                            }],
                            "createdRow": function(row, data, dataIndex) {
                                console.log(data.priority)
                                if (data.priority == "low") {
                                    $('td:eq(1)', row).addClass('green');
                                    // $(row['priority']).eq(2).addClass('green');

                                } else if (data.priority == "high") {

                                    $('td:eq(1)', row).addClass('red');
                                } else {

                                    $('td:eq(1)', row).addClass('yellow');
                                }
                            }
                        });
                        table.buttons().container().appendTo($('#test'));
                    });
                }


                console.log(_arr_dataticket)

            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}

const getserviecResolved = async(refresh_token, page, _type) => {
    const dataUserID = {
        userId: userId
    }
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        //http://10.0.0.205:4004/ticket/605aaff01e8e0873c0a5956c?uId=605ab0261e8e0873c0a59570&type=appeal&status=Open%20OR%20In%20Progress&_page=1&_limit=100&_sort=1
        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Resolved&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            if (response.data.message.result.length != 0) {
                if (datamember.rule == 'member') {
                    var _arr = new Array();
                    var n = 0;
                    var _status = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        _arr[n] = {
                            ticketId: response.data.message.result[i].ticketId,
                            title: response.data.message.result[i].title,
                            priority: response.data.message.result[i].priority,
                            status: response.data.message.result[i].status,
                            registerDate: response.data.message.result[i].registerDate,
                            _houseNo: '',
                            _phone: '',
                            _username: '',
                            gps: response.data.message.result[i].gps
                        }
                        n = n + 1;
                    }

                    //  $("#div_supplies").text(_arr.length + " ??????????????????");

                    const toDate = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                    _arr.sort(compareByDate);
                    const reversed = _arr.reverse()
                    var table = $('#table1_resolved').DataTable({
                        "lengthMenu": [
                            [25, 50, 100],
                            [25, 50, 100]
                        ],
                        "pageLength": 25,
                        'data': [..._arr],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "title" },

                            { data: "priority" },
                            { data: "status" },
                            {
                                data: "registerDate",
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
                            { data: "_username", 'visible': false },
                            { data: "_houseNo", 'visible': false },
                            { data: "_phone", 'visible': false },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_service" style="font-size:14px;color:blue; cursor: pointer;">??????????????? </i> / <i href="" class="delete_service" style="font-size:14px;color:red; cursor: pointer;">?????? </i>'
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="chat_service" style="font-size:14px;color:blue; cursor: pointer;">?????????????????????????????? </i> '
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href=""  class="i_map" style="font-size:14px;color:blue; cursor: pointer;">????????????????????? </i> '
                            },
                        ],
                        "createdRow": function(row, data, dataIndex) {
                            console.log(data.priority)
                            if (data.priority == "low") {
                                $('td:eq(1)', row).addClass('green');
                            } else if (data.priority == "high") {

                                $('td:eq(1)', row).addClass('red');
                            } else {

                                $('td:eq(1)', row).addClass('yellow');
                            }
                        }
                    });

                    return
                }

                ///////////////// ?????????????????????????????????
                var _arr_dataticket = new Array()
                var _number = 0
                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                response.data.message.result.sort(compareByDate);
                const reversed = response.data.message.result.reverse()

                console.log(reversed)


                // assignee: "admin"
                // gps: {latitude: "13.8069715", longitude: "100.5900148"}
                // lastEditDate: "2021-08-17T04:53:28.448Z"
                // priority: "high"
                // registerDate: "2021-08-17T04:52:55.400Z"
                // status: "resolved"
                // ticketId: "611b40a73a9c4e00234aa58e"
                // title: "????????????????????????????????????????????????"
                // type: "maintenance"

                axios.post(urlipaddress + 'user', dataUserID, {
                    headers: {
                        'Authorization': refresh_token
                    }
                }).then(function(responseuser) {
                    var cnt = responseuser.data.message.data.length;
                    for (i_view = 0; i_view < reversed.length; i_view++) {
                        for (i = 0; i < cnt; i++) {
                            if (responseuser.data.message.data[i].userId == reversed[i_view].uId) {
                                _arrusername[0] = responseuser.data.message.data[i]
                                _arr_dataticket[_number] = {
                                    ticketId: reversed[i_view].ticketId,
                                    title: reversed[i_view].title,
                                    priority: reversed[i_view].priority,
                                    status: reversed[i_view].status,
                                    registerDate: reversed[i_view].registerDate,
                                    _houseNo: _arrusername[0].houseNo,
                                    _phone: _arrusername[0].phone,
                                    _username: _arrusername[0].username,
                                    gps: reversed[i_view].gps
                                }
                                _number = _number + 1;
                            }
                        }
                    }

                    console.log(_arr_dataticket)
                        //   $('#table1_resolved').DataTable().destroy()
                    var table = $('#table1_resolved').DataTable({
                        "lengthMenu": [
                            [25, 50, 100],
                            [25, 50, 100]
                        ],
                        "pageLength": 25,
                        'data': [..._arr_dataticket],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "title" },

                            { data: "priority" },
                            { data: "status" },
                            {
                                data: "registerDate",
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
                            { data: "_username" },
                            { data: "_houseNo" },
                            { data: "_phone" },

                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_service" style="font-size:14px;color:blue; cursor: pointer;">??????????????? </i> / <i href="" class="delete_service" style="font-size:14px;color:red; cursor: pointer;">?????? </i>'
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="chat_service" style="font-size:14px;color:blue; cursor: pointer;">?????????????????????????????? </i> '
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href=""  class="i_map" style="font-size:14px;color:blue; cursor: pointer;">????????????????????? </i> '
                            },
                        ],

                        dom: 'lBfrtip',
                        buttons: [{
                            title: 'export',
                            text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                            extend: 'excel',
                            footer: false,
                            exportOptions: {
                                columns: [0, 1, 2, 3, 4, 5, 6]
                            }
                        }],
                        "createdRow": function(row, data, dataIndex) {
                            console.log(data.priority)
                            if (data.priority == "low") {
                                $('td:eq(1)', row).addClass('green');
                                // $(row['priority']).eq(2).addClass('green');

                            } else if (data.priority == "high") {

                                $('td:eq(1)', row).addClass('red');
                            } else {

                                $('td:eq(1)', row).addClass('yellow');
                            }
                        }
                    });
                    table.buttons().container().appendTo($('#testresolved'));
                });


            }
        }).catch(function(res) {
            const { response } = res
        });
    });
}

const getserviecAll = async(refresh_token, page, _type) => {
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.result)
            if (response.data.message.result.length != 0) {

                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                response.data.message.result.sort(compareByDate);
                const reversed = response.data.message.result.reverse()

                ///////chat
                for (i = 0; i < reversed.length; i++) {

                    let date = new Date(reversed[i].registerDate);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    $("#chat_people").append(`<a class="admin_chat" style="font-size:18px;color:red; class="pull-right" href="#">
                    <div class="chat_list">
                    <div class="chat_people">
                        <div class="chat_ib">
                        <h5 id="${n}">${reversed[i].title}<span id="h_date" class="chat_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span></h5>
                            <p>${reversed[i].description}</p>
                        </div>
                    </div>
                 </div>`);

                }
                // if (datamember.rule == 'member') {

                // }
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}
const getserviecappealcount = async(refresh_token, page, _type) => {
    _type = 'appeal'
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {

            if (response.data.message.result.length != 0) {
                $("#div_appeal").text(response.data.message.result.length + " ??????????????????");

            } else {
                //   $("#div_appeal").text('0' + " ??????????????????");
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}
const getserviecinformcount = async(refresh_token, page, _type) => {

    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {

            if (response.data.message.result.length != 0) {

                $("#div_inform").text(response.data.message.result.length + " ??????????????????");

            } else {
                //   $("#div_inform").text('0' + " ??????????????????");
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}
const getserviecmaintenancecount = async(refresh_token, page, _type) => {

    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'ticket/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {

            if (response.data.message.result.length != 0) {
                $("#div_maintenance").text(response.data.message.result.length + " ??????????????????");
            } else {
                // $("#div_maintenance").text('0' + " ??????????????????");
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}

$(async function() {
    const result = await acctoken();

    var _type;
    if (Cookies.get('appeal') != undefined) {
        _type = 'appeal'
        for (let i = 1; i < 10; i++) {
            responseappointment = await getserviecappealcount(result, i, _type)

        }
    }
    if (Cookies.get('inform') != undefined) {
        _type = 'inform'
        for (let i = 1; i < 10; i++) {
            responseappointment = await getserviecinformcount(result, i, _type)

        }
    }
    if (Cookies.get('maintenance') != undefined) {
        _type = 'Maintenance'
        for (let i = 1; i < 10; i++) {
            responseappointment = await getserviecmaintenancecount(result, i, _type)

        }
    }

    for (let i = 1; i < 10; i++) {
        responseappointment = await getserviecOpen(result, i, _type)

    }
    for (let i = 1; i < 10; i++) {
        responseappointment = await getserviecResolved(result, i, _type)
    }

    for (let i = 1; i < 10; i++) {
        responseappointment = await getserviecAll(result, i, _type)
    }

    var id_io = '';
    $(document).ready(function() {
        var dataclickrow;
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            /////?????????????????????
            $('#table1_open').on('click', 'i.i_map', function(e) {
                var table = $('#table1_open').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                window.open(`gps.html?latitude= ${data.gps.latitude}&longitude= ${data.gps.longitude}`,
                    '_blank' // <- This is what makes it open in a new window.
                );
            });
            /////?????????????????????
            $('#table1_resolved').on('click', 'i.i_map', function(e) {
                var table = $('#table1_resolved').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                window.open(`gps.html?latitude= ${data.gps.latitude}&longitude= ${data.gps.longitude}`,
                    '_blank' // <- This is what makes it open in a new window.
                );
            });



            /////// ????????????????????????
            $('#table1_open').on('click', 'i.view_img', function(e) {
                dataclickrow = 'view_img'
                var table = $('#table1_open').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.ticketImage) {
                    console.log(data.ticketImage[i])

                    axios.get(urlipaddress + "view/images/" + data.ticketImage[i], {
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': result
                        }
                    }).then(function(response) {
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                        var mimetype = "image/png"; // or whatever your image mime type is

                        $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
                    });
                    nn = nn + 1;
                }
            });


            ///////// ??????
            var datadelete;
            $('#table1_open').on('click', 'i.delete_service', function(e) {
                Cookies.set('dataclickrow', 'dataclickrow', { expires: 1 })

                e.preventDefault();
                var table = $('#table1_open').DataTable();
                var _ro = table.row($(this).parents('tr'));
                datadelete = _ro.data();

                if (datadelete == undefined) {
                    datadelete = table.row(this).data();
                }
                $("#myModaldelete").modal();

                console.log(datadelete.ticketId)
                $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
            });


            $('#Deletservicedata').on('click', function(e) {

                var _type;
                if (Cookies.get('appeal') != undefined) {
                    _type = 'appeal'
                }
                if (Cookies.get('inform') != undefined) {
                    _type = 'inform'
                }
                if (Cookies.get('maintenance') != undefined) {
                    _type = 'Maintenance'
                    console.log(document.getElementById("status_edit").value)
                }


                const datanew = {
                    userId: userId,
                    ticketId: datadelete.ticketId
                }
                $.getScript("ip.js", function(data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    axios({
                        url: urlipaddress + 'ticket',
                        method: 'delete',
                        data: datanew,
                        headers: { 'Authorization': result }
                    }).then(function(response) {
                        if (response.data.message == "delete completed") {
                            console.log(response.data.message)
                            document.getElementById("lbl_delete").style.display = "none";
                            document.getElementById("lbl_dalate_completed").style.display = "block";
                            $("#lbl_dalete").text('??????????????????????????????????????????');
                            if (_type == 'appeal') {
                                location.href = "appeal.html";
                            }
                            if (_type == 'inform') {
                                location.href = "inform.html";
                            }
                            if (_type == 'Maintenance') {
                                location.href = "maintenance.html";
                            }
                        }
                    }).catch(function(res) {
                        const { response } = res
                    });
                });
            });
            /////// ????????????????????????
            $('#table1_resolved').on('click', 'i.view_img', function(e) {
                dataclickrow = 'view_img'
                var table = $('#table1_resolved').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.ticketImage) {
                    console.log(data.ticketImage[i])

                    axios.get(urlipaddress + "view/images/" + data.ticketImage[i], {
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': result
                        }
                    }).then(function(response) {
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                        var mimetype = "image/png"; // or whatever your image mime type is

                        $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
                    });
                    nn = nn + 1;
                }
            });
            ///////// ??????
            var datadelete;
            $('#table1_resolved').on('click', 'i.delete_service', function(e) {
                dataclickrow = 'delete_service'
                e.preventDefault();
                var table = $('#table1_resolved').DataTable();
                var _ro = table.row($(this).parents('tr'));
                datadelete = _ro.data();

                if (datadelete == undefined) {
                    datadelete = table.row(this).data();
                }
                $("#myModaldelete").modal();

                console.log(datadelete.ticketId)
                $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
            });




            //////////////////// ??????????????? service Open
            $('#table1_open').on('click', 'i.edit_service', function(e) {

                dataclickrow = 'delete_service'
                e.preventDefault();
                $("#EditaddImage").empty();
                var table = $('#table1_open').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }

                $("#EditService").modal();

                //     console.log(_data.parcelImage)
                //             var nn = 0;
                //             for (let i in data.ticketImage) {
                //                 axios.get(urlipad + "view/images/" + data.ticketImage[i], {
                //                     responseType: 'arraybuffer',
                //                     headers: {
                //                         'Authorization': result
                //                     }
                //                 }).then(function (response) {
                //                     var arrayBuffer = response.data; // Note: not oReq.responseText
                //                     var u8 = new Uint8Array(arrayBuffer);
                //                     var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                //                     var mimetype = "image/png"; // or whatever your image mime type is

                //                     $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                // <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                //                     arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                //                     n = n + 1;
                //                 });

                //                 nn = nn + 1;
                //             }

                console.log(data)
                $("#title_edit").val(data.title);
                $("#description_edit").val(data.description);
                $("#latitude").val(data.gps.latitude);
                $("#longitude").val(data.gps.longitude);


                if (data.status == 'open') {

                    $("#status_edit").val('Open');
                }
                if (data.status == 'in progress') {

                    $("#status_edit").val('In progress');
                }

                if (data.priority == 'low') {

                    $("#priority_edit").val('Low');
                }
                if (data.priority == 'medium') {

                    $("#priority_edit").val('Medium');
                }
                if (data.priority == 'high') {

                    $("#priority_edit").val('High');
                }

            });

            /////////////////////////// ??????????????? appeal inform maintenance
            $('#edit_dataservice').on('click', function(e) {
                Cookies.set('dataclickrow', 'dataclickrow', { expires: 1 })
                var _type;
                if (Cookies.get('appeal') != undefined) {
                    _type = 'appeal'
                }
                if (Cookies.get('inform') != undefined) {
                    _type = 'inform'
                }
                if (Cookies.get('maintenance') != undefined) {
                    _type = 'Maintenance'
                    console.log(document.getElementById("status_edit").value)
                }
                const dataticket = {
                    userId: userId,
                    ticketId: data.ticketId,
                    title: document.getElementById("title_edit").value,
                    assignee: datamember.username,
                    'gps': {
                        latitude: document.getElementById("latitude").value,
                        longitude: document.getElementById("longitude").value,
                    },
                    priority: document.getElementById("priority_edit").value,
                    status: document.getElementById("status_edit").value,
                    type: _type
                }

                axios.put(urlipaddress + 'ticket', dataticket, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function(response) {
                    console.log(response.data.message)
                    if (_type == 'appeal') {
                        location.href = "appeal.html";
                    }
                    if (_type == 'inform') {
                        location.href = "inform.html";
                    }
                    if (_type == 'Maintenance') {
                        location.href = "maintenance.html";
                    }

                }).catch(function(res) {
                    const { response } = res
                    console.log(response.data.message)
                });
            });


            $('#table1_open').on('click', 'i.chat_service', async function(e) {
                console.log('chat')

                e.preventDefault();
                $('#qnimate').removeClass('popup-box-on');
                Cookies.remove('dataid');
                $("#id_outgoing_msg").empty();
                $("#id_incoming_msg").empty();
                $('#id_popup-messages').removeClass('popup-box-on');

                if (dataclickrow == undefined) {
                    var table = $('#table1_open').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();
                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    $('#qnimate').addClass('popup-box-on');
                    $("#chathearder").text(data.title);
                    $("#ticketId").val(data.ticketId)
                    id_io = data.ticketId
                    $("#id_chatopen").val(data.ticketId)
                    Cookies.set('dataid', JSON.stringify(data), { expires: 1 })
                    $("#pop_id").animate({ "scrollTop": 2000 });


                    for (let i = 1; i < 10; i++) {
                        var aa = await getchat(result, i, data.ticketId)
                    }
                }

            });

            $('#table1_resolved').on('click', 'i.chat_service', async function(e) {
                e.preventDefault();
                $('#qnimate').removeClass('popup-box-on');
                Cookies.remove('dataid');
                $("#id_outgoing_msg").empty();
                $("#id_incoming_msg").empty();
                $('#id_popup-messages').removeClass('popup-box-on');

                if (dataclickrow == undefined) {
                    var table = $('#table1_resolved').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();
                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    $('#qnimate').addClass('popup-box-on');
                    $("#chathearder").text(data.title);
                    $("#ticketId").val(data.ticketId)
                    id_io = data.ticketId
                    $("#id_chatopen").val(data.ticketId)
                    Cookies.set('dataid', JSON.stringify(data), { expires: 1 })
                    $("#pop_id").animate({ "scrollTop": 2000 });
                    for (let i = 1; i < 10; i++) {
                        var aa = await getchat(result, i, data.ticketId)
                    }

                }
            });
        });

    });


    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const socket = io(urlipaddress);
        socket.on('sentMessage', async function(data) {
            var _id;
            if (Cookies.get('dataid') != undefined) {
                if (data == document.getElementById("ticketId").value && document.getElementById("id_chatopen").value != '') {
                    _id = JSON.parse(Cookies.get('dataid'))
                    $('#qnimate').removeClass('popup-box-on');
                    $('#qnimate').addClass('popup-box-on');
                    $("#pop_id").animate({ "scrollTop": 2000 });
                    for (let i = 1; i < 10; i++) {
                        var aa = await getchat(result, i, _id.ticketId)
                    }
                }
            }
        });
    });


});

function bufferToBase64(buf) {
    var binstr = Array.prototype.map.call(buf, function(ch) {
        return String.fromCharCode(ch);
    }).join('');
    return btoa(binstr);
}

async function getchat(refresh_token, page, ticketId) {
    //const getchat = async(refresh_token, page, ticketId) => {
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId + '?ticketId=' + ticketId + '&' + '_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'chat/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(async function(response) {
            if (response.data.message.result.length != 0) {
                //  console.log(response.data.message.result)
                for (i = 0; i < response.data.message.result.length; i++) {
                    let date = new Date(response.data.message.result[i].registerDate);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        //  console.log(response.data.message.result[i])
                    if (response.data.message.result[i].uId == datamember.userId) {
                        var msg_description = response.data.message.result[i];
                        if (response.data.message.result[i].chatImage.length != 0) {
                            var mimetype = "image/png";
                            var b64encoded = await viewdataimg(response.data.message.result[i].chatImage, refresh_token, urlipaddress, msg_description, sp)
                            if (msg_description.description == 'txt_msg_description') {
                                $("#id_incoming_msg").append(`
                                            <div class="sent_msg">
                                            <img alt="sunil" style="width: 600px;" name="${i}" src="${"data:" + mimetype + ";base64," + b64encoded}">
                                            <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span></div>`);
                                $("#id_incoming_msg").append(`
                                        <div class="received_msg">
                                                      </div>`);
                                $("#id_incoming_msg").append(`
                                                      <div class="received_msg">
                                                                    </div>`);
                            } else {
                                $("#id_incoming_msg").append(`
                                        <div class="sent_msg">
                                            <p>${msg_description.description}</p>
                                                <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span>
                                        </div>`);
                                $("#id_incoming_msg").append(`
                                        <div class="received_msg">
                                        </div> `);
                                $("#id_incoming_msg").append(`
                                        <div class="sent_msg">
                                        <img alt="sunil" style="width: 600px;" name="${i}" src="${"data:" + mimetype + ";base64," + b64encoded}">
                                        <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span></div>`);
                                $("#id_incoming_msg").append(`
                                        <div class="received_msg">
                                        </div> `);
                                $("#id_incoming_msg").append(`
                                        <div class="received_msg">
                                        </div>`);
                            }
                        } else {
                            if (response.data.message.result[i].description == 'txt_msg_description') {
                                $("#id_incoming_msg").append(`
                                    <div class="sent_msg">
                                    </div>`);
                            } else {
                                $("#id_incoming_msg").append(`
                                <div class="sent_msg">
                                    <p>${response.data.message.result[i].description}</p>
                                        <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span>
                                </div>`);
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                </div> `);
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                </div> `);
                            }
                        }
                    } else {
                        var msg_description = response.data.message.result[i];
                        console.log(msg_description)
                        if (response.data.message.result[i].chatImage.length != 0) {
                            var mimetype = "image/png";
                            var b64encoded = await viewdataimg(response.data.message.result[i].chatImage, refresh_token, urlipaddress, msg_description, sp)
                            if (msg_description.description == 'txt_msg_description') {
                                $("#id_incoming_msg").append(`
                            <div class="received_msg">
                            <div class="received_withd_msg">
                                <img alt="sunil" style="width: 600px;" name="${i}" src="${"data:" + mimetype + ";base64," + b64encoded}">
                                <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span>
                            </div>
                            </div>
                            `);
                                $("#id_incoming_msg").append(`
                            <div class="received_msg">
                            </div> `);
                                $("#id_incoming_msg").append(`
                            <div class="received_msg">
                            </div> `);
                            }
                        } else {
                            if (response.data.message.result[i].description == 'txt_msg_description') {
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                    <div class="received_withd_msg">
                                   </div>
                                </div> `);
                            } else {
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                    <div class="received_withd_msg">
                                    <p>${response.data.message.result[i].description}</p>
                                        <span class="time_date">${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}</span>
                                    </div>
                                </div> `);
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                </div> `);
                                $("#id_incoming_msg").append(`
                                <div class="received_msg">
                                </div> `);
                            }
                        }
                    }
                }
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}


async function viewdataimg(response, refresh_token, urlipaddress, msg_description, sp) {
    return new Promise(resolve => {
        for (img = 0; img < response.length; img++) {
            axios.get(urlipaddress + "view/images/" + response[img], {
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function(response) {
                var arrayBuffer = response.data; // Note: not oReq.responseText
                var u8 = new Uint8Array(arrayBuffer);
                var base64 = bufferToBase64(u8); // "SSDCvSDimaUg8J+SqQ=="
                resolve(base64)
            }).catch(function(res) {
                console.log('ddddddddddddddddddddddddd')
                const { response } = res
                console.log(response.data.message)
            });
        }
    });
}


async function getuser_member(userid_member, access_token) {
    const dataUserID = {
        userId: userId
    }
    _arrusername = new Array()
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
                }
            }
        });
    });
}
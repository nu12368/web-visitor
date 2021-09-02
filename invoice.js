var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var _arrpayment = new Array();
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

const getinvoice = async(refresh_token, page) => {

    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId + '?uId=' + datamember.userId + '&_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'invoice/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.result)
            if (response.data.message.result.length != 0) {
                console.log(datamember.rule)
                    //////////////// member 
                if (datamember.rule == 'member') {

                    ///// admin
                    var n = 0;
                    var n_payment = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        // if (response.data.message.result[i].payment.status == 'ค้างชำระ') {
                        if (response.data.message.result[i].payment.credit == undefined || response.data.message.result[i].payment.remain == undefined || response.data.message.result[i].payment.credit == '' || response.data.message.result[i].payment.remain == '') {
                            // console.log(response.data.message.result[i])
                            _arr[n] = {
                                invoiceId: response.data.message.result[i].invoiceId,
                                uId: response.data.message.result[i].uId,
                                invoiceImage: response.data.message.result[i].invoiceImage,
                                paymentImage: response.data.message.result[i].paymentImage,
                                ref1: response.data.message.result[i].ref1,
                                ref2: response.data.message.result[i].ref2,
                                category: response.data.message.result[i].category,
                                description: response.data.message.result[i].description,
                                amount: response.data.message.result[i].payment.amount,
                                credit: '0',
                                remain: response.data.message.result[i].payment.amount,
                                status: response.data.message.result[i].payment.status,
                                startDate: response.data.message.result[i].startDate,
                                dueDate: response.data.message.result[i].dueDate,
                                payDate: response.data.message.result[i].payDate,
                                registerDate: response.data.message.result[i].registerDate,
                            }
                            n = n + 1;
                        } else {
                            // รายการจ่าย payment
                            _arr[n] = {
                                invoiceId: response.data.message.result[i].invoiceId,
                                uId: response.data.message.result[i].uId,
                                invoiceImage: response.data.message.result[i].invoiceImage,
                                paymentImage: response.data.message.result[i].paymentImage,
                                ref1: response.data.message.result[i].ref1,
                                ref2: response.data.message.result[i].ref2,
                                category: response.data.message.result[i].category,
                                description: response.data.message.result[i].description,
                                amount: response.data.message.result[i].payment.amount,
                                credit: response.data.message.result[i].payment.credit,
                                remain: response.data.message.result[i].payment.remain,
                                creditDate: response.data.message.result[i].payment.payDate,
                                status: response.data.message.result[i].payment.status,
                                startDate: response.data.message.result[i].startDate,
                                dueDate: response.data.message.result[i].dueDate,
                                payDate: response.data.message.result[i].payDate,
                                registerDate: response.data.message.result[i].registerDate,
                            }
                            n = n + 1;
                        }
                        //}
                    }

                    console.log(_arr)
                    $("#div_allpayment").text(_arr.length + " รายการ");
                    ////////////////////////// Payment
                    const toDatepayment = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDatepayment = (x, y) => toDatepayment(y.registerDate) - toDatepayment(x.registerDate);
                    _arr.sort(compareByDatepayment);
                    const reversedpayment = _arr.reverse()
                    console.log(reversedpayment)
                    var table = $('#table_id6').DataTable({
                        "lengthMenu": [
                            [25, 50, 100],
                            [25, 50, 100]
                        ],
                        "pageLength": 25,
                        'data': [...reversedpayment],
                        "ordering": false,
                        "responsive": true,
                        "autoWidth": false,
                        orderCellsTop: true,
                        fixedHeader: true,
                        "order": [],
                        columns: [
                            { data: "ref2" },
                            { data: "ref1" },
                            { data: "category" },
                            { data: "amount" },
                            { data: "credit" },
                            { data: "remain" },
                            {
                                data: "creditDate",
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
                            {
                                data: "startDate",
                                render: function(data) {

                                    let date = new Date(data);
                                    let options = { hour12: false };
                                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                        return '-';
                                    }
                                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                                }
                            },
                            {
                                data: "dueDate",
                                render: function(data) {

                                    let date = new Date(data);
                                    let options = { hour12: false };
                                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                    if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                        return '-';
                                    }
                                    return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                                }
                            },
                            { data: "description" },
                            { data: "status" },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="view_imginvoice" style="color:blue; cursor: pointer;">ใบแจ้งหนี้ </i> '
                            },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="view_imgpayment" style="color:blue; cursor: pointer;">สลิป </i> '
                            },
                            // {
                            //     data: null,
                            //     className: "center",
                            //     defaultContent: '<i href="" class="view_print" style="color:blue; cursor: pointer;">พิมพ์ใบเสร็จ </i> '
                            // }

                        ],

                        "createdRow": function(row, data, dataIndex) {
                            if (data.status == "ค้างชำระ") {
                                $('td:eq(10)', row).addClass('red');
                                $('td:eq(3)', row).addClass('blue');
                                $('td:eq(5)', row).addClass('red');
                                $('td:eq(4)', row).addClass('green');
                            }
                            if (data.status == "ชำระแล้ว") {
                                $('td:eq(10)', row).addClass('green');
                                $('td:eq(3)', row).addClass('blue');
                                $('td:eq(4)', row).addClass('green');

                            }
                        }
                    });

                    return

                } else {
                    ///// admin
                    var n = 0;
                    var n_payment = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].payment.status == 'ค้างชำระ') {
                            if (response.data.message.result[i].payment.credit == undefined || response.data.message.result[i].payment.remain == undefined || response.data.message.result[i].payment.credit == '' || response.data.message.result[i].payment.remain == '') {
                                // console.log(response.data.message.result[i])
                                _arr[n] = {
                                    invoiceId: response.data.message.result[i].invoiceId,
                                    uId: response.data.message.result[i].uId,
                                    invoiceImage: response.data.message.result[i].invoiceImage,
                                    paymentImage: response.data.message.result[i].paymentImage,
                                    ref1: response.data.message.result[i].ref1,
                                    ref2: response.data.message.result[i].ref2,
                                    category: response.data.message.result[i].category,
                                    description: response.data.message.result[i].description,
                                    amount: response.data.message.result[i].payment.amount,
                                    credit: '0',
                                    remain: response.data.message.result[i].payment.amount,
                                    status: response.data.message.result[i].payment.status,
                                    startDate: response.data.message.result[i].startDate,
                                    dueDate: response.data.message.result[i].dueDate,
                                    payDate: response.data.message.result[i].payDate,
                                    registerDate: response.data.message.result[i].registerDate,
                                }
                                n = n + 1;
                            } else {
                                // รายการจ่าย payment
                                _arrpayment[n_payment] = {
                                    invoiceId: response.data.message.result[i].invoiceId,
                                    uId: response.data.message.result[i].uId,
                                    invoiceImage: response.data.message.result[i].invoiceImage,
                                    paymentImage: response.data.message.result[i].paymentImage,
                                    ref1: response.data.message.result[i].ref1,
                                    ref2: response.data.message.result[i].ref2,
                                    category: response.data.message.result[i].category,
                                    description: response.data.message.result[i].description,
                                    amount: response.data.message.result[i].payment.amount,
                                    credit: response.data.message.result[i].payment.credit,
                                    remain: response.data.message.result[i].payment.remain,
                                    creditDate: response.data.message.result[i].payment.payDate,
                                    status: response.data.message.result[i].payment.status,
                                    startDate: response.data.message.result[i].startDate,
                                    dueDate: response.data.message.result[i].dueDate,
                                    payDate: response.data.message.result[i].payDate,
                                    registerDate: response.data.message.result[i].registerDate,
                                }
                                n_payment = n_payment + 1;

                                //////////////จ่ายเพิ่ม
                                _arr[n] = {
                                    invoiceId: response.data.message.result[i].invoiceId,
                                    uId: response.data.message.result[i].uId,
                                    invoiceImage: response.data.message.result[i].invoiceImage,
                                    paymentImage: response.data.message.result[i].paymentImage,
                                    ref1: response.data.message.result[i].ref1,
                                    ref2: response.data.message.result[i].ref2,
                                    category: response.data.message.result[i].category,
                                    description: response.data.message.result[i].description,
                                    amount: response.data.message.result[i].payment.amount,
                                    credit: response.data.message.result[i].payment.credit,
                                    remain: response.data.message.result[i].payment.remain,
                                    status: response.data.message.result[i].payment.status,
                                    startDate: response.data.message.result[i].startDate,
                                    dueDate: response.data.message.result[i].dueDate,
                                    payDate: response.data.message.result[i].payDate,
                                    registerDate: response.data.message.result[i].registerDate,
                                }
                                n = n + 1;
                            }
                        } else {
                            _arrpayment[n_payment] = {
                                invoiceId: response.data.message.result[i].invoiceId,
                                uId: response.data.message.result[i].uId,
                                invoiceImage: response.data.message.result[i].invoiceImage,
                                paymentImage: response.data.message.result[i].paymentImage,
                                ref1: response.data.message.result[i].ref1,
                                ref2: response.data.message.result[i].ref2,
                                category: response.data.message.result[i].category,
                                description: response.data.message.result[i].description,
                                amount: response.data.message.result[i].payment.amount,
                                credit: response.data.message.result[i].payment.credit,
                                remain: response.data.message.result[i].payment.remain,
                                creditDate: response.data.message.result[i].payment.payDate,
                                status: response.data.message.result[i].payment.status,
                                startDate: response.data.message.result[i].startDate,
                                dueDate: response.data.message.result[i].dueDate,
                                payDate: response.data.message.result[i].payDate,
                                registerDate: response.data.message.result[i].registerDate,
                            }
                            n_payment = n_payment + 1;
                        }
                    }
                }

                $("#div_allinvoice").text(_arr.length + " รายการ");
                $("#div_allpayment").text(_arrpayment.length + " รายการ");

                ////////////////////////////   ค้างชำระ
                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                _arr.sort(compareByDate);
                const reversed = _arr.reverse()
                console.log(reversed)
                var table = $('#table_id2').DataTable({
                    "lengthMenu": [
                        [25, 50, 100],
                        [25, 50, 100]
                    ],
                    "pageLength": 25,
                    'data': [...reversed],
                    "ordering": false,
                    "responsive": true,
                    "autoWidth": false,
                    orderCellsTop: true,
                    fixedHeader: true,
                    "order": [],
                    columns: [
                        { data: "ref2" },
                        { data: "ref1" },
                        { data: "category" },
                        { data: "amount" },
                        //  { data: "credit" },
                        //   { data: "remain" },

                        {
                            data: "startDate",
                            render: function(data) {

                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                    return '-';
                                }
                                return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                            }
                        },
                        {
                            data: "dueDate",
                            render: function(data) {

                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                    return '-';
                                }

                                return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                            }
                        },
                        { data: "description" },

                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_img" style="color:blue; cursor: pointer;">รูปภาพ </i> '
                        },
                        { data: "status" },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="edit_invoice" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i> / <i href="" class="delete_invoice" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
                        }
                    ],

                    dom: 'lBfrtip',
                    buttons: [{
                        title: 'export',
                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 8]
                        }
                    }],
                    "order": [
                        [0, 'desc']
                    ],
                    "displayLength": 25,
                    "drawCallback": function(settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;
                        api.column(0, { page: 'current' }).data().each(function(group, i) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="group"><td colspan="12">' + 'บ้านเลขที่ ' + group + '</td></tr>'
                                );
                                last = group;
                            }
                        });
                    },
                    "createdRow": function(row, data, dataIndex) {
                        if (data.status == "ค้างชำระ") {
                            $('td:eq(8)', row).addClass('red');
                        }
                    }
                });
                table.buttons().container().appendTo($('#test'));




                ////////////////////////// Payment
                const toDatepayment = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDatepayment = (x, y) => toDatepayment(y.registerDate) - toDatepayment(x.registerDate);
                _arrpayment.sort(compareByDatepayment);
                const reversedpayment = _arrpayment.reverse()
                var table = $('#table_id6').DataTable({
                    "lengthMenu": [
                        [25, 50, 100],
                        [25, 50, 100]
                    ],
                    "pageLength": 25,
                    'data': [...reversedpayment],
                    "ordering": false,
                    "responsive": true,
                    "autoWidth": false,
                    orderCellsTop: true,
                    fixedHeader: true,
                    "order": [],
                    columns: [
                        { data: "ref2" },
                        { data: "ref1" },
                        { data: "category" },
                        { data: "amount" },
                        { data: "credit" },
                        { data: "remain" },
                        {
                            data: "creditDate",
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
                        {
                            data: "startDate",
                            render: function(data) {

                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                    return '-';
                                }
                                return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                            }
                        },
                        {
                            data: "dueDate",
                            render: function(data) {

                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                    return '-';
                                }
                                return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2].replace('07:00:00', '00:00:00');
                            }
                        },
                        { data: "description" },
                        { data: "status" },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_imginvoice" style="color:blue; cursor: pointer;">ใบแจ้งหนี้ </i> '
                        },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_imgpayment" style="color:blue; cursor: pointer;">สลิป </i> '
                        },
                        // {
                        //     data: null,
                        //     className: "center",
                        //     defaultContent: '<i href="" class="view_print" style="color:blue; cursor: pointer;">พิมพ์ใบเสร็จ </i> '
                        // }

                    ],
                    "order": [
                        [0, 'desc']
                    ],
                    "displayLength": 25,
                    "drawCallback": function(settings) {
                        var api = this.api();
                        var rows = api.rows({ page: 'current' }).nodes();
                        var last = null;
                        api.column(0, { page: 'current' }).data().each(function(group, i) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="group"><td colspan="12">' + 'บ้านเลขที่ ' + group + '</td></tr>'
                                );
                                last = group;
                            }
                        });
                    },
                    dom: 'lBfrtip',
                    buttons: [{
                        title: 'export',
                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 8]
                        }
                    }],
                    "createdRow": function(row, data, dataIndex) {
                        if (data.status == "ค้างชำระ") {
                            $('td:eq(10)', row).addClass('red');
                            $('td:eq(3)', row).addClass('blue');
                            $('td:eq(5)', row).addClass('red');
                            $('td:eq(4)', row).addClass('green');
                        }
                        if (data.status == "ชำระแล้ว") {
                            $('td:eq(10)', row).addClass('green');
                            $('td:eq(3)', row).addClass('blue');
                            $('td:eq(4)', row).addClass('green');
                        }
                    }
                });
                table.buttons().container().appendTo($('#test'));
            }
        }).catch(function(res) {
            const { response } = res
        });
    });

}

function getuserinvoice(refresh_token) {
    // console.log(refresh_token)
    // return new Promise(resolve => {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        const dataUserID = {
            userId: userId
        }
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            var cnt = response.data.message.data.length;
            var n = 0;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {

                if (response.data.message.data[i].rule == "member") {
                    _arr[n] = {
                        houseNo: response.data.message.data[i].houseNo,
                        memberId: response.data.message.data[i].userId + '@' + response.data.message.data[i].houseNo + '@' + response.data.message.data[i].phone
                    }
                    n = n + 1
                }
            }

            var $select = $('#ref2');

            $select.find('option').remove();
            // $select.append('<option value=' + 0 + '>' + '-- เลือกบ้านเลขที่ --' + '</option>');
            $select.append('<option value=' + '' + '>' + '-- เลือกบ้านเลขที่ --' + '</option>');
            for (i = 0; i < _arr.length; i++) {
                $select.append('<option value=' + _arr[i].memberId + '>' + _arr[i].houseNo + '</option>');
            }

            $(document).ready(function() {
                $('#ref2').selectize({
                    sortField: 'text'
                });
            });
            //  resolve(response.data.message.category);
        }).catch(function(res) {
            const { response } = res
            //     console.log(response.data)
        });
    });
    // });
}

const getuser = async(refresh_token) => {

    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        const dataUserID = {
            userId: userId
        }
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.data)
            var cnt = response.data.message.data.length;
            var n = 0;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {

                if (response.data.message.data[i].rule == "member") {
                    _arr[n] = {
                        houseNo: response.data.message.data[i].houseNo,
                        memberId: response.data.message.data[i].userId + '@' + response.data.message.data[i].houseNo
                    }
                    n = n + 1
                }
            }
            var $select = $('#ref2');

            $select.find('option').remove();
            // $select.append('<option value=' + 0 + '>' + '-- เลือกบ้านเลขที่ --' + '</option>');
            $select.append('<option value=' + '' + '>' + '-- เลือกบ้านเลขที่ --' + '</option>');
            for (i = 0; i < _arr.length; i++) {
                $select.append('<option value=' + _arr[i].memberId + '>' + _arr[i].houseNo + '</option>');
            }

        });
    });
}

$(async function() {
    var data
    const result = await acctoken();
    console.log('dsdsds')
    const responsecategory = getuserinvoice(result);
    // getuser(result);
    for (let i = 1; i < 10; i++) {
        await getinvoice(result, i)
    }
    $(document).ready(function() {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            $('#table_id2').on('click', 'i.view_img', function(e) {
                var table = $('#table_id2').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                console.log(data)
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.invoiceImage) {
                    console.log(data.invoiceImage[i])

                    axios.get(urlipaddress + "view/images/" + data.invoiceImage[i], {
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


            $('#table_id2').on('click', 'i.delete_invoice', function(e) {
                e.preventDefault();
                var table = $('#table_id2').DataTable();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }

                console.log(data)
                $("#myModaldelete").modal();
                $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

            });

            $('#Deletenotice').on('click', function(e) {
                const datanew = {
                    userId: userId,
                    invoiceId: data.invoiceId
                }
                $.getScript("ip.js", function(data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    axios({
                        url: urlipaddress + 'invoice',
                        method: 'delete',
                        data: datanew,
                        headers: { 'Authorization': result }
                    }).then(function(response) {
                        if (response.data.message == "delete completed") {
                            $("#myModaldelete").empty();
                            showSuccessMessage('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'allInvoice.html')
                                // console.log(response.data.message)
                                // document.getElementById("lbl_delete_official").style.display = "none";
                                // document.getElementById("lbl_completed_official").style.display = "block";
                                // $("#_id_deletedata").text('ลบข้อมูลสำเร็จ');
                                // location.href = "allInvoice.html";

                        }
                    }).catch(function(res) {
                        const { response } = res
                    });
                });
            });


            function showCancelMessage(title, text) {
                swal({
                    title: title,
                    text: text,
                    type: "error",
                }, function(isConfirm) {
                    swal("Cancelled", "Your imaginary file is safe :)", "error");
                });
            }

            function showSuccessMessage(title, text, page) {
                swal({
                    title: title,
                    text: text,
                    type: "success",
                }, function(isConfirm) {
                    if (isConfirm) {
                        location.href = page;
                    }
                });
            }


            ////////// payment
            $('#table_id6').on('click', 'i.view_imginvoice', function(e) {
                var table = $('#table_id6').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                console.log(data)
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.invoiceImage) {
                    console.log(data.invoiceImage[i])

                    axios.get(urlipaddress + "view/images/" + data.invoiceImage[i], {
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

            $('#ref2').on('change', function(e) {
                var Strref2 = document.getElementById("ref2").value.split('@')
                    //  console.log(Strref2)
                var _phone = ''
                if (Strref2[2] == undefined) {
                    _phone = ''

                } else {
                    _phone = Strref2[2];

                }


                document.getElementById("phone").value = _phone

            });

            /////////////////สลิป
            $('#table_id6').on('click', 'i.view_imgpayment', function(e) {
                var table = $('#table_id6').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                console.log(data)
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.paymentImage) {
                    console.log(data.paymentImage[i])

                    axios.get(urlipaddress + "view/images/" + data.paymentImage[i], {
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


            $(document).ready(function() {
                $('#table_id6').on('click', 'i.view_print', function(e) {
                    $('#ref1').val('');
                    e.preventDefault();
                    var table = $('#table_id6').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }

                    window.open(`print.html?ref1= ${data.ref1}`, '_blank');




                    // $('#p2').text('จำนวนเงินที่ต้องชำระ : ' + response.data.message[0].payment.amount + ' บาท');
                    // $('#p3').text('วันที่แจ้ง : ' + response.data.message[0].startDate.substring(0, 10));
                    // $('#p4').text('กำหนดชำระ : ' + response.data.message[0].dueDate.substring(0, 10));
                    // $('#p5').text('เลขอ้างอิง 1 (Ref.1) : ' + response.data.message[0].ref1);
                    // $('#p6').text('เลขอ้างอิง 2 (Ref.2) : ' + response.data.message[0].ref2);
                    // $('#p7').text('สถานะการชำระ : ' + response.data.message[0].payment.status);
                    // $('#p8').text('ชำระแล้ว : ' + response.data.message[0].payment.credit + ' บาท');
                    // $('#p9').text('คงเหลือ : ' + response.data.message[0].payment.remain + ' บาท');
                    // $('#p10').text('วันที่ชำระ : ' + response.data.message[0].payment.creditDate.substring(0, 10));

                });
            });
        });
    });
});
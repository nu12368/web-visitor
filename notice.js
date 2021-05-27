
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;

var datamember = Cookies.get('datamember');
if (datamember != undefined) {
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

const getnotice = async (refresh_token, page, category) => {
console.log(refresh_token)
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId + '?_page=' + page + '&_limit=100&_sort=1'
        console.log(urlipaddress + 'announce/' + param)
        axios.get(urlipaddress + 'announce/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {

console.log(response.data.message.result)

            var numberdashboard = 0
            if (response.data.message.result.length != 0) {

                ///servicedashboard

                if (Cookies.get('announce') != undefined) {
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == 'announce') {
                            for (is = 0; is < response.data.message.result[i].tag.length; is++) {
                                for (it = 0; it < datamember.tag.length; it++) {
                                    if (response.data.message.result[i].tag[is] == datamember.tag[it]) {
                                        console.log(response.data.message.result[i])
                                        numberdashboard = numberdashboard + 1;
                                    }
                                }
                            }
                        }
                    }
                    $("#div_notice").text(numberdashboard + " รายการ");
                }



                if (Cookies.get('service') != undefined) {
                    numberdashboard = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == 'service') {
                            numberdashboard = numberdashboard + 1;
                        }
                    }
                    $("#div_service").text(numberdashboard + " รายการ");
                }
                if (Cookies.get('asset') != undefined) {
                    numberdashboard = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == 'asset') {
                            numberdashboard = numberdashboard + 1;
                        }
                    }
                    $("#div_asset").text(numberdashboard + " รายการ");
                }
                if (Cookies.get('business') != undefined) {
                    numberdashboard = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == 'business') {
                            numberdashboard = numberdashboard + 1;
                        }
                    }
                    $("#div_business").text(numberdashboard + " รายการ");
                }
                if (Cookies.get('travel') != undefined) {
                    numberdashboard = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == 'travel') {
                            numberdashboard = numberdashboard + 1;
                        }
                    }
                    $("#div_travel").text(numberdashboard + " รายการ");
                }



                //////////////// member 
                if (datamember.rule == 'member') {
                    var today = new Date();
                    var n_date = today.toISOString();
                    let date = new Date(n_date);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                    var chk_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
                    chk_date = chk_date.split(' ')

                     console.log(chk_date)
                    const thisTime = dayjs(chk_date, "DD-MM-YYYY HH:mm")
                    // console.log(thisTime)
                    var _arr = new Array();
                    var n = 0;
                    var announceId;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].category == category) {
                            for (is = 0; is < response.data.message.result[i].tag.length; is++) {
                                for (it = 0; it < datamember.tag.length; it++) {
                                    if (response.data.message.result[i].tag[is] == datamember.tag[it]) {
                                        if (response.data.message.result[i].announceId != announceId) {
                                            let date = new Date(response.data.message.result[i].showDate);
                                            let options = { hour12: false };
                                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                            var s_date = sp[0].padStart(2, '0') + "/" + sp[1].padStart(2, '0') + "/" + sp[2]
                                            s_date = s_date.split(' ')
                                            const start = dayjs(s_date, "DD-MM-YYYY HH:mm")
                                            var _checkdate = dayjs(thisTime).isAfter(start)
                                            if (_checkdate == true) {
                                                _arr[n] = {
                                                    topic: response.data.message.result[i].topic,
                                                    detail: response.data.message.result[i].detail,
                                                    showDate: response.data.message.result[i].showDate,
                                                    weblink: response.data.message.result[i].weblink,
                                                    'tag': [response.data.message.result[i].tag][is],
                                                    announceImage: response.data.message.result[i].announceImage
                                                }
                                                n = n + 1;
                                            }
                                        }
                                        announceId = response.data.message.result[i].announceId
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    const toDate = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDate = (x, y) => toDate(y.showDate) - toDate(x.showDate);
                    _arr.sort(compareByDate);
                    const reversed = _arr.reverse()
                    console.log(reversed)

                    $("#div_Notice").text(reversed.length + " รายการ");
                    $('#table_id8').DataTable({
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
                            { data: "topic" },
                            { data: "detail" },
                            {
                                data: "showDate",
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
                            { data: "weblink", 'visible': false },
                            { data: "tag", 'visible': false },
                            {
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="view_img" style="color:blue; cursor: pointer;">รูปภาพ </i>'
                            },
                            {
                                'visible': false,
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i>'
                            },

                        ]
                    });


                    return
                }


                ///// admin
                var _arr = new Array();
                var n = 0;
                for (i = 0; i < response.data.message.result.length; i++) {
                    if (response.data.message.result[i].category == category) {
                        _arr[n] = {
                            announceId: response.data.message.result[i].announceId,
                            topic: response.data.message.result[i].topic,
                            detail: response.data.message.result[i].detail,
                            showDate: response.data.message.result[i].showDate,
                            weblink: response.data.message.result[i].weblink,
                            'tag': [response.data.message.result[i].tag],
                            announceImage: response.data.message.result[i].announceImage,
                            isRemoved: response.data.message.result[i].isRemoved
                        }
                        n = n + 1;
                    }
                }

                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.showDate) - toDate(x.showDate);
                _arr.sort(compareByDate);






                const reversed = _arr.reverse()
                var table = $('#table_id8').DataTable({
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
                        { data: "topic" },
                        { data: "detail" },
                        {
                            data: "showDate",
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
                        { data: "weblink", 'visible': false },
                        { data: "tag", 'visible': false },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_img" style="color:blue; cursor: pointer;">รูปภาพ </i> '
                        },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i> / <i href="" class="delete_supplies" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
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
                        if (data.status == "รับแล้ว") {
                            $(row).addClass('green');
                        } else if (data.status == "ส่งคืน") {
                            $(row).addClass('red');
                        }
                        else {
                            $(row).addClass('yellow');
                        }
                    }
                });
                table.buttons().container().appendTo($('#test'));

            }





        }).catch(function (res) {
            const { response } = res
        });
    });

}

$(async function () {
    var data
    const result = await acctoken();
    var Strcategory;
    if (Cookies.get('announce') != undefined) {
        Strcategory = "announce"
    }
    if (Cookies.get('asset') != undefined) {
        Strcategory = 'asset'

    }
    if (Cookies.get('service') != undefined) {
        Strcategory = 'service'
    }
    if (Cookies.get('business') != undefined) {
        Strcategory = 'business'
    }
    if (Cookies.get('travel') != undefined) {
        Strcategory = 'travel'
    }

    for (let i = 1; i < 10; i++) {
        responseappointment = await getnotice(result, i, Strcategory)
    }

    $(document).ready(function () {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            $('#table_id8').on('click', 'i.view_img', function (e) {
                var table = $('#table_id8').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#viewImage").empty();
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.announceImage) {
                    console.log(data.announceImage[i])

                    axios.get(urlipaddress + "view/images/" + data.announceImage[i], {
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': result
                        }
                    }).then(function (response) {
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                        var mimetype = "image/png"; // or whatever your image mime type is
                        $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
                    });
                    nn = nn + 1;
                }

                $("#topic").text(data.topic);
                $("#detail").text(data.detail);
                $('#tag').tagsInput();
                for (i = 0; i < data.tag.length; i++) {
                    $('#tag').addTag(data.tag[i]);
                }
                $("#weblink").text(data.weblink);
            });


            $('#table_id8').on('click', 'i.delete_supplies', function (e) {
                e.preventDefault();
                var table = $('#table_id8').DataTable();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#myModaldelete").modal();
                $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

                console.log(Strcategory)
            });


            $('#Deletenotice').on('click', function (e) {
                const datanew = {
                    userId: userId,
                    announceId: data.announceId
                }
                $.getScript("ip.js", function (data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    axios({
                        url: urlipaddress + 'announce',
                        method: 'delete',
                        data: datanew,
                        headers: { 'Authorization': result }
                    }).then(function (response) {
                        if (response.data.message == "delete completed") {
                            console.log(response.data.message)
                            // document.getElementById("lbl_delete_official").style.display = "none";
                            // document.getElementById("lbl_completed_official").style.display = "block";
                            // $("#_id_deletedata").text('ลบข้อมูลสำเร็จ');
                            $("#myModaldelete").empty()
                            if (Strcategory == 'announce') {
                                showSuccessMessageNotice('allnotice.html')
                                // location.href = "allnotice.html";
                            }
                            if (Strcategory == 'service') {
                                showSuccessMessageNotice('allservice.html')
                                // location.href = "allservice.html";
                            }
                            if (Strcategory == 'business') {
                                showSuccessMessageNotice('allbusiness.html')
                                // location.href = "allbusiness.html";
                            }
                            if (Strcategory == 'asset') {
                                showSuccessMessageNotice('allasset.html')
                                // location.href = "allasset.html";
                            }
                            if (Strcategory == 'travel') {
                                showSuccessMessageNotice('alltravel.html')
                                // location.href = "alltravel.html";
                            }
                        }
                    }).catch(function (res) {
                        const { response } = res
                    });
                });
            });

        });

    });


    function showCancelMessageNotice(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function (isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }

    function showSuccessMessageNotice(page) {
        swal({
            title: "สำเร็จ",
            text: "ลบข้อมูลสำเร็จ",
            type: "success",
        }, function (isConfirm) {
            if (isConfirm) {
                location.href = page;
            }
        });
    }
});
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
var _arr_member_list = new Array();
var n_member = 0;
var datamember = Cookies.get('datamember');
if (datamember != undefined) {
    datamember = JSON.parse(datamember)
} else {
    datamember = Cookies.get('datamemberID');
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

const getvisitorsupplies = async (refresh_token, page) => {

    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId + '?_page=' + page + '&_limit=100&_sort=1'
        axios.get(urlipaddress + 'deliver/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.result)
            if (response.data.message.result.length != 0) {
                if (datamember.rule == 'member') {
                    var _arr = new Array();
                    var n = 0;

                    var _status = 0;
                    for (i = 0; i < response.data.message.result.length; i++) {
                        if (response.data.message.result[i].room == datamember.houseNo) {

                            if (response.data.message.result[i].status == 'มา') {
                                _status = _status + 1;

                                _arr[n] = {
                                    room: response.data.message.result[i].room,
                                    description: response.data.message.result[i].description,
                                    status: response.data.message.result[i].status,
                                    registerDate: response.data.message.result[i].registerDate,
                                    lastEditDate: response.data.message.result[i].lastEditDate,
                                    parcelImage: response.data.message.result[i].parcelImage,
                                    receiverImage: response.data.message.result[i].receiverImage
                                }
                                n = n + 1;
                            } else {
                                _arr_member_list[n_member] = {
                                    room: response.data.message.result[i].room,
                                    description: response.data.message.result[i].description,
                                    status: response.data.message.result[i].status,
                                    registerDate: response.data.message.result[i].registerDate,
                                    lastEditDate: response.data.message.result[i].lastEditDate,
                                    parcelImage: response.data.message.result[i].parcelImage,
                                    receiverImage: response.data.message.result[i].receiverImage
                                }
                                n_member = n_member + 1;
                            }

                        }
                    }

                    $("#div_supplies").text(_status + " รายการ");
                    //    console.log(_arr)
                    const toDate = str => {
                        const [d, t] = str.split(' ')
                        return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                    };
                    const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                    _arr.sort(compareByDate);
                    const reversed = _arr.reverse()


                    var table = $('#table_supplies').DataTable({
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
                            { data: "room" },
                            { data: "description" },
                            { data: "status" },
                            {
                                data: "registerDate",
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
                                data: "lastEditDate",
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
                                defaultContent: '<i href="" class="view_img" style="cursor: pointer; color:blue;">รูปภาพ </i> '
                            },
                            {

                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="view_receiver" style="cursor: pointer; color:blue;">รูปภาพ </i>'
                            },
                            {
                                'visible': false,
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="" style="cursor: pointer; color:blue;">ส่งมอบ </i>'
                            },
                            {
                                'visible': false,
                                data: null,
                                className: "center",
                                defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i>'
                            },
                            { data: "parcelImage", 'visible': false },
                            { data: "receiverImage", 'visible': false },
                        ],
                        "createdRow": function (row, data, dataIndex) {
                            if (data.status == "รับแล้ว") {
                                $(row).addClass('green');
                            } else if (data.status == "ส่งคืน") {
                                $(row).addClass('red');
                            } else {
                                $(row).addClass('yellow');
                            }
                        }
                    });


                    return
                }

                ///////////////// เจ้าหน้าที่
                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
                response.data.message.result.sort(compareByDate);
                const reversed = response.data.message.result.reverse()

                console.log(reversed)
                var table = $('#table_supplies').DataTable({
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
                        { data: "room" },
                        { data: "description" },
                        { data: "status" },
                        {
                            data: "registerDate",
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
                            data: "lastEditDate",
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
                            defaultContent: '<i href="" class="view_img" style="color:blue;cursor: pointer;">รูปภาพ </i> '
                        },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_receiver" style="color:blue;cursor: pointer;">รูปภาพ </i>'
                        },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_edit" style="cursor: pointer; color:blue;">ส่งมอบ </i>'
                        },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i> / <i href="" class="delete_supplies" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
                        },

                        { data: "parcelImage", 'visible': false },
                        { data: "receiverImage", 'visible': false },
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
                    "createdRow": function (row, data, dataIndex) {
                        if (data.status == "รับแล้ว") {
                            $(row).addClass('green');
                        } else if (data.status == "ส่งคืน") {
                            $(row).addClass('red');
                        } else {
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
    console.log('dsdssds')
    const result = await acctoken();
    for (let i = 1; i < 10; i++) {
        responseappointment = await getvisitorsupplies(result, i)

    }
    $(document).ready(function () {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            /////// ดูรูปภาพ
            $('#table_supplies').on('click', 'i.view_img', function (e) {
                var table = $('#table_supplies').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#viewImage").empty();
                console.log(data.parcelImage)
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.parcelImage) {
                    console.log(data.parcelImage[i])

                    axios.get(urlipaddress + "view/images/" + data.parcelImage[i], {
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

                document.getElementById("h_viewimg").innerText = 'รูปพัสดุ'

            });


            /////// ดูรูปภาพผู้รับ
            $('#table_supplies').on('click', 'i.view_receiver', function (e) {
                console.log('dsdsd')
                var table = $('#table_supplies').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#viewImage").empty();
                console.log(data.receiverImage)
                $("#myModalview").modal();
                var nn = 0;
                for (let i in data.receiverImage) {
                    console.log(data.receiverImage[i])

                    axios.get(urlipaddress + "view/images/" + data.receiverImage[i], {
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

                document.getElementById("h_viewimg").innerText = 'รูปผู้รับ'
            });

            $('#table_supplies').on('click', 'i.delete_supplies', function (e) {
                e.preventDefault();
                var table = $('#table_supplies').DataTable();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#myModaldelete").modal();

                console.log(data.parcelId)
                $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

            });


            $('#Deletenoticedata').on('click', function (e) {

                const datanew = {
                    userId: userId,
                    parcelId: data.parcelId
                }

                $.getScript("ip.js", function (data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    axios({
                        url: urlipaddress + 'deliver',
                        method: 'delete',
                        data: datanew,
                        headers: { 'Authorization': result }
                    }).then(function (response) {
                        if (response.data.message == "delete completed") {
                            $("#myModaldelete").empty()
                            showSuccessMessage('สำเร็จ', 'ลบข้อมูลสำเร็จ', 'supplies.html')
                            // console.log(response.data.message)
                            // document.getElementById("lbl_delete").style.display = "none";
                            // document.getElementById("lbl_dalate_completed").style.display = "block";
                            // $("#lbl_dalete").text('ลบข้อมูลสำเร็จ');
                            // location.href = "supplies.html";
                        }
                    }).catch(function (res) {
                        const { response } = res
                        showCancelMessage(response.data.message, '')
                    });
                });
            });

            $('#list_supplies_member').on('click', function (e) {
                
                $("#viewImage").empty();
                $("#tbl_record_supplies").empty();
                ////////ประวัติ
                for (const i in _arr_member_list) {
                    let date = new Date(_arr_member_list[i].registerDate);
                    let options = { hour12: false };
                    var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')

                    let date2 = new Date(_arr_member_list[i].lastEditDate);
                    let options2 = { hour12: false };
                    var sp2 = date2.toLocaleString('en-US', options2).replace(',', '').split('/')

                    $("#tbl_record_supplies").append(`
               <tr>
                   <td>
                   <div>
                  <b> <p >
                 ${_arr_member_list[i].description}
                   </p><b/>
                   <p >
                
                  
                   สถานะ :   <font style="color: green;">${_arr_member_list[i].status} </font>
                   </p>
              
                   <p >
                   เวลาแจ้ง : ${sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]}
                   </p>

                   <p >
                   เวลามารับ : ${sp2[1].padStart(2, '0') + "/" + sp2[0].padStart(2, '0') + "/" + sp2[2]}
                   </p>

                   <a  class="a_parcelImage"  id='${JSON.stringify(_arr_member_list[i])}' style="text-align:justify; color: blue;  cursor: pointer;">ภาพพัสดุ</a>   &nbsp; / &nbsp;  <a  class="a_receiverImage"  id='${JSON.stringify(_arr_member_list[i])}' style="text-align:justify; color: blue;  cursor: pointer;">ภาพผู้รับ</a>
                   <hr />
                   </div>
                </td>           
               </tr>
           `);
                }
            });

            
            $('#list_supplies_member').on('click', function (e) {
                
                  $("#addsuppliesListmember").modal();
            });
            $('#_back').on('click', function (e) {
                
                $("#addsuppliesListmember").modal();
                $("#myModalview").modal('hide');
          });
var check_view;
    ////// ภาพพัสดุ
    $('#tbl_record_supplies').on('click', 'a.a_parcelImage', function (e) {
        document.getElementById('div_view_img').style.display = 'block'
        var parcelImage = $(this).attr("id");
        parcelImage = JSON.parse(parcelImage)
        $('#myModalview').trigger('focus')
        $("#viewImage").empty();
        $("#myModalview").modal('show');
        $('#addsuppliesListmember').modal('hide')
        check_view = 'view'
        var nn = 0;
        for (let i in parcelImage.parcelImage) {
            axios.get(urlipaddress + "view/images/" + parcelImage.parcelImage[i], {
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

    });


    ////// ภาพผู้รับ
    $('#tbl_record_supplies').on('click', 'a.a_receiverImage', function (e) {
        document.getElementById('div_view_img').style.display = 'block'
        check_view = 'view'
        $("#viewImage").empty();
        var receiverImage = $(this).attr("id");
        receiverImage = JSON.parse(receiverImage)
        $('#myModalview').trigger('focus')
        $('#myModalview').trigger('focus')
        $("#viewImage").empty();
        $("#myModalview").modal('show');
        $('#addsuppliesListmember').modal('hide')
        var nn = 0;
        for (let i in receiverImage.receiverImage) {
            axios.get(urlipaddress + "view/images/" + receiverImage.receiverImage[i], {
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
    });



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


});
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;

var datamember = Cookies.get('datamember');
if (datamember != undefined) {
    datamember = JSON.parse(datamember)
} else {
    datamember = Cookies.get('datamemberID');
    datamember = JSON.parse(datamember)
}

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
                //   console.log('bbb')
                // console.log(response.data.message.access_token)
                resolve(response.data.message.access_token);

            }).catch(function(res) {
                const { response } = res
                //   console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}
var _arr = new Array();
var n = 0;
const getapprove = async(refresh_token, page) => {

    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId + '?_page=' + page + '&_limit=100&_sort=1'
        console.log(urlipaddress + 'announce/' + param)
        axios.get(urlipaddress + 'announce/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.result)
            if (response.data.message.result.length != 0) {
                for (i = 0; i < response.data.message.result.length; i++) {
                    //  for (is = 0; is < response.data.message.result[i].tag.length; is++) {
                    if (response.data.message.result[i].approve != undefined) {
                        if (response.data.message.result[i].approve == 'รออนุมัติ') {
                            var ck = 'travel'
                            var type_catagory = 'ข้อมูลท่องเที่ยว';
                            if (response.data.message.result[i].category != ck) {
                                type_catagory = 'ข้อมูลธุรกิจ'
                            }

                            _arr[n] = {
                                announceId: response.data.message.result[i].announceId,
                                topic: response.data.message.result[i].topic,
                                detail: response.data.message.result[i].detail,
                                showDate: response.data.message.result[i].showDate,
                                weblink: response.data.message.result[i].weblink,
                                'tag': '',
                                announceImage: response.data.message.result[i].announceImage,
                                latitude: response.data.message.result[i].gps.latitude,
                                longitude: response.data.message.result[i].gps.longitude,
                                approve: response.data.message.result[i].approve,
                                uId: response.data.message.result[i].uId,
                                category: response.data.message.result[i].category,
                                isRemoved: response.data.message.result[i].isRemoved,
                                type_catagory: type_catagory
                            }

                            n = n + 1;
                        }

                    }
                    // }

                }
                console.log(_arr)
                const toDate = str => {
                    const [d, t] = str.split(' ')
                    return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
                };
                const compareByDate = (x, y) => toDate(y.showDate) - toDate(x.showDate);
                _arr.sort(compareByDate);
                const reversed = _arr.reverse()
                    //    console.log(reversed)
                console.log(reversed.length)


                $("#div_Tapproved").text(reversed.length + " รายการ");
                var table = $('#table_id8').DataTable({
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
                        { data: "type_catagory" },
                        { data: "topic" },
                        { data: "detail" },
                        {
                            data: "showDate",
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
                        { data: "weblink", 'visible': false },
                        { data: "tag", 'visible': false },
                        { data: "approve" },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="view_img" style="color:blue; cursor: pointer;">รูปภาพ </i> '
                        },

                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">ตัดสินใจ </i> / <i href="" class="delete_supplies" style="font-size:14px;color:red; cursor: pointer;">ลบ </i>'
                        },
                        { data: 'latitude', "visible": false },
                        { data: 'longitude', "visible": false },
                        { data: 'isRemoved', "visible": false },

                        { data: 'announceId', "visible": false },
                    ],

                    dom: 'lBfrtip',
                    buttons: [{
                        title: 'export',
                        text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    }],
                    "createdRow": function(row, data, dataIndex) {
                        console.log(data.approve)
                        if (data.approve == "รออนุมัติ") {
                            $('td:eq(4)', row).addClass('green');
                        }
                        // console.log(data.approve)
                        // if (data.approve == "รออนุมัติ") {
                        //     $(row).addClass('yellow');
                        // }
                    }
                });
                table.buttons().container().appendTo($('#test'));
            }

        }).catch(function(res) {
            const { response } = res
        });
    });

}

$(async function() {
    const result = await acctoken();
    for (let i = 1; i < 10; i++) {
        responseappointment = await getapprove(result, i)
    }


    console.log(_arr)
    $(document).ready(function() {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            $('#table_id8').on('click', 'i.view_img', function(e) {
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
                    }).then(function(response) {
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        var b64encoded = bufferToBase64(u8)
                        console.log('dddddddddddddddddd')
                            // var b64encoded = btoa(String.fromCharCode.apply(null, u8));
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
                $("#gps").attr("href", `gps.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);
            });


            $('#table_id8').on('click', 'i.delete_supplies', function(e) {
                e.preventDefault();
                var table = $('#table_id8').DataTable();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                $("#myModaldelete").modal();
                $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');
                console.log(data)
            });


            $('#Deletenotice').on('click', function(e) {
                const datanew = {
                    userId: userId,
                    announceId: data.announceId
                }
                $.getScript("ip.js", function(data, textStatus, jqxhr) {
                    var urlipaddress = data.substring(1, data.length - 1);
                    axios({
                        url: urlipaddress + 'announce',
                        method: 'delete',
                        data: datanew,
                        headers: { 'Authorization': result }
                    }).then(function(response) {
                        if (response.data.message == "delete completed") {
                            console.log(response.data.message)
                            $("#myModaldelete").empty()

                            showSuccessMessageNotice('approved.html')

                        }
                    }).catch(function(res) {
                        const { response } = res
                    });
                });
            });



            $('#table_id8').on('click', 'i.edit_supplies', function(e) {
                e.preventDefault();
                $("#EditaddImage").empty();
                var table = $('#table_id8').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                data = _ro.data();
                if (data == undefined) {
                    data = table.row(this).data();
                }
                console.log(data)
                $("#Editnotice").modal();
                var nn = 0;
                for (let i in data.announceImage) {
                    axios.get(urlipaddress + "view/images/" + data.announceImage[i], {
                        responseType: 'arraybuffer',
                        headers: {
                            'Authorization': result
                        }
                    }).then(function(response) {
                        //  console.log(response.data)
                        var arrayBuffer = response.data; // Note: not oReq.responseText
                        var u8 = new Uint8Array(arrayBuffer);
                        //   console.log(u8)
                        var b64encoded = bufferToBase64(u8)
                            //    console.log(b64encoded)
                        var mimetype = "image/png"; // or whatever your image mime type is

                        //// รุปไปแสดง
                        // <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" >
                        $("#EditaddImage").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                       <img name="${n}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);

                        //// แปลง 64 เป็น ไฟล์ เก็บ Array
                        // arr[n] = bufferToBase64("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                        // console.log(arr)
                        n = n + 1;
                    });

                    nn = nn + 1;
                }
                // for (i = 0; i < data.tag.length; i++) {
                //     $('#editinput-tags').tagsInput();
                //     $('#editinput-tags').addTag(data.tag[i]);
                // }
                let date = new Date(data.showDate);
                let options = { hour12: false };
                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                var _d = sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2]
                console.log(data.isRemoved)
                $("#selectdeleteedit").val(data.isRemoved.toString());
                $("#editshowDate").val(_d.substring(0, 10));
                $("#edittxttimenotice").val(_d.substring(10, _d.length));
                $("#edit_posttopic").val(data.topic);
                $("#edit_postdetail").val(data.detail);
                $("#edit_weblink").val(data.weblink);
                $("#latitude_edit").val(data.latitude);
                $("#longitude_edit").val(data.longitude);
                $("#gps_edit").attr("href", `map.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);
            });



            $('#edit_submitpostinvoice').on('click', function(e) {
                document.getElementById("edit_lbl_notice").innerText = ''
                const url = urlipaddress + 'announce';
                let formData = new FormData();
                var ddd = document.getElementById('editshowDate').value
                var s_time = document.getElementById('edittxttimenotice').value.replace(' ', '');
                s_time = s_time.substring(0, 5);
                document.getElementById("_id_updatedata").innerText = ''
                var timedaysshowDate;
                var strdaysshowDate;
                if (ddd == '') {
                    document.getElementById("_id_updatedata").innerText = 'กรุณาระบุวันที่'
                    document.getElementById("_id_updatedata").style.color = 'red'
                    return

                } else {
                    timedaysshowDate = document.getElementById('editshowDate').value.split('/');
                    var aaa = new Date(`${timedaysshowDate[2] + '-' + timedaysshowDate[1] + '-' + timedaysshowDate[0]}T${s_time}:00`).toISOString()
                    strdaysshowDate = aaa;
                }

                if (document.getElementById("Adminapproved").value == '0') {
                    showCancelMessageNotice('กรุณาเลือก อนุมัติ หรือ ไม่อนุมัติ', '')
                    return
                }

                if (document.getElementById("edit_postdetail").value == '') {
                    document.getElementById("edit_postdetail").value = '-'
                }
                if (document.getElementById("edit_weblink").value == '') {
                    document.getElementById("edit_weblink").value = '-'
                }
                if (arr.length == 0) {
                    formData.append('userId', userId);
                    formData.append('announceId', data.announceId);
                    formData.append('topic', document.getElementById("edit_posttopic").value);
                    formData.append('detail', document.getElementById("edit_postdetail").value);
                    formData.append('weblink', document.getElementById("edit_weblink").value);
                    var _sp = document.getElementById("editinput-tags").value.split(',')
                    if (document.getElementById("editinput-tags").value == '' && document.getElementById("Adminapproved").value == 'อนุมัติ') {
                        showCancelMessageNotice('กรุณาเลือก TAG', '')
                        return
                    }
                    if (document.getElementById("Adminapproved").value == 'ไม่อนุมัติ') {} else {
                        for (i = 0; i < _sp.length; i++) {
                            formData.append('tag[]', _sp[i]);
                        }
                    }
                    formData.append('category', data.category);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdeleteedit").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                    formData.append('approve', document.getElementById("Adminapproved").value);
                } else {
                    formData.append('userId', userId);
                    formData.append('announceId', data.announceId);
                    formData.append('topic', document.getElementById("edit_posttopic").value);
                    formData.append('detail', document.getElementById("edit_postdetail").value);
                    formData.append('weblink', document.getElementById("edit_weblink").value);
                    var _sp = document.getElementById("editinput-tags").value.split(',')
                    if (document.getElementById("editinput-tags").value == '' && document.getElementById("Adminapproved").value == 'อนุมัติ') {
                        showCancelMessageNotice('กรุณาเลือก TAG', '')
                        return
                    }

                    if (document.getElementById("Adminapproved").value == 'ไม่อนุมัติ') {} else {
                        for (i = 0; i < _sp.length; i++) {
                            formData.append('tag[]', _sp[i]);
                        }
                    }

                    formData.append('gps[latitude]', document.getElementById("latitude_edit").value);
                    formData.append('gps[longitude]', document.getElementById("longitude_edit").value);
                    formData.append('category', data.category);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdeleteedit").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                    formData.append('approve', document.getElementById("Adminapproved").value);
                }


                console.log(isRemoved)
                axios.put(url, formData, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function(response) {
                    console.log(response.data.message);
                    if (response.data.message.data == 'update completed') {
                        showSuccessMessage('อนุมัติ', 'อนุมัติสำเร็จ', 'approved.html')
                    }

                }).catch(function(res) {
                    console.log(res.data.message)
                    showCancelMessage(response.data.message, '')
                });

            });





        });

    });


    function bufferToBase64(buf) {
        var binstr = Array.prototype.map.call(buf, function(ch) {
            return String.fromCharCode(ch);
        }).join('');
        return btoa(binstr);
    }

    function showCancelMessageNotice(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function(isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }

    function showSuccessMessageNotice(page) {
        swal({
            title: "สำเร็จ",
            text: "ลบข้อมูลสำเร็จ",
            type: "success",
        }, function(isConfirm) {
            if (isConfirm) {
                location.href = page;
            }
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
});
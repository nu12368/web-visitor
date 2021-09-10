//const userId = '5fe2c8a089d27d3818e4bcba'


var obj = JSON.parse(Cookies.get('datatoken'));

var userId = Cookies.get('datauserId');
 var userId_checkCost = Cookies.get('datajwt');
console.log(userId_checkCost)
var _arr = new Array();
var n = 0;
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
                //  console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}





$(async function () {
    const result = await acctoken();
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var n = 0;
        var num = 1;
        var _arr = new Array();
        axios.get(urlipaddress + 'activeList', {
            headers: {
                'Authorization': result
            }
        }).then(function (response) {
            //console.log(response.data.message)
            var cnt_device = response.data.message.length;
            //    console.log(response.data.message)

            for (i = 0; i < cnt_device; i++) {
                if (response.data.message[i].deviceId != undefined) {
                    for (i2 = 0; i2 < response.data.message[i].deviceId.length; i2++) {
                        //  console.log(response.data.message[i].deviceId[i2])
                        _arr[n] = {
                            num: num,
                            _userId: response.data.message[i]._id,
                            deviceId: response.data.message[i].deviceId[i2],
                            activeMode: response.data.message[i].activeMode,
                        }
                        n = n + 1
                        num = num + 1
                    }
                }

            }
            //    / var groupColumn = 0;
            //    console.log(_arr)
            $('#table1').DataTable({
                "lengthMenu": [[20, 50, 100], [20, 50, 100]],
                "pageLength": 20,
                'data': _arr,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "num", "visible": false },
                    { data: "_userId", "visible": false },
                    { data: "deviceId" },
                    { data: "activeMode" },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">แก้ไข </i>/<i href="" class="del_visitor" style="font-size:16px;color:red; cursor: pointer;">ลบ </i>'
                    }
                ],
                "displayLength": 25,
                "drawCallback": function (settings) {
                    var api = this.api();
                    var rows = api.rows({ page: 'current' }).nodes();
                    var last = null;
                    api.column(1, { page: 'current' }).data().each(function (group, i) {
                        //     console.log(group)
                        if (last !== group) {
                            $(rows).eq(i).before(
                                '<tr class=""><td style="font-size:16px;color:blue;  text-align: left;" >' + 'ID ลูกค้า ' + group + ' ' + '</td></tr>'
                            );
                            last = group;
                        }
                    });
                },
            });

            $(document).ready(function () {

                $('#table1').on('click', 'i.edit_visitor', function (e) {
                    e.preventDefault();
                    $("#myModaledit").modal();
                    var table = $('#table1').DataTable();
                    e.preventDefault();
                    var _ro = table.row($(this).parents('tr'));
                    var deviceid = _ro.data();

                    if (deviceid == undefined) {
                        deviceid = table.row(this).data();
                    }
                    //  console.log(deviceid._userId)
                    //   console.log(deviceid.activeMode)
                    document.getElementById("lbl_edit").innerText = ''
                    document.getElementById("_id_edit").value = deviceid._userId


                });


                $('#EditActive').on('click', function (e) {

                    //console.log(document.getElementById("EditactiveMode").value)
                    if (document.getElementById("EditactiveMode2").value == '0') {
                        document.getElementById("lbl_edit").innerText = 'กรุณาเลือกโหมด'
                        document.getElementById("lbl_edit").style.color = "red";
                        return;
                    }
                    const datavisitorEdit = {
                        userId: document.getElementById("_id_edit").value,
                        activeMode: document.getElementById("EditactiveMode2").value
                    }

                    //   console.log(datavisitorEdit)
                    axios.put(urlipaddress + 'activeEditMode', datavisitorEdit, {
                        headers: {
                            'Authorization': result
                        }
                    }
                    ).then(function (response) {
                        //      console.log(response.data.message)
                        location.href = "visitoractivate.html";
                    }).catch(function (res) {
                        const { response } = res
                        //     console.log(response.data.message)
                    });

                });
                var useriddelete = '';
                $('#table1').on('click', 'i.del_visitor', function (e) {
                    e.preventDefault();
                    $("#myModaldelete").modal();
                    var table = $('#table1').DataTable();
                    e.preventDefault();
                    var _ro = table.row($(this).parents('tr'));
                    var deviceid = _ro.data();

                    if (deviceid == undefined) {
                        deviceid = table.row(this).data();
                    }
                    document.getElementById("_id_deletedata").value = deviceid.deviceId
                    //    console.log( document.getElementById("_id_deletedata").value)
                    useriddelete = deviceid._userId
                    //    console.log(useriddelete)
                    $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

                });

                ////////// ยืนยันลบ 
                $('#Deletevisitor').on('click', function (e) {
                    axios({
                        url: urlipaddress + 'delActive',
                        method: 'delete',
                        data: {
                            userId: useriddelete,
                            deviceId: document.getElementById("_id_deletedata").value
                        }, headers: {
                            'Authorization': result
                        }
                    }).then(function (response) {
                        //      console.log(response.data.message)
                        location.href = "visitoractivate.html";
                    }).catch(function (res) {
                        const { response } = res
                        //   console.log(response.data.message)
                    });
                });
            });


        }).catch(function (res) {
            const { response } = res
        });


        ////////// Activate
        $('#submitvisitorActivate').on('click', function (e) {
            document.getElementById("p_activate").innerText = "";
            const datavisitorType = {
                regisId: document.getElementById("txtregisterid").value,
                deviceId: document.getElementById("txtVisitorActivate").value,
                activeMode: document.getElementById("activeMode").value
            }
            axios.post(urlipaddress + 'addActive', datavisitorType, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                //    console.log(response.data.message)
                // if (response.data.message == 'This device is already registered.') {
                document.getElementById("p_activate").innerText = 'บันทึกสำเร็จ'
                document.getElementById("p_activate").style.color = "green";
                location.href = "visitoractivate.html";
                // }


            }).catch(function (res) {
                const { response } = res

                //   console.log(response.data.message)
                document.getElementById("p_activate").innerText = 'บันทึกไม่สำเร็จ'
                document.getElementById("p_activate").style.color = "red";
            });
        });

    });


});
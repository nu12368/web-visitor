//const userId = '5fe2c8a089d27d3818e4bcba'
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var IDUSER = JSON.parse(Cookies.get('datajwt'));
console.log(userId)
var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;

function acctoken() {
    //  console.log('acctoken')
    // console.log(obj.refresh_token)
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
                console.log(response.data.message)

                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }

            });
        });
    });
}
function timeConvert(n) {
    var num = n;
    var hours = (num / 60);
    var rhours = Math.floor(hours);
    var minutes = (hours - rhours) * 60;
    var rminutes = Math.round(minutes);
    return leftPad(rhours, 2) + ":" + leftPad(rminutes, 2);
}
function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}
function getvisitorType(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitorType/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                // _arrvisitorType = response.data.message.visitorType
                resolve(response.data.message.visitorType);

            }).catch(function (res) {
                const { response } = res
          //      console.log(response.data)
            });
        });
    });
}
var cnt_cost;
var _arr = new Array();
var n = 0;
var edit_cost = '';
const getvisitorCost = async (refresh_token, _type) => {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var paramcost = '_id=' + userId + '&_page=1&_limit=100'

        axios.get(urlipaddress + 'cost?' + paramcost, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (responsecost) {
          //  console.log('responsecost')
        //    console.log(responsecost.data.message.result)
            edit_cost = JSON.stringify(responsecost.data.message.result)
            //  console.log(edit_cost)
       //     console.log('type')
       //     console.log(_type)
            var _cost = responsecost.data.message.result;
            // var datacost = responsecost.data.message.result
            for (i = 0; i < _type.length; i++) { //////ประเภท
                var txtcost = 'ไม่คิด';
                var costEnable = 'ไม่เปิดใช้งาน'
                for (i2 = 0; i2 < _cost.length; i2++) { /////คิดเงิน
            //        console.log(_type[i])
                    if (_type[i] == _cost[i2].visitorType) {
                        if (_cost[i2].checkoutStatus == 'true') {
                            txtcost = 'คิด'
                            costEnable = 'เปิดใช้งาน'
                            break;
                        }
                    }
                }
                _arr[n] = {
                    visitorType: _type[i],
                    cost: txtcost,
                    checkoutStatus: costEnable
                }
                n = n + 1;
            }

      //      console.log(_arr)


            $('#table1').DataTable().destroy();
            var table = $('#table1').DataTable({
                "bPaginate": false,
                "bLengthChange": false,
                "bInfo": false,
                "bAutoWidth": false,
                "searching": false,
                'data': _arr,
                "ordering": false,
                "responsive": true,
                "autoWidth": false,
                orderCellsTop: true,
                fixedHeader: true,
                "order": [],
                columns: [
                    { data: "visitorType" },
                    { data: "cost" },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="add" style="font-size:16px;color:green; cursor: pointer;">สร้าง </i> <i href="" class="edit" style="font-size:16px;color:orange; cursor: pointer;">แก้ไข </i> '
                    },
                    {
                        data: null,
                        render: function (data) {
                       //     console.log(data.checkoutStatus)
                            if (data.checkoutStatus == 'เปิดใช้งาน') {
                                return `<i href="" class="_enable" style="font-size:16px;color:green; cursor: pointer;">${data.checkoutStatus}</i>`;
                            } else {
                                return `<i href="" class="_enable" style="font-size:16px;color:red; cursor: pointer;">${data.checkoutStatus}</i>`;
                            }
                        },

                    },
                    // {
                    //     data: null,
                    //     className: "center",
                    //     defaultContent: '<i href="" class="view" style="font-size:16px;color:blue; cursor: pointer;">ค่าบริการจอดรถ </i>'
                    // },
                ]
            });
            var _visitortype = '';
            var _costId = '';



            // $('#table1').on('click', 'tbody td i.view', function (e) {
            //     var table = $('#table1').DataTable();
            //     e.preventDefault();
            //     var _ro = table.row($(this).parents('tr'));
            //     var data = _ro.data();

            //     if (data == undefined) {
            //         data = table.row(this).data();
            //     }
            //     _costId = JSON.parse(edit_cost);
            //     _visitortype = data.visitorType;

            //     $("#view_visitoe").text('ประเภท VISITOR ' + data.visitorType);

            //     $("#myModalview").modal();
            // });




            $('#table1').on('click', 'tbody td i._enable', function (e) {
             //   console.log('sssssssssssssss')
                var table = $('#table1').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
                _costId = JSON.parse(edit_cost);
                _visitortype = data.visitorType;
            //    console.log(_costId)
             //   console.log(_visitortype)
                $("#myModalOpen").modal();

                $('#A_Open').attr('disabled', true);
                $('#B_Open').attr('disabled', true);
                $('#C_Open').attr('disabled', true);
                $('#D_Open').attr('disabled', true);
                $('#E_Open').attr('disabled', true);
                $("#h_typeOpen").text('ประเภท ' + data.visitorType);
            //    console.log(_visitortype)
                for (var i = 1; i < _costId.length; i++) {
                 //   console.log(_costId[i].visitorType)
                    if (_visitortype == _costId[i].visitorType) {
                        if (_costId[i].costType == 'A') {
                            if (_costId[i].checkoutStatus == 'true') {
                                $('#A_Open').attr('disabled', false);
                                $('#A_Open').attr('checked', true)
                            } else {
                                $('#A_Open').attr('disabled', false);
                                $('#A_Open').attr('checked', false)
                            }
                        }

                        if (_costId[i].costType == 'B') {
                            if (_costId[i].checkoutStatus == 'true') {
                                $('#B_Open').attr('disabled', false);
                                $('#B_Open').attr('checked', true)
                            } else {
                                $('#B_Open').attr('disabled', false);
                                $('#B_Open').attr('checked', false)
                            }
                        }

                        if (_costId[i].costType == 'C') {
                            if (_costId[i].checkoutStatus == 'true') {
                                $('#C_Open').attr('disabled', false);
                                $('#C_Open').attr('checked', true)
                            } else {
                                $('#C_Open').attr('disabled', false);
                                $('#C_Open').attr('checked', false)
                            }
                        }

                        if (_costId[i].costType == 'D') {

                            if (_costId[i].checkoutStatus == 'true') {
                                $('#D_Open').attr('disabled', false);
                                $('#D_Open').attr('checked', true)
                            } else {
                                $('#D_Open').attr('disabled', false);
                                $('#D_Open').attr('checked', false)
                            }
                        }
                        if (_costId[i].costType == 'E') {
                            if (_costId[i].checkoutStatus == 'true') {
                                $('#E_Open').attr('disabled', false);
                                $('#E_Open').attr('checked', true)
                            } else {
                                $('#E_Open').attr('disabled', false);
                                $('#E_Open').attr('checked', false)
                            }
                        }
                    }
                }



            });


            $('#submitOpen').on('click', function (e) {
                var a = document.getElementById("A_Open").checked
                var b = document.getElementById("B_Open").checked
                var c = document.getElementById("C_Open").checked
                var d = document.getElementById("D_Open").checked
                var e = document.getElementById("E_Open").checked
            //    console.log(a)
                var _arrType = ['A', 'B', 'C', 'D', 'E']
                var _arrTypeStatus = [a.toString(), b.toString(), c.toString(), d.toString(), e.toString()]
                for (var i_t = 0; i_t < _arrType.length; i_t++) {
                    for (var i = 0; i < _costId.length; i++) {
                        if (_visitortype == _costId[i].visitorType) {
                            if (_costId[i].costType == _arrType[i_t]) {

                                EditCost(userId, _visitortype, _costId[i].costId, _arrType[i_t], JSON.stringify(_costId[i].costTime).toString().replace('[', '').replace(']', ''), JSON.stringify(_costId[i].costRate).toString().replace('[', '').replace(']', ''), _costId[i].fine, _arrTypeStatus[i_t])
                                break;
                            }
                        }
                    }
                }
                return;
            });

            $('#table1').on('click', 'tbody td i.add', function (e) {
                var table = $('#table1').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }
            //    console.log(data.visitorType)
                _visitortype = data.visitorType;
                $("#h_type").text('ประเภท ' + data.visitorType);
                $("#myModal").modal();
            });

            $('#submituploadfile').on('click', function (e) {
                // var file_data = $('#fileToUpload').prop('files')[0];
                var fileUpload = document.getElementById("fileToUpload");
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                var costTime = '';
                if (regex.test(fileUpload.value.toLowerCase())) {
                    if (typeof (FileReader) != "undefined") {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var rows = e.target.result.split("\n");
                            //for (var i = 0; i < rows.length; i++) {
                            var cellsTime = rows[0].split(",");
                            var cellsRate = rows[1].split(",");
                            //   console.log(cells)

                            var _s = cellsTime[0].split(":")
                            var _scell = parseInt(_s[1])
                            var _cost = '';
                            var _cost1 = '';
                            for (var i = 1; i < cellsTime.length - 1; i++) {

                                _cost += (parseInt(cellsTime[i]) * 60).toString() + ','
                                _cost1 += (cellsRate[i]).toString() + ','
                            }

                            var _fine = parseInt(cellsRate[73])
                            var _costRate = cellsRate[0] + ',' + _cost1
                            var _costTime = _scell + ',' + _cost

                            _costRate = _costRate.substring(0, _costRate.length - 1)
                            _costTime = _costTime.substring(0, _costTime.length - 1)
                            // console.log(_costRate)
                            // console.log(_costTime)


                            var a = document.getElementById("AAA").checked
                            var a1 = document.getElementById("A_1").checked

                            var b = document.getElementById("BBB").checked
                            var b1 = document.getElementById("B_1").checked

                            var c = document.getElementById("CCC").checked
                            var c1 = document.getElementById("C_1").checked

                            var d = document.getElementById("DDD").checked
                            var d1 = document.getElementById("D_1").checked

                            var e = document.getElementById("EEE").checked
                            var e1 = document.getElementById("E_1").checked

                            var _checkoutStatus = 'false';
                            if (a == true) {
                                if (a1 == true) {
                                    _checkoutStatus = 'true'
                                }

                                SettingCost(userId, _visitortype, 'A', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (b == true) {
                                if (b1 == true) {
                                    _checkoutStatus = 'true'
                                }
                                SettingCost(userId, _visitortype, 'B', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (c == true) {
                                if (c1 == true) {
                                    _checkoutStatus = 'true'
                                }
                                SettingCost(userId, _visitortype, 'C', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (d == true) {
                                if (d1 == true) {
                                    _checkoutStatus = 'true'
                                }
                                SettingCost(userId, _visitortype, 'D', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (e == true) {
                                if (e1 == true) {
                                    _checkoutStatus = 'true'
                                }
                                SettingCost(userId, _visitortype, 'E', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }
                        }

                        reader.readAsText(fileUpload.files[0]);
                    } else {
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    //  alert("กรุณาเลือกไฟล์ .csv ก่อนกดปุ่มอัพโหลด");
                    document.getElementById("p_check").innerText = 'กรุณาเลือกไฟล์ .csv ก่อนกดปุ่มอัพโหลด'
                }
            });

            $('#table1').on('click', 'tbody td i.edit', function (e) {
                document.getElementById("p_check").innerText = ''
                var table = $('#table1').DataTable();
                e.preventDefault();
                var _ro = table.row($(this).parents('tr'));
                var data = _ro.data();

                if (data == undefined) {
                    data = table.row(this).data();
                }

                _costId = JSON.parse(edit_cost);

                _visitortype = data.visitorType;

                $('#radio_A').attr('disabled', true);
                $('#radio_B').attr('disabled', true);
                $('#radio_C').attr('disabled', true);
                $('#radio_D').attr('disabled', true);
                $('#radio_E').attr('disabled', true);

                // $("#radio_C")
                document.getElementById("radio_C").style.re = 'none';
                for (var i = 1; i < _costId.length; i++) {
                    // console.log(_costId[i].costType)
                    if (_visitortype == _costId[i].visitorType) {

                        if (_costId[i].costType == 'A') {

                            $('#radio_A').attr('disabled', false);
                        }
                        if (_costId[i].costType == 'B') {
                            $('#radio_B').attr('disabled', false);
                        }
                        if (_costId[i].costType == 'C') {
                            $('#radio_C').attr('disabled', false);
                        }
                        if (_costId[i].costType == 'D') {
                            $('#radio_D').attr('disabled', false);
                        }
                        if (_costId[i].costType == 'E') {
                            $('#radio_E').attr('disabled', false);
                        }
                    }
                }


                $("#h_Edittype").text('ประเภท ' + data.visitorType);
                $("#myModalEdit").modal();



            });






            $('#updateuploadfile').on('click', function (e) {
           //     console.log('ffffffffffffffffffffff')
                // var file_data = $('#fileToUpload').prop('files')[0];
                var fileUpload = document.getElementById("fileToUploadEdit");
                var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
                var costTime = '';
                if (regex.test(fileUpload.value.toLowerCase())) {
                    if (typeof (FileReader) != "undefined") {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var rows = e.target.result.split("\n");
                            //for (var i = 0; i < rows.length; i++) {
                            var cellsTime = rows[0].split(",");
                            var cellsRate = rows[1].split(",");
                            //   console.log(cells)

                            var _s = cellsTime[0].split(":")
                            var _scell = parseInt(_s[1])
                            var _cost = '';
                            var _cost1 = '';
                            for (var i = 1; i < cellsTime.length - 1; i++) {

                                _cost += (parseInt(cellsTime[i]) * 60).toString() + ','
                                _cost1 += (cellsRate[i]).toString() + ','
                            }



                            var _fine = parseInt(cellsRate[73])
                            var _costRate = cellsRate[0] + ',' + _cost1
                            var _costTime = _scell + ',' + _cost

                            _costRate = _costRate.substring(0, _costRate.length - 1)
                            _costTime = _costTime.substring(0, _costTime.length - 1)


                            //  _costRate = _costRate.replace(';',',')
                            //  _costTime = _costTime.replace(';',',')

                        //    console.log(_costRate)
                        //    console.log(_costTime)
                            //  return;
                        //    console.log(_costId)
                         //   console.log(_visitortype)


                            var a = document.getElementById("radio_A").checked
                            var b = document.getElementById("radio_B").checked
                            var c = document.getElementById("radio_C").checked
                            var d = document.getElementById("radio_D").checked
                            var e = document.getElementById("radio_E").checked

                            var edit_enable = document.getElementById("edit_enable").checked
                            var _checkoutStatus = 'false';
                            var val_costId = '';
                            if (a == true) {
                                for (var i = 1; i < _costId.length - 1; i++) {
                                    if (_visitortype == _costId[i].visitorType) {
                                        if (_costId[i].costType == 'A') {
                                   //         console.log(_costId[i])
                                            val_costId = _costId[i].costId
                                        }
                                    }
                                }
                                if (edit_enable == true) {
                                    _checkoutStatus = 'true'
                                }
                                EditCost(userId, _visitortype, val_costId, 'A', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (b == true) {
                                for (var i = 1; i < _costId.length - 1; i++) {
                                    if (_visitortype == _costId[i].visitorType) {
                                        if (_costId[i].costType == 'B') {
                                    //        console.log(_costId[i])
                                            val_costId = _costId[i].costId
                                        }
                                    }
                                }
                                if (edit_enable == true) {
                                    _checkoutStatus = 'true'
                                }
                                EditCost(userId, _visitortype, val_costId, 'B', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (c == true) {
                                for (var i = 1; i < _costId.length - 1; i++) {
                                    if (_visitortype == _costId[i].visitorType) {
                                        if (_costId[i].costType == 'C') {
                                       //     console.log(_costId[i])
                                            val_costId = _costId[i].costId
                                        }
                                    }
                                }
                                if (edit_enable == true) {
                                    _checkoutStatus = 'true'
                                }
                                EditCost(userId, _visitortype, val_costId, 'C', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (d == true) {
                                for (var i = 1; i < _costId.length - 1; i++) {
                                    if (_visitortype == _costId[i].visitorType) {
                                        if (_costId[i].costType == 'D') {
                                       //     console.log(_costId[i])
                                            val_costId = _costId[i].costId
                                        }
                                    }
                                }
                                if (edit_enable == true) {
                                    _checkoutStatus = 'true'
                                }
                                EditCost(userId, _visitortype, val_costId, 'D', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }

                            if (e == true) {
                                for (var i = 1; i < _costId.length - 1; i++) {
                                    if (_visitortype == _costId[i].visitorType) {
                                        if (_costId[i].costType == 'E') {
                                        //    console.log(_costId[i])
                                            val_costId = _costId[i].costId
                                        }
                                    }
                                }
                                if (edit_enable == true) {
                                    _checkoutStatus = 'true'
                                }
                                EditCost(userId, _visitortype, val_costId, 'E', _costTime, _costRate, _fine, _checkoutStatus)
                                _checkoutStatus = 'false';
                            }
                        }
                        reader.readAsText(fileUpload.files[0]);
                    } else {
                        alert("This browser does not support HTML5.");
                    }
                } else {
                    //  alert("กรุณาเลือกไฟล์ .csv ก่อนกดปุ่มอัพโหลด");
                    document.getElementById("p_checkEdit").innerText = 'กรุณาเลือกไฟล์ .csv ก่อนกดปุ่มอัพโหลด'
                }
            });
        }).catch(function (res) {
            const { response } = res
          //  console.log(response.data)
        });
    });
}

$(async function () {
    const result = await acctoken();
   // console.log(result)
    const responsevisitorType = await getvisitorType(result);
    const responseLog = await getvisitorCost(result, responsevisitorType);


    //console.log(responsevisitorType)
    var $select = $('#visitor_type');
    $select.find('option').remove();
    $select.append('<option value=' + 0 + '>' + '-- เลือกประเภท --' + '</option>');
    $.each(responsevisitorType, function (key, value) {
        $select.append('<option value=' + value + '>' + value + '</option>');
    });



    $('#visitor_type').on('change', async function (e) {

        $('#tableA').DataTable().destroy();
        $('#tableB').DataTable().destroy();
        $('#tableC').DataTable().destroy();
        $('#tableD').DataTable().destroy();
        $('#tableE').DataTable().destroy();

        document.getElementById("p_visitor_type").innerText = ''
        var _select_type = document.getElementById("visitor_type").value
        // console.log(_select_type)
        _costId = JSON.parse(edit_cost);
        // console.log(_costId)
        _visitortype = _select_type;
        var _arrType = ['A', 'B', 'C', 'D', 'E']
        // var costType;
        // var costTime;
        // var costRate;
        var _arrview = new Array();
        var _n = 0;
        var Aobj = new Array();
        var Aobj2 = new Array();
        var Bobj = new Array();
        var Bobj2 = new Array();
        var Cobj = new Array();
        var Cobj2 = new Array();
        var Dobj = new Array();
        var Dobj2 = new Array();
        var Eobj = new Array();
        var Eobj2 = new Array();
        var _arr_costTime = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14']
        var _arr_costRate = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11', 'a12', 'a13', 'a14']
        for (var i_t = 0; i_t < _arrType.length; i_t++) {
            for (var i = 0; i < _costId.length; i++) {
                if (_visitortype == _costId[i].visitorType) {
                    if (_costId[i].costType == _arrType[i_t]) {

                        if (_costId[i].costType == "A") {
                         //   console.log(_costId[i].costType)
                         //   console.log(_costId[i].costTime)
                         //   console.log(_costId[i].costRate)
                            document.getElementById("p_visitor_type").innerText = ''
                            for (var i_view = 0; i_view < 75; i_view++) {
                                // console.log(_costId[i].costTime[i_view])
                                if (i_view == 0) {
                                    Aobj[i_view] = timeConvert(_costId[i].costTime[i_view])
                                } else {
                                    Aobj[i_view] = [i_view];
                                    if (i_view == 73) {
                                        // console.log(_costId[i].fine)
                                        Aobj[i_view] = 'ปรับ'
                                    }
                                }
                            }
                            for (var i_view = 0; i_view < 75; i_view++) {
                                Aobj2[i_view] = _costId[i].costRate[i_view];
                                if (i_view == 73) {
                                    // console.log(_costId[i].fine)
                                    Aobj2[i_view] = _costId[i].fine
                                }
                            }
                        }


                        if (_costId[i].costType == "B") {
                          //  console.log(_costId[i].costType)
                          //  console.log(_costId[i].costTime)
                          //  console.log(_costId[i].costRate)
                            document.getElementById("p_visitor_type").innerText = ''
                            for (var i_view = 0; i_view < 75; i_view++) {
                                // console.log(_costId[i].costTime[i_view])
                                if (i_view == 0) {
                                    Bobj[i_view] = timeConvert(_costId[i].costTime[i_view])
                                } else {
                                    Bobj[i_view] = [i_view];
                                    if (i_view == 73) {
                                        //  console.log(_costId[i].fine)
                                        Bobj[i_view] = 'ปรับ'
                                    }
                                }
                            }
                            for (var i_view = 0; i_view < 75; i_view++) {
                                Bobj2[i_view] = _costId[i].costRate[i_view];
                                if (i_view == 73) {
                                    //  console.log(_costId[i].fine)
                                    Bobj2[i_view] = _costId[i].fine
                                }
                            }
                        }


                        if (_costId[i].costType == "C") {
                         //   console.log(_costId[i].costType)
                         //   console.log(_costId[i].costTime)
                         //   console.log(_costId[i].costRate)
                            document.getElementById("p_visitor_type").innerText = ''
                            for (var i_view = 0; i_view < 75; i_view++) {

                                if (i_view == 0) {
                                    Cobj[i_view] = timeConvert(_costId[i].costTime[i_view])
                                } else {
                                    Cobj[i_view] = [i_view];
                                    if (i_view == 73) {

                                        Cobj[i_view] = 'ปรับ'
                                    }
                                }
                            }
                            for (var i_view = 0; i_view < 75; i_view++) {
                                Cobj2[i_view] = _costId[i].costRate[i_view];
                                if (i_view == 73) {

                                    Cobj2[i_view] = _costId[i].fine
                                }
                            }
                        }


                        if (_costId[i].costType == "D") {
                         //   console.log(_costId[i].costType)
                         //   console.log(_costId[i].costTime)
                         //   console.log(_costId[i].costRate)
                            document.getElementById("p_visitor_type").innerText = ''
                            for (var i_view = 0; i_view < 75; i_view++) {

                                if (i_view == 0) {
                                    Dobj[i_view] = timeConvert(_costId[i].costTime[i_view])
                                } else {
                                    Dobj[i_view] = [i_view];
                                    if (i_view == 73) {

                                        Dobj[i_view] = 'ปรับ'
                                    }
                                }
                            }
                            for (var i_view = 0; i_view < 75; i_view++) {
                                Dobj2[i_view] = _costId[i].costRate[i_view];
                                if (i_view == 73) {

                                    Dobj2[i_view] = _costId[i].fine
                                }
                            }
                        }


                        if (_costId[i].costType == "E") {
                          //  console.log(_costId[i].costType)
                          //  console.log(_costId[i].costTime)
                         //   console.log(_costId[i].costRate)
                            document.getElementById("p_visitor_type").innerText = ''
                            for (var i_view = 0; i_view < 75; i_view++) {
                                if (i_view == 0) {
                                    Eobj[i_view] = timeConvert(_costId[i].costTime[i_view])
                                } else {
                                    Eobj[i_view] = [i_view];
                                    if (i_view == 73) {

                                        Eobj[i_view] = 'ปรับ'
                                    }
                                }
                            }
                            for (var i_view = 0; i_view < 75; i_view++) {
                                Eobj2[i_view] = _costId[i].costRate[i_view];
                                if (i_view == 73) {

                                    Eobj2[i_view] = _costId[i].fine
                                }
                            }
                        }

                        break;
                    }

                } else {

                    document.getElementById("p_visitor_type").innerText = 'ประเภทนี้ยังไม่ได้สร้าง การคิดเงิน'

                }

            }

        }

        var _view = new Array();
        var nn = 0;
        $('#tableA').DataTable().destroy();
        if (Aobj.length != 0) {
            /////////////////////////////////////  A
           
            for (var i = 0; i < 74; i++) {
                _view[nn] = {
                    _t: Aobj[i],
                    _r: Aobj2[i]
                }
                nn = nn + 1;
            }
        }else{
            for (var i = 0; i < 74; i++) {
                _view[nn] = {
                    _t: '00:00',
                    _r: '0'
                }
                nn = nn + 1;
            }
        }
        $('#tableA').DataTable({
            "pageLength": 20,
            "bPaginate": false,
            "bLengthChange": false,
            "bInfo": false,
            "bAutoWidth": false,
            "searching": false,
            'data': _view,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_t" },
                { data: "_r" },
            ]
        });




        /////////////////////////////////////  B
        var _viewB = new Array();
        nn = 0;
       
        $('#tableB').DataTable().destroy();
        if (Bobj.length != 0) {

            for (var i = 0; i < 74; i++) {
                _viewB[nn] = {
                    _t: Bobj[i],
                    _r: Bobj2[i]
                }
                nn = nn + 1;
            }
        }else{
            _viewB[nn] = {
                _t: '00:00',
                _r: '0'
            }
            nn = nn + 1;
        }

        $('#tableB').DataTable({
            "pageLength": 20,
            "bPaginate": false,
            "bLengthChange": false,
            "bInfo": false,
            "bAutoWidth": false,
            "searching": false,
            'data': _viewB,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_t" },
                { data: "_r" },
            ]
        });

        /////////////////////////////////////  C
        var _viewC = new Array();
        nn = 0;
       
        $('#tableC').DataTable().destroy();
        if (Cobj.length != 0) {
            for (var i = 0; i < 74; i++) {
                _viewC[nn] = {
                    _t: Cobj[i],
                    _r: Cobj2[i]
                }
                nn = nn + 1;
            }
           
        }else{
            for (var i = 0; i < 74; i++) {
                _viewC[nn] = {
                    _t: '00:00',
                    _r: '0'
                }
                nn = nn + 1;
            }
        }
        $('#tableC').DataTable({
            "pageLength": 20,
            "bPaginate": false,
            "bLengthChange": false,
            "bInfo": false,
            "bAutoWidth": false,
            "searching": false,
            'data': _viewC,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_t" },
                { data: "_r" },
            ]
        });




        /////////////////////////////////////  D
        var _viewD = new Array();
        nn = 0;
       
        $('#tableD').DataTable().destroy();
        if (Dobj.length != 0) {
            for (var i = 0; i < 74; i++) {
                _viewD[nn] = {
                    _t: Dobj[i],
                    _r: Dobj2[i]
                }
                nn = nn + 1;
            }
            
        }else{
            for (var i = 0; i < 74; i++) {
                _viewD[nn] = {
                    _t: '00:00',
                    _r: '0'
                }
                nn = nn + 1;
            }
        }
        $('#tableD').DataTable({
            "pageLength": 20,
            "bPaginate": false,
            "bLengthChange": false,
            "bInfo": false,
            "bAutoWidth": false,
            "searching": false,
            'data': _viewD,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_t" },
                { data: "_r" },
            ]
        });


        /////////////////////////////////////  E
        var _viewE = new Array();
        nn = 0;
      
        $('#tableE').DataTable().destroy();
        if (Eobj.length != 0) {
            for (var i = 0; i < 74; i++) {
                _viewE[nn] = {
                    _t: Eobj[i],
                    _r: Eobj2[i]
                }
                nn = nn + 1;
            }
            
        }else{
            for (var i = 0; i < 74; i++) {
                _viewE[nn] = {
                    _t: '00:00',
                    _r: '0'
                }
                nn = nn + 1;
            }
        }
        $('#tableE').DataTable({
            "pageLength": 20,
            "bPaginate": false,
            "bLengthChange": false,
            "bInfo": false,
            "bAutoWidth": false,
            "searching": false,
            'data': _viewE,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "_t" },
                { data: "_r" },
            ]
        });
    });

});

async function SettingCost(userId, val_visitorType, val_costType, val_costTime, val_costRate, val_fine, val_checkoutStatus) {
    const result = await acctoken();
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        const datacost = {
            userId: userId,
            visitorType: val_visitorType,
            costType: val_costType,
            costTime: val_costTime,
            costRate: val_costRate,
            fine: val_fine,
            checkoutStatus: val_checkoutStatus
        }
       // console.log(datacost)
        axios.post(urlipaddress + 'cost', datacost, {
            headers: {
                'Authorization': result
            }
        }
        ).then(function (response) {
          //  console.log(response)
            location.href = "visitorcost.html";

        }).catch(function (res) {
            const { response } = res
           // console.log(response.data.message)
        });
    });
}
async function EditCost(userId, val_visitorType, val_costId, val_costType, val_costTime, val_costRate, val_fine, val_checkoutStatus) {
    const result = await acctoken();
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        const datacost = {
            userId: userId,
            visitorType: val_visitorType,
            costId: val_costId,
            costType: val_costType,
            costTime: val_costTime,
            costRate: val_costRate,
            fine: val_fine,
            checkoutStatus: val_checkoutStatus
        }
      //  console.log(datacost)
        axios.put(urlipaddress + 'updateCost', datacost, {
            headers: {
                'Authorization': result
            }
        }
        ).then(function (response) {
        //    console.log(response)
            location.href = "visitorcost.html";
        }).catch(function (res) {
            const { response } = res
        //    console.log(response.data.message)
        });
    });
}





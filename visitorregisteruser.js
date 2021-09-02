var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var IDUSER = JSON.parse(Cookies.get('datajwt'));

var _arr = new Array();
var _arrInfo = new Array();
var n = 0;
var n_info = 0;


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

function showCancelMessageregisteruser(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function(isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}

function showSuccessMessageregisteruser(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function(isConfirm) {
        if (isConfirm) {
            location.href = "visitorregisteruser.html";
        }
    });
}

function getUser(refresh_token) {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const dataUserID = {
            userId: IDUSER.userId
        }
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            var cnt = response.data.message.data.length;

            var n = 0;
            var num = 1;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {
                var _rule = response.data.message.data[i].rule.toLowerCase()
                    //    console.log(_rule)
                if (_rule != "master admin" && _rule != "member") {
                    _arr[n] = {
                        _num: num,
                        _user: response.data.message.data[i].username,
                        _type: response.data.message.data[i].rule,
                        _registerDate: response.data.message.data[i].registerDate,
                        imageProfile: response.data.message.data[i].imageProfile
                    }
                    num++
                    n = n + 1
                }
            }


            $('#table1').DataTable().destroy();
            $('#table1').DataTable({
                "lengthMenu": [
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1],
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]
                ],
                "pageLength": 50,
                'data': _arr,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                "paging": true,
                "ordering": true,
                "searching": true,
                "info": true,
                columns: [
                    { data: "_num" },
                    { data: "_user" },
                    { data: "_type" },
                    {
                        data: "_registerDate",
                        render: function(data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="resetPass" style="font-size:16px;color:orange; cursor: pointer;">รีเซ็ตรหัสผ่าน </i>/<i href="" class="editor" style="font-size:16px;color:green; cursor: pointer;">เปลี่ยนรหัสผ่าน </i>  / <i href="" class="edituser" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i> / <i href="" class="remove" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                            /// <i href="" class="edituser" style="font-size:14px;color:green; cursor: pointer;">แก้ไข</i> / 
                    }
                ]
            });



            $(document).ready(function() {
                $('#table1').on('click', 'i.editor', function(e) {
                    e.preventDefault();
                    var table = $('#table1').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }

                    $("#myModaledit").modal();
                    // console.log(data._user)
                    document.getElementById("user_edit").value = data._user;
                    document.getElementById("passuser_old").value = "";
                    document.getElementById("passuser_new").value = "";
                    document.getElementById("update").innerText = "";

                });

                var data;
                $('#table1').on('click', 'i.remove', function(e) {
                    e.preventDefault();
                    var table = $('#table1').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    data = _ro.data();
                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    $("#myModaldelete").modal();
                    document.getElementById("user_edit").value = data._user;
                    document.getElementById("passuser_old").value = "";
                    document.getElementById("passuser_new").value = "";
                    document.getElementById("update").innerText = "";
                    $("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

                });





                /////////////////////อัพเดท Password
                $('#UPDATE').on('click', function(e) {

                    if ($('#passuser_new').val() == $('#passuser_confirm').val()) {
                        console.log('Matching')

                    } else {
                        showCancelMessageregisteruser('รหัสผ่านใหม่ไม่ตรงกัน', 'รหัสผ่านใหม่ไม่ตรงกัน กรุณาระบุ รหัสให้ตรงกัน')
                        return
                    }



                    $.getScript("ip.js", function(data, textStatus, jqxhr) {
                        var urlipaddress = data.substring(1, data.length - 1);
                        const dataUser = {
                                userId: IDUSER.userId,
                                username: document.getElementById("user_edit").value,
                                password: document.getElementById("passuser_old").value,
                                newPassword: document.getElementById("passuser_new").value,
                            }
                            //  console.log(dataUser)
                        axios.post(urlipaddress + 'changePass', dataUser, {
                            headers: {
                                'Authorization': refresh_token
                            }
                        }).then(function(response) {
                            //    console.log(response.data)
                            if (response.data.message == "Change password is complete.") {
                                showSuccessMessageregisteruser('อัพเดทข้อมูลสำเร็จ')
                                    // document.getElementById("update").innerText = "อัพเดทสำเร็จ";
                                    // document.getElementById("update").style.color = "green";

                                // location.href = "visitorregisteruser.html";
                            }

                        }).catch(function(res) {
                            const { response } = res
                            //   console.log(response.data.message)
                            if (response.data.message == "update fail.") {
                                showCancelMessageregisteruser('บันทึกข้อมูลไม่สำเร็จ', '')
                                    // alert("บันทึกข้อมูลไม่สำเร็จ");
                                    // document.getElementById("update").innerText = "";
                                    // document.getElementById("update").style.color = "red";
                            }
                            if (response.data.message == "Wrong user or password") {

                                showCancelMessageregisteruser('รหัสผ่านเดิมไม่ถูกต้อง', '')
                                    // document.getElementById("update").innerText = "รหัสผ่านเดิม ไม่ถูกต้อง !!!";
                                    // document.getElementById("update").style.color = "red";
                            }

                        });
                    });
                });
                /////////////////////ลบ
                $('#deleteUser').on('click', function(e) {
                    //console.log('adadasda' + decodejwt.userId)

                    $.getScript("ip.js", function(data, textStatus, jqxhr) {
                        var urlipaddress = data.substring(1, data.length - 1);

                        //  console.log(document.getElementById("user_edit").value)
                        //   console.log(IDUSER.userId)
                        axios({
                            url: urlipaddress + 'delPass',
                            method: 'delete',
                            data: {
                                userId: IDUSER.userId,
                                userName: document.getElementById("user_edit").value
                            },
                            headers: { 'Authorization': refresh_token }
                        }).then(function(response) {
                            //   console.log(response.data)
                            if (response.data.message == "delete completed") {
                                showSuccessMessageregisteruser('ลบข้อมูลสำเร็จ')
                                    // document.getElementById("c_delete").style.display = "none";
                                    // document.getElementById("completed").style.display = "block";
                                    // $("#lbl_completed").text('ลบข้อมูลสำเร็จ');
                                    // location.href = "visitorregisteruser.html";

                            }

                        }).catch(function(res) {
                            const { response } = res
                            //  console.log(response.data.message)
                        });
                    });
                });
            });

        }).catch(function(res) {
            const { response } = res
            //    console.log(response.data.message)
            //     if (response.data.message == "Unauthorized") {
            //         location.href = "index.html";
            //     }
        });
    });
}

function validateUsernameUSER() {
    // var reg = /^-?\d*\.?\d*$/;
    var regexNumber = /\d/; //ตรวจสอบว่าเป็นตัวเลข
    var regexLetter_A = /[a-z]/; // ตรวจสอบว่า เป็นตัวอักษรภาษาอังกฤษ ทั้งพิมพ์ใหญ่และพิมพ์เล็ก
    var regexLetter_a = /[A-Z]/;
    var regExpStrong = /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
    var checkpassadmin = document.getElementById('passuser').value;
    if (regexLetter_A.test(checkpassadmin) && (regexLetter_a.test(checkpassadmin)) && (regexNumber.test(checkpassadmin)) && (regExpStrong.test(checkpassadmin))) {
        return true;
    } else {
        document.getElementById("save").innerText = "ใช้อักขระ [A-Z,a-z,0-9] และสัญลักษณ์ผสมกัน";
        document.getElementById("save").style.color = "red";
        return false;
    }
}

function validateUsernameUSERMEMBER() {
    // var reg = /^-?\d*\.?\d*$/;
    var regexNumber = /\d/; //ตรวจสอบว่าเป็นตัวเลข
    var regexLetter_A = /[a-z]/; // ตรวจสอบว่า เป็นตัวอักษรภาษาอังกฤษ ทั้งพิมพ์ใหญ่และพิมพ์เล็ก
    var regexLetter_a = /[A-Z]/;
    var regExpStrong = /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/;
    var checkpassadmin = document.getElementById('passuser2').value;
    if (regexLetter_A.test(checkpassadmin) && (regexLetter_a.test(checkpassadmin)) && (regexNumber.test(checkpassadmin)) && (regExpStrong.test(checkpassadmin))) {
        return true;
    } else {
        document.getElementById("save2").innerText = "ใช้อักขระ [A-Z,a-z,0-9] และสัญลักษณ์ผสมกัน";
        document.getElementById("save2").style.color = "red";
        return false;
    }
}


$(async function() {
    const result = await acctoken();


    ///////////////////////// GetProfile ใหม่
    if (Cookies.get('datamember') != undefined) {
        var datamember = Cookies.get('datamember');
        if (datamember.rule = 'member') {
            datamember = JSON.parse(datamember)
            console.log(datamember)

            const dataUserID = {
                userId: userId
            }
            $.getScript("ip.js", function(data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);
                axios.post(urlipaddress + 'user', dataUserID, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function(response) {
                    var cnt = response.data.message.data.length;
                    for (i = 0; i < cnt; i++) {
                        if (response.data.message.data[i].username == datamember.username) {
                            if (response.data.message.data[i].rule == "member") {

                                Cookies.remove('datamember');
                                Cookies.set('datamember', JSON.stringify(response.data.message.data[i]), { expires: 1 })
                                return;
                            }
                        }
                    }
                });
            });
        }
        return;
    }



    getUser(result);
    getUsermember(result);


    /////////////////////////////////// ผู้ใช้งานเจ้าหน้าที่
    $('#submitvisitorRegis').on('click', async function(e) {

        var masteradmin = JSON.parse(Cookies.get('datamemberID'));
        masteradmin = masteradmin.username.split('@')

        var chk_pass = validateUsernameUSER();
        if (chk_pass == false) {
            return;
        }

        document.getElementById("save").innerText = "";
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var formData = new FormData();
            var file_data = $('#fileimageadmin').prop('files')[0];
            if (file_data != undefined) {
                formData.append('imageProfile', file_data);
            } else {
                formData.append('imageProfile', '');
            }
            const url = urlipaddress + 'addAccount';
            formData.append('userId', userId);

            if (masteradmin[1] == undefined) {
                formData.append('username', document.getElementById("user").value);
            } else {
                formData.append('username', document.getElementById("user").value + '@' + masteradmin[1]);
            }

            formData.append('password', document.getElementById("passuser").value);
            formData.append('rule', document.getElementById("rule").value);
            formData.append('editMode', false);
            console.log(url)
            axios.put(url, formData, {
                headers: {
                    'Authorization': result,
                    'Content-Type': 'multipart/form-data'

                }
            }).then(function(response) {
                console.log(response.data.message)
                if (response.data.message == "This user has already been used.") {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')

                    // document.getElementById("save").innerText = "มีข้อมูลในระบบแล้ว";
                    // document.getElementById("save").style.color = "red";
                } else {
                    // document.getElementById("save").innerText = "บันทึกสำเร็จ";
                    // document.getElementById("save").style.color = "green";
                    showSuccessMessageregisteruser('บันทึกสำเร็จ')
                    getUser(result);
                }

            }).catch(function(res) {
                const { response } = res
                // console.log(response.data.message)
                if (response.data.message == 'This user has already been used.') {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                        //     document.getElementById("save").innerText = "มีข้อมูลในระบบแล้ว";
                        //     document.getElementById("save").style.color = "red";
                }
            });
        });
    });


    /////////////////////////////////// ผู้ใช้งาน   Member
    $('#submitvisitorRegis2').on('click', async function(e) {
        $("#viewImage").empty();
        var chk_pass = validateUsernameUSERMEMBER();
        if (chk_pass == false) {
            return;
        }
        var masteradmin = JSON.parse(Cookies.get('datamemberID'));
        masteradmin = masteradmin.username.split('@')
        console.log(masteradmin[1])
        document.getElementById("save2").innerText = "";
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var formData = new FormData();
            var file_data = $('#fileimage').prop('files')[0];
            if (file_data != undefined) {
                formData.append('imageProfile', file_data);
            } else {
                formData.append('imageProfile', '');
            }
            const url = urlipaddress + 'addAccount';
            formData.append('userId', userId);

            if (masteradmin[1] == undefined) {
                formData.append('username', document.getElementById("user2").value);
            } else {
                formData.append('username', document.getElementById("user2").value + '@' + masteradmin[1]);
            }

            formData.append('password', document.getElementById("passuser2").value);
            formData.append('rule', 'member');
            formData.append('phone', document.getElementById("phone").value);
            formData.append('houseNo', document.getElementById("houseNo").value);
            var _sp = document.getElementById("tag").value.split(',')
            for (i = 0; i < _sp.length; i++) {
                formData.append('tag[]', _sp[i]);
            }
            formData.append('address', document.getElementById("address").value);
            formData.append('editMode', false);

            axios.put(url, formData, {
                headers: {
                    'Authorization': result,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response) {
                // console.log(response.data.message)
                if (response.data.message == "This user has already been used.") {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                        // document.getElementById("save2").innerText = "มีข้อมูลในระบบแล้ว";
                        // document.getElementById("save2").style.color = "red";
                } else {
                    //  console.log(response.data.message)
                    showSuccessMessageregisteruser('บันทึกสำเร็จ')
                        // document.getElementById("save2").innerText = "บันทึกสำเร็จ";
                        // document.getElementById("save2").style.color = "green";
                    getUsermember(result);
                }

            }).catch(function(res) {
                const { response } = res
                // console.log(response.data.message)

                if (response.data.message == 'This user has already been used.') {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                        // document.getElementById("save2").innerText = "มีข้อมูลในระบบแล้ว";
                        // document.getElementById("save2").style.color = "red";
                }
            });
        });
    });


    $('#submitcategoryexcelfile').on('click', async function(e) {

        await ExportToTable();

    });


    var datausername;
    $('#table1').on('click', 'i.resetPass', function(e) {
        e.preventDefault();
        var table = $('#table1').DataTable();
        var _ro = table.row($(this).parents('tr'));
        datausername = _ro.data();

        if (datausername == undefined) {
            datausername = table.row(this).data();
        }
        document.getElementById('lbl_reset_completedmember').innerText = 'คุณต้องการ รีเซ็ต รหัสผ่านใช่หรือไม่'
        $("#myModalresetpass").modal();

    });
    var _member;
    $('#table2').on('click', 'i.resetPass', function(e) {
        e.preventDefault();
        var table = $('#table2').DataTable();
        var _ro = table.row($(this).parents('tr'));
        _member = _ro.data();

        if (_member == undefined) {
            _member = table.row(this).data();
        }

        console.log(_member)
        document.getElementById('lbl_reset_completedmember').innerText = 'คุณต้องการ รีเซ็ต รหัสผ่านใช่หรือไม่'
        $("#myModalresetpass").modal();

    });

    ///////////////////////// reset password Admin
    $('#rsetPass_Admin').on('click', async function(e) {

        console.log(datausername)

        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var dataUserID;
            if (_member != undefined) {
                dataUserID = {
                    userId: IDUSER.userId,
                    username: _member.username
                }
            } else {
                dataUserID = {
                    userId: IDUSER.userId,
                    username: datausername._user
                }
            }

            axios.post(urlipaddress + 'resetPass', dataUserID, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                if (response.data.message == 'Reset password is complete.') {
                    $("#myModalresetpass").empty();
                    showSuccessMessageregisteruser('รีเซ็ตรหัสผ่าน สำเร็จ รหัสผ่านคือ  Password@2 ')
                }
            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
            });
        });
    });
});


async function ExportToTable() {
    var fileUpload = $("#excelfile")[0];
    //Validate whether File is valid Excel file.
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof(FileReader) != "undefined") {
            var reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
                reader.onload = function(e) {
                    ProcessExcel(e.target.result);
                };
                reader.readAsBinaryString(fileUpload.files[0]);
            } else {
                //For IE Browser.
                reader.onload = async function(e) {
                    var data = "";
                    var bytes = new Uint8Array(e.target.result);
                    for (var i = 0; i < bytes.byteLength; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    await ProcessExcel(data);

                    console.log(data)
                };
                reader.readAsArrayBuffer(fileUpload.files[0]);
            }
            console.log('fffffffffffffffffffffffffffff')
            showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
        } else {
            // alert("This browser does not support HTML5.");
            showCancelMessageregisteruser('This browser does not support HTML5.', '')
        }
    } else {
        // alert("Please upload a valid Excel file.");
        showCancelMessageregisteruser('โปรดอัปโหลดไฟล์ Excel ที่ถูกต้อง !!', '')
    }
}

async function ProcessExcel(data) {
    const result = await acctoken();
    //Read the Excel File data.
    var workbook = XLSX.read(data, {
        type: 'binary'
    });

    //Fetch the name of First Sheet.
    var firstSheet = workbook.SheetNames[0];
    var masteradmin = JSON.parse(Cookies.get('datamemberID'));
    masteradmin = masteradmin.username.split('@')
    console.log(masteradmin[1])
        //Read all rows from First Sheet into an JSON array.
    var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        //Add the data rows from Excel file.
        for (var i = 0; i < excelRows.length; i++) {
            var _u = excelRows[i].username + '@' + masteradmin[1]
            var _p = excelRows[i].password
            var _pho = excelRows[i].phone
            var _ho_no = excelRows[i].houseNo
            var _ta = excelRows[i].tag
            var _add = excelRows[i].address

            //   console.log(_ta)

            var urlipaddress = data.substring(1, data.length - 1);
            var formData = new FormData();
            const url = urlipaddress + 'addAccount';
            formData.append('imageProfile', '');
            formData.append('userId', userId);
            formData.append('username', _u);
            formData.append('password', _p);
            formData.append('rule', 'member');
            formData.append('phone', _pho);
            formData.append('houseNo', _ho_no);
            var _sp = _ta.split(',')

            for (i2 = 0; i2 < _sp.length; i2++) {
                console.log(_sp[i2])
                formData.append('tag[]', _sp[i2]);


            }
            formData.append('address', _add);
            formData.append('editMode', false);
            // console.log(excelRows[i])
            axios.put(url, formData, {
                headers: {
                    'Authorization': result,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response) {
                console.log(response.data.message)
                if (response.data.message == "This user has already been used.") {
                    // showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                } else {
                    // showSuccessMessageregisteruser('บันทึกสำเร็จ', '')
                    //  getUsermember(result);
                }

            }).catch(function(res) {
                const { response } = res

                if (response.data.message == 'This user has already been used.') {
                    showCancelMessageregisteruser('มีข้อมูลในระบบแล้ว', '')
                }
            });

        }
    });

};



////////////////////////////////////////////////   MEMBER
function getUsermember(refresh_token) {
    // console.log(refresh_token)
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const dataUserID = {
                userId: IDUSER.userId
            }
            //   console.log(dataUserID)
        axios.post(urlipaddress + 'user', dataUserID, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            var cnt = response.data.message.data.length;
            console.log(response.data.message.data)
            var n = 0;
            var num = 1;
            var _arr = new Array();
            for (i = 0; i < cnt; i++) {
                var _rule = response.data.message.data[i].rule.toLowerCase()
                    //    console.log(_rule)
                if (_rule == "member") {
                    _arr[n] = {
                        _num: num,
                        houseNo: response.data.message.data[i].houseNo,
                        username: response.data.message.data[i].username,
                        phone: response.data.message.data[i].phone,
                        tag: response.data.message.data[i].tag,
                        address: response.data.message.data[i].address,
                        registerDate: response.data.message.data[i].registerDate,
                        imageProfile: response.data.message.data[i].imageProfile
                    }
                    num++
                    n = n + 1
                }
            }

            const toDate = str => {
                const [d, t] = str.split(' ')
                return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
            };
            const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
            _arr.sort(compareByDate);
            const reversed = _arr.reverse()

            // console.log(_arr)
            $('#table2').DataTable().destroy();
            $('#table2').DataTable({
                "lengthMenu": [
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1],
                    [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]
                ],
                "pageLength": 50,
                'data': reversed,
                "responsive": true,
                "autoWidth": false,
                "order": [],
                "paging": true,
                "ordering": true,
                "searching": true,
                "info": true,
                columns: [
                    // { data: "_num" },
                    { data: "houseNo" },
                    { data: "username" },
                    { data: "phone" },
                    { data: "tag" },
                    { data: "address" },
                    {
                        data: "registerDate",
                        render: function(data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                            if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                return '-';
                            }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="view" style="font-size:16px;color:blue; cursor: pointer;">รูปภาพ </i> '
                    },
                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="resetPass" style="font-size:16px;color:orange; cursor: pointer;">รีเซ็ตรหัสผ่าน </i>/<i href="" class="editor" style="font-size:16px;color:green; cursor: pointer;">เปลี่ยนรหัสผ่าน </i> / <i href="" class="edit_member" style="font-size:16px;color:blue; cursor: pointer;">แก้ไข </i>  / <i href="" class="remove" style="font-size:14px;color:red; cursor: pointer;">ลบ</i> '
                    }
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
                                '<tr class="group"><td colspan="6">' + 'บ้านเลขที่ ' + group + '</td></tr>'
                            );
                            last = group;
                        }
                    });
                }
            });

            $(document).ready(function() {
                $("#viewImage").empty();
                $('#table2').on('click', 'i.view', function(e) {
                    $("#viewImage").empty();
                    var table = $('#table2').DataTable();
                    e.preventDefault();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();
                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    $("#viewImage").empty();
                    $("#myModalview").modal();
                    console.log(data.imageProfile)
                    var nn = 0;
                    for (let i in data.imageProfile) {
                        console.log(data.imageProfile[i])
                        axios.get(urlipaddress + "view/images/" + data.imageProfile[i], {
                            responseType: 'arraybuffer',
                            headers: {
                                'Authorization': refresh_token
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






                $('#table2').on('click', 'i.editor', function(e) {
                    e.preventDefault();
                    var table = $('#table2').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }

                    $("#myModaledit").modal();
                    // console.log(data._user)
                    document.getElementById("user_edit").value = data.username;
                    document.getElementById("passuser_old").value = "";
                    document.getElementById("passuser_new").value = "";
                    document.getElementById("update").innerText = "";

                });





                var data;
                $('#table2').on('click', 'i.remove', function(e) {
                    e.preventDefault();
                    var table = $('#table2').DataTable();
                    var _ro = table.row($(this).parents('tr'));
                    data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }
                    $("#myModaldelete").modal();
                    document.getElementById("user_edit").value = data.username;
                    document.getElementById("passuser_old").value = "";
                    document.getElementById("passuser_new").value = "";
                    document.getElementById("update").innerText = "";
                    $("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

                });



                /////////////////////อัพเดท
                $('#UPDATEmember').on('click', function(e) {

                    if ($('#passuser_newmember').val() == $('#passuser_confirmmember').val()) {
                        console.log('Matching')
                    } else {
                        showCancelMessageregisteruser('รหัสผ่านใหม่ไม่ตรงกัน', 'รหัสผ่านใหม่ไม่ตรงกัน กรุณาระบุ รหัสให้ตรงกัน')

                        return
                    }



                    $.getScript("ip.js", function(data, textStatus, jqxhr) {
                        var urlipaddress = data.substring(1, data.length - 1);
                        const dataUser = {
                            userId: IDUSER.userId,
                            username: document.getElementById("user_editmember").value,
                            password: document.getElementById("passuser_oldmember").value,
                            newPassword: document.getElementById("passuser_newmember").value,
                        }
                        axios.post(urlipaddress + 'changePass', dataUser, {
                            headers: {
                                'Authorization': refresh_token
                            }
                        }).then(function(response) {
                            if (response.data.message == "Change password is complete.") {
                                showSuccessMessageregisteruser('อัพเดทข้อมูลสำเร็จ')
                                    // document.getElementById("updatemember").innerText = "อัพเดทสำเร็จ";
                                    // document.getElementById("updatemember").style.color = "green";

                                // location.href = "visitorregisteruser.html";
                            }

                        }).catch(function(res) {
                            const { response } = res
                            if (response.data.message == "update fail.") {
                                showCancelMessageregisteruser('บันทึกข้อมูลไม่สำเร็จ', '')
                                    // alert("บันทึกข้อมูลไม่สำเร็จ");
                                    // document.getElementById("updatemember").innerText = "";
                                    // document.getElementById("updatemember").style.color = "red";
                            }
                            if (response.data.message == "Wrong user or password") {
                                showCancelMessageregisteruser('รหัสผ่านเดิม ไม่ถูกต้อง !!!', '')
                                    // document.getElementById("updatemember").innerText = "รหัสผ่านเดิม ไม่ถูกต้อง !!!";
                                    // document.getElementById("updatemember").style.color = "red";
                            }

                        });
                    });
                });
                /////////////////////ลบ
                $('#deleteUsermember').on('click', function(e) {
                    $.getScript("ip.js", function(data, textStatus, jqxhr) {
                        var urlipaddress = data.substring(1, data.length - 1);
                        axios({
                            url: urlipaddress + 'delPass',
                            method: 'delete',
                            data: {
                                userId: IDUSER.userId,
                                userName: document.getElementById("user_editmember").value
                            },
                            headers: { 'Authorization': refresh_token }
                        }).then(function(response) {
                            if (response.data.message == "delete completed") {
                                showSuccessMessageregisteruser('ลบข้อมูลสำเร็จ')
                                    // document.getElementById("c_deletemember").style.display = "none";
                                    // document.getElementById("completedmember").style.display = "block";
                                    // $("#lbl_completedmember").text('ลบข้อมูลสำเร็จ');
                                    //location.href = "visitorregisteruser.html";
                            }
                        }).catch(function(res) {
                            const { response } = res
                        });
                    });
                });
            });
        }).catch(function(res) {
            const { response } = res

        });
    });
}
var obj;
var userId;

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
var featuresId;
async function acctokenNew(refresh_token) {
    console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function(response) {
                resolve(response.data.message.access_token);

            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
                    // if (response.data.message == "Unauthorized") {
                    //     location.href = "index.html";
                    // }
            });
        });
    });
}

async function getfeatures(refresh_token, id) {
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);

            axios.get(urlipaddress + 'features/' + id, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(async function(response) {
                resolve(response.data.message.result)
            }).catch(function(res) {
                const { response } = res
            });
        });
    });
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

async function getuser_member(access_token) {
    const dataUserID = {
        userId: userId
    }

    console.log(userId)
    _arrusername = new Array()
    return new Promise(resolve => {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'user', dataUserID, {
                headers: {
                    'Authorization': access_token
                }
            }).then(function(response) {

                // console.log(response.data.message.data)
                var cnt = response.data.message.data.length;
                for (i = 0; i < cnt; i++) {
                    if (response.data.message.data[i].rule == userid_member) {
                        resolve(response.data.message.data)
                    }
                }
            });
        });
    });
}
$(async function() {
    // console.log('fffffffffff')
    // const result = await acctoken();
    // console.log(result)


    /////////////////////////////////// รายงานการจอง
    $('#submitfeatures').on('click', async function(e) {
        await SUBMITLOGIN()
    });


    $('#updatefeatures').on('click', async function(e) {


        console.log(obj)
        const result = await acctokenNew(obj);
        console.log(result)

        var features = []
        var i = 0;
        $("#table1 input:checkbox:checked").map(function() {
            if (this.checked) {
                chk = 'true'
                features[i] = this.value
                i = i + 1
            }
        });

        console.log(userId)
        console.log(featuresId)
        console.log(features)

        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const datafeatures = {
                userId: userId,
                featuresId: featuresId,
                features: features
            }
            axios.put(urlipaddress + 'features', datafeatures, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message);
                showSuccessMessage_('อัพเดทสำเร็จ', '')
            }).catch(function(res) {
                console.log(res)
            });

        });
    });


});

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};
async function SUBMITLOGIN() {
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        const dataUser = {
            username: document.getElementById("login_user").value,
            password: document.getElementById("login_pass").value,
        }

        axios.post(urlipaddress + 'login', dataUser).then(async function(response) {
            var decodejwt = parseJwt(response.data.message.refresh_token);
            userId = decodejwt.userId;
            console.log(userId)
            obj = response.data.message.refresh_token
            const result = await acctokenNew(response.data.message.refresh_token);

            var datafeatuees = await getfeatures(result, userId)
            console.log(datafeatuees)
                // var data = ['ประกาศชุมชน', 'ตลาดนัด', 'ผู้มาติดต่อ/นัดหมาย', 'อิเล็กทรอนิกส์ STAMP', 'พัสดุ', 'บริการ', 'ชำระเงิน']
                //for (const f in data) {
            if (datafeatuees.length == 0) {
                showCancelMessage_('USER MASTER ADMIN นี้ยังไม่ได้กำหนด', 'สารมารถ เลือกรายการเพิ่มไปใหม่ได้')
            } else {
                featuresId = datafeatuees[0].featuresId
                for (const i in datafeatuees[0].featuresData) {
                    if (datafeatuees[0].featuresData[i] == 'ประกาศชุมชน') { document.getElementById('check_notice').checked = true }
                    if (datafeatuees[0].featuresData[i] == 'ตลาดนัด') { document.getElementById('check_market').checked = true }
                    if (datafeatuees[0].featuresData[i] == 'ผู้มาติดต่อ/นัดหมาย') { document.getElementById('check_appointment').checked = true }
                    if (datafeatuees[0].featuresData[i] == 'อิเล็กทรอนิกส์ STAMP') {
                        if (datafeatuees[0].featuresData[i] == 'อิเล็กทรอนิกส์ STAMP') {
                            datafeatuees[0].featuresData[i].replace('อิเล็กทรอนิกส์ STAMP', 'E-STAMP')
                        }
                        document.getElementById('check_stamp').checked = true
                    }
                    if (datafeatuees[0].featuresData[i] == 'พัสดุ') { document.getElementById('check_supplies').checked = true }
                    if (datafeatuees[0].featuresData[i] == 'บริการ') { document.getElementById('check_service').checked = true }
                    if (datafeatuees[0].featuresData[i] == 'ชำระเงิน') { document.getElementById('check_payment').checked = true }
                }
            }

        }).catch(function(res) {
            console.log(res)
        });
    });
}


function showCancelMessage_(title, text) {
    swal({
        title: title,
        text: text,
        type: "error",
    }, function(isConfirm) {
        swal("Cancelled", "Your imaginary file is safe :)", "error");
    });
}

function showSuccessMessage_(text) {
    swal({
        title: "สำเร็จ",
        text: text,
        type: "success",
    }, function(isConfirm) {
        if (isConfirm) {
            location.href = "features.html";
        }
    });
}
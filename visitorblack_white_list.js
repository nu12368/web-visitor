
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;

function acctoken() {
    //console.log('acctoken')
    // console.log(obj.refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.post(urlipaddress + 'token', data, {
                headers: {
                    'Authorization': obj.refresh_token
                }
            }).then(function (response) {
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

function getvisitorblacklist(refresh_token) {
    //   console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'blacklist/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (responseblacklist) {
                //       console.log(responseblacklist.data.message.blacklist)
                //       console.log(responseblacklist.data.message.blacklist.length)
                //resolve(response.data.message.blacklist);
                var cnt_blacklist = responseblacklist.data.message.blacklist.length;
                for (i = 0; i < cnt_blacklist; i++) {
                    //  console.log(responsewhite.data.message.whitelist[0].time)
                    var time_c = responseblacklist.data.message.blacklist[i].time.length
                    for (i2 = 0; i2 < time_c; i2++) {
                        _arr[n] = {
                            blacklistId: responseblacklist.data.message.blacklist[i].blacklistId,
                            citizenId: responseblacklist.data.message.blacklist[i].citizenId,
                            name: responseblacklist.data.message.blacklist[i].name,
                            blacklistTimeId: responseblacklist.data.message.blacklist[i].time[i2].blacklistTimeId,
                            timeStart: responseblacklist.data.message.blacklist[i].time[i2].timeStart,
                            timeStop: responseblacklist.data.message.blacklist[i].time[i2].timeStop,
                            status: "BlackList",
                        }
                        n = n + 1
                    }
                }
                //     console.log(_arr)
                resolve(_arr);


            }).catch(function (res) {
                const { response } = res
                //     console.log(response.data)
            });
        });
    });
}

function getvisitorwhitelist(refresh_token) {
    //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'whitelist/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (responsewhite) {
                //    console.log(response.data.message.whitelist)
                var cnt_whitelist = responsewhite.data.message.whitelist.length;
                for (i = 0; i < cnt_whitelist; i++) {
                    //  console.log(responsewhite.data.message.whitelist[0].time)
                    var time_c = responsewhite.data.message.whitelist[i].time.length
                    for (i2 = 0; i2 < time_c; i2++) {
                        // console.log(responsewhite.data.message.whitelist[i].time[i2].whitelistTimeId)
                        // console.log(responsewhite.data.message.whitelist[i].name)
                        _arr[n] = {
                            whitelistId: responsewhite.data.message.whitelist[i].whitelistId,
                            citizenId: responsewhite.data.message.whitelist[i].citizenId,
                            name: responsewhite.data.message.whitelist[i].name,
                            whitelistTimeId: responsewhite.data.message.whitelist[i].time[i2].whitelistTimeId,
                            timeStart: responsewhite.data.message.whitelist[i].time[i2].timeStart,
                            timeStop: responsewhite.data.message.whitelist[i].time[i2].timeStop,
                            status: "WhiteList",
                        }
                        n = n + 1
                    }
                }
                //    console.log(_arr)
                resolve(_arr);
            }).catch(function (res) {
                const { responsewhite } = res
                //      console.log(responsewhite.data)
            });
        });
    });
}






$(async function () {

    const result = await acctoken();
    // console.log(result)
    const responsevisitorblacklist = await getvisitorblacklist(result);
    // console.log('responsevisitorblacklist')
    // console.log(responsevisitorblacklist)

    const responsevisitorwhitelist = await getvisitorwhitelist(result);
    // console.log('responsevisitorwhitelist')
    // console.log(responsevisitorwhitelist)


    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var tbl = $('#table1').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arr,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "citizenId" },
                { data: "name" },

                {
                    data: "timeStart",
                    render: function (data) {

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
                    data: "timeStop",
                    render: function (data) {

                        let date = new Date(data);
                        let options = { hour12: false };
                        var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                        if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                            return '-';
                        }
                        return sp[1] + "/" + sp[0] + "/" + sp[2];
                    }
                },
                { data: "status" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                },

            ],
            "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                // console.log(aData.status)
                if (aData.status == "BlackList") {
                    $(nRow).find('td:eq(4)').css('color', 'red');
                } else {
                    $(nRow).find('td:eq(4)').css('color', 'green');
                }
            }
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
    
        function showSuccessMessage(text) {
            swal({
                title: "สำเร็จ",
                text: text,
                type: "success",
            }, function (isConfirm) {
                if (isConfirm) {
                    location.href = "visitorblack_white_list.html";
                }
            });
        }




        ///////////////////////ลบ WhiteList BlackList
        $('#table1').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#table1').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            var data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            if (data.blacklistId != undefined) {
                //     console.log(data)
                document.getElementById("listId").value = data.blacklistId
                document.getElementById("listTimeId").value = data.blacklistTimeId
                document.getElementById("statusId").value = data.status

            } else {
                //    console.log(data)
                document.getElementById("listId").value = data.whitelistId
                document.getElementById("listTimeId").value = data.whitelistTimeId
                document.getElementById("statusId").value = data.status
            }
            $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

        });

        ////////// ยืนยันลบ WhiteList BlackList
        $('#Deletevisitor').on('click', function (e) {
            var c_status = document.getElementById("statusId").value;
            if (c_status == "WhiteList") {
                c_status = 'whitelist'
                var data = {
                    userId: userId,
                    whitelistId: document.getElementById("listId").value,
                    whitelistTimeId: document.getElementById("listTimeId").value,
                }
            }
            if (c_status == "BlackList") {
                c_status = 'blacklist'
                var data = {
                    userId: userId,
                    blacklistId: document.getElementById("listId").value,
                    blacklistTimeId: document.getElementById("listTimeId").value,
                }
            }
            axios({
                url: urlipaddress + c_status,
                method: 'delete',
                data,
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                //     console.log(response.data.message)
                $("#myModaldelete").empty()
                showSuccessMessage('ลบข้อมูลสำเร็จ');
               // location.href = "visitorblack_white_list.html";
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message,'')
                //   console.log(response.data.message)
            });
        });



        //////ตรวจสอบ สถานะ WhiteList BlackList
        $('#submitblack_white_list').on('click', function (e) {
            document.getElementById('save').innerText = ''
            var citizenId = document.getElementById('txtidcard').value;
            var name = document.getElementById('txtname').value;
            var timeStart = document.getElementById('startdate').value;
            var timeStop = document.getElementById('enddate').value;

            if (citizenId != '' && name != '' && timeStart != '' && timeStop != '') {
                $("#myModalblack_white_list").modal();
            } else {
                showCancelMessage('กรุณากรอกข้อมูลให้ครบ','')
                // document.getElementById('save').innerText = 'กรุณากรอกข้อมูลให้ครบ'
                // document.getElementById('save').style.color = 'red'

                return;
            }


        });
        //////////////บันทึก WhiteList BlackList
        $('#Saveblack_white_list').on('click', function (e) {
            document.getElementById('c_black_white_list').innerText = ""
            var c_blacklist = document.getElementById('radio_BlackList').checked;
            var c_whitelist = document.getElementById('radio_WhiteList').checked;

            if (c_blacklist == false && c_whitelist == false) {
                document.getElementById('c_black_white_list').innerText = 'กรุณาเลือกสถานะ BlackList/WhiteList'
                document.getElementById('c_black_white_list').style.color = 'red'
                return;
            }

            var citizenId = document.getElementById('txtidcard').value;
            var name = document.getElementById('txtname').value;
            var timeStart = document.getElementById('startdate').value.split('/');
            var timeStop = document.getElementById('enddate').value.split('/');
            var s_time = document.getElementById('txttimestart').value;
            var e_time = document.getElementById('txttimestop').value;

            //    console.log(timeStart)

            // 2020-12-18T09:24:00.000Z    /// ปี เดือน วัน
            var StartisoDate = new Date(`${timeStart[2] + '-' + timeStart[1] + '-' + timeStart[0]}T${s_time}:00`).toISOString()
            //   var StartisoDate = new Date(timeStart[2] + '-' + timeStart[1] + '-' + timeStart[0] + ' ' + s_time + ':' + '00').toISOString();
            //    console.log(StartisoDate)

            var StopisoDate = new Date(`${timeStop[2] + '-' + timeStop[1] + '-' + timeStop[0]}T${e_time}:00`).toISOString()
            //     var StopisoDate = new Date(timeStop[2] + '-' + timeStop[1] + '-' + timeStop[0] + ' ' + e_time + ':' + '00').toISOString();
            //    console.log(StopisoDate)



            if (c_blacklist == true) {

                const datablacklist = {
                    userId: userId,
                    citizenId: citizenId,
                    name: name,
                    timeStart: StartisoDate,
                    timeStop: StopisoDate,
                }
                axios.post(urlipaddress + 'blacklist', datablacklist, {
                    headers: {
                        'Authorization': result
                    }
                }
                ).then(function (response) {
                    //         console.log(response.data.message)
                  //  location.href = "visitorblack_white_list.html";
                    showSuccessMessage('บันทึกข้อมูลสำเร็จ');
                }).catch(function (res) {
                    const { response } = res
                    showCancelMessage(response.data.message,'')
                    //          console.log(response.data.message)
                });

                return;
            }

            if (c_whitelist == true) {
                const datawhitelist = {
                    userId: userId,
                    citizenId: citizenId,
                    name: name,
                    timeStart: StartisoDate,
                    timeStop: StopisoDate,
                }
                axios.post(urlipaddress + 'whitelist', datawhitelist, {
                    headers: {
                        'Authorization': result
                    }
                }
                ).then(function (response) {
                    //         console.log(response.data.message)
                    showSuccessMessage('บันทึกข้อมูลสำเร็จ');
                  //  location.href = "visitorblack_white_list.html";
                }).catch(function (res) {
                    const { response } = res
                    showCancelMessage(response.data.message,'')
                    //        console.log(response.data.message)
                });

                return;
            }


        });


    });


    return;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        axios.get(urlipaddress + 'blacklist/' + userId).then(function (responseblacklist) {
            var cnt_blacklist = responseblacklist.data.message.blacklist.length;
            var _arr = new Array();
            var n = 0;
            axios.get(urlipaddress + 'whitelist/' + userId).then(function (responsewhite) {
                var cnt_whitelist = responsewhite.data.message.whitelist.length;
                // console.log(responsewhite.data.message.whitelist)
                //console.log(cnt_whitelist)
                for (i = 0; i < cnt_whitelist; i++) {
                    //  console.log(responsewhite.data.message.whitelist[0].time)
                    var time_c = responsewhite.data.message.whitelist[i].time.length
                    for (i2 = 0; i2 < time_c; i2++) {
                        // console.log(responsewhite.data.message.whitelist[i].time[i2].whitelistTimeId)
                        // console.log(responsewhite.data.message.whitelist[i].name)
                        _arr[n] = {
                            whitelistId: responsewhite.data.message.whitelist[i].whitelistId,
                            citizenId: responsewhite.data.message.whitelist[i].citizenId,
                            name: responsewhite.data.message.whitelist[i].name,
                            whitelistTimeId: responsewhite.data.message.whitelist[i].time[i2].whitelistTimeId,
                            timeStart: responsewhite.data.message.whitelist[i].time[i2].timeStart,
                            timeStop: responsewhite.data.message.whitelist[i].time[i2].timeStop,
                            status: "WhiteList",
                        }
                        n = n + 1
                    }
                }


                for (i = 0; i < cnt_blacklist; i++) {
                    var time_c = responseblacklist.data.message.blacklist[i].time.length
                    for (i2 = 0; i2 < time_c; i2++) {
                        // console.log(responseblacklist.data.message.blacklist[i].time[i2].blacklistTimeId)
                        // console.log(responseblacklist.data.message.blacklist[i].name)
                        _arr[n] = {
                            blacklistId: responseblacklist.data.message.blacklist[i].blacklistId,
                            citizenId: responseblacklist.data.message.blacklist[i].citizenId,
                            name: responseblacklist.data.message.blacklist[i].name,
                            blacklistTimeId: responseblacklist.data.message.blacklist[i].time[i2].blacklistTimeId,
                            timeStart: responseblacklist.data.message.blacklist[i].time[i2].timeStart,
                            timeStop: responseblacklist.data.message.blacklist[i].time[i2].timeStop,
                            status: "BlackList",
                        }
                        n = n + 1
                    }
                }
                //  console.log(_arr)
                var tbl = $('#table1').DataTable({
                    "lengthMenu": [[20, 50, 100], [20, 50, 100]],
                    "pageLength": 20,
                    'data': _arr,
                    "responsive": true,
                    "autoWidth": false,
                    "order": [],
                    columns: [
                        { data: "citizenId" },
                        { data: "name" },

                        {
                            data: "timeStart",
                            render: function (data) {

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
                            data: "timeStop",
                            render: function (data) {

                                let date = new Date(data);
                                let options = { hour12: false };
                                var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                                if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
                                    return '-';
                                }
                                return sp[1] + "/" + sp[0] + "/" + sp[2];
                            }
                        },
                        { data: "status" },
                        {
                            data: null,
                            className: "center",
                            defaultContent: '<i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
                        },

                    ],
                    "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                        // console.log(aData.status)
                        if (aData.status == "BlackList") {
                            $(nRow).find('td:eq(4)').css('color', 'red');
                        } else {
                            $(nRow).find('td:eq(4)').css('color', 'green');
                        }
                    }
                });



                ///////////////////////ลบ WhiteList BlackList
                $('#table1').on('click', 'i.remove_visitor', function (e) {
                    e.preventDefault();
                    $("#myModaldelete").modal();
                    var table = $('#table1').DataTable();
                    e.preventDefault();
                    var _ro = table.row($(this).parents('tr'));
                    var data = _ro.data();

                    if (data == undefined) {
                        data = table.row(this).data();
                    }

                    if (data.blacklistId != undefined) {
                        //     console.log(data)
                        document.getElementById("listId").value = data.blacklistId
                        document.getElementById("listTimeId").value = data.blacklistTimeId
                        document.getElementById("statusId").value = data.status

                    } else {
                        //    console.log(data)
                        document.getElementById("listId").value = data.whitelistId
                        document.getElementById("listTimeId").value = data.whitelistTimeId
                        document.getElementById("statusId").value = data.status
                    }
                    $("#lbl_dalete").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

                });

                ////////// ยืนยันลบ WhiteList BlackList
                $('#Deletevisitor').on('click', function (e) {
                    var c_status = document.getElementById("statusId").value;
                    if (c_status == "WhiteList") {
                        c_status = 'whitelist'
                        var data = {
                            userId: userId,
                            whitelistId: document.getElementById("listId").value,
                            whitelistTimeId: document.getElementById("listTimeId").value,
                        }
                    }
                    if (c_status == "BlackList") {
                        c_status = 'blacklist'
                        var data = {
                            userId: userId,
                            blacklistId: document.getElementById("listId").value,
                            blacklistTimeId: document.getElementById("listTimeId").value,
                        }
                    }
                    axios({
                        url: urlipaddress + c_status,
                        method: 'delete',
                        data
                    }).then(function (response) {
                        //   console.log(response.data.message)
                        location.href = "visitorblack_white_list.html";
                    }).catch(function (res) {
                        const { response } = res
                        //   console.log(response.data.message)
                    });
                });



                //////ตรวจสอบ สถานะ WhiteList BlackList
                $('#submitblack_white_list').on('click', function (e) {
                    document.getElementById('save').innerText = ''
                    var citizenId = document.getElementById('txtidcard').value;
                    var name = document.getElementById('txtname').value;
                    var timeStart = document.getElementById('startdate').value;
                    var timeStop = document.getElementById('enddate').value;

                    if (citizenId != '' && name != '' && timeStart != '' && timeStop != '') {
                        $("#myModalblack_white_list").modal();
                    } else {
                        document.getElementById('save').innerText = 'กรุณากรอกข้อมูลให้ครบ'
                        document.getElementById('save').style.color = 'red'

                        return;
                    }


                });
                //////////////บันทึก WhiteList BlackList
                $('#Saveblack_white_list').on('click', function (e) {
                    document.getElementById('c_black_white_list').innerText = ""
                    var c_blacklist = document.getElementById('radio_BlackList').checked;
                    var c_whitelist = document.getElementById('radio_WhiteList').checked;

                    if (c_blacklist == false && c_whitelist == false) {
                        document.getElementById('c_black_white_list').innerText = 'กรุณาเลือกสถานะ BlackList/WhiteList'
                        document.getElementById('c_black_white_list').style.color = 'red'
                        return;
                    }

                    var citizenId = document.getElementById('txtidcard').value;
                    var name = document.getElementById('txtname').value;
                    var timeStart = document.getElementById('startdate').value.split('/');
                    var timeStop = document.getElementById('enddate').value.split('/');;
                    var s_time = document.getElementById('txttimestart').value;
                    var e_time = document.getElementById('txttimestop').value;

                    //    console.log(timeStart)

                    // 2020-12-18T09:24:00.000Z    /// ปี เดือน วัน
                    var StartisoDate = new Date(timeStart[2] + '-' + timeStart[1] + '-' + timeStart[0] + ' ' + s_time + ':' + '00').toISOString();
                    //   console.log(StartisoDate)

                    var StopisoDate = new Date(timeStop[2] + '-' + timeStop[1] + '-' + timeStop[0] + ' ' + e_time + ':' + '00').toISOString();
                    //  console.log(StopisoDate)



                    if (c_blacklist == true) {

                        const datablacklist = {
                            userId: userId,
                            citizenId: citizenId,
                            name: name,
                            timeStart: StartisoDate,
                            timeStop: StopisoDate,
                        }
                        axios.post(urlipaddress + 'blacklist', datablacklist
                        ).then(function (response) {
                            //        console.log(response.data.message)
                            location.href = "visitorblack_white_list.html";
                        }).catch(function (res) {
                            const { response } = res
                            //         console.log(response.data.message)
                        });

                        return;
                    }

                    if (c_whitelist == true) {
                        const datawhitelist = {
                            userId: userId,
                            citizenId: citizenId,
                            name: name,
                            timeStart: StartisoDate,
                            timeStop: StopisoDate,
                        }
                        axios.post(urlipaddress + 'whitelist', datawhitelist
                        ).then(function (response) {
                            //      console.log(response.data.message)
                            location.href = "visitorblack_white_list.html";
                        }).catch(function (res) {
                            const { response } = res
                            //    console.log(response.data.message)
                        });

                        return;
                    }


                });


            }).catch(function (res) {
                const { response } = res
            });

        }).catch(function (res) {
            const { response } = res
        });
    });


});
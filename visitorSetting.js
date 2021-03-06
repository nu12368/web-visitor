

var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
function acctoken() {
    // console.log(userId)
    //     console.log(obj)
    //     console.log('acctoken')
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
                    return;
                }

            });
        });
    });
}

function getvisitorType(refresh_token) {
    //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitorType/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                //  console.log(response.data.message.visitorType)
                resolve(response.data.message.visitorType);

            }).catch(function (res) {
                const { response } = res
                //  console.log(response.data)
            });
        });
    });
}

function getlicensePlate(refresh_token) {
    //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'licensePlate/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                // console.log(response.data.message.licensePlate)
                resolve(response.data.message.licensePlate);

            }).catch(function (res) {
                const { response } = res
                // console.log(response.data)
            });
        });
    });
}


//////////////////////////////////////////////////////???????????????????????????????????????
function getvisitPlace(refresh_token) {
    //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitPlace/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                //  console.log(response.data.message)
                resolve(response.data.message.visitPlace);

            }).catch(function (res) {
                const { response } = res
                //    console.log(response.data)
            });
        });
    });
}

//////////////////////////////////////////////////////????????????????????????????????????
function getcontactTopic(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'contactTopic/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                // console.log(response.data.message)
                resolve(response.data.message.contactTopic);

            }).catch(function (res) {
                const { response } = res
                // console.log(response.data)
            });
        });
    });
}

//////////////////////////////////////////////////////??????????????????
function getvisitFrom(refresh_token) {
    //  console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitFrom/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                //   console.log(response.data.message)
                resolve(response.data.message.visitFrom);

            }).catch(function (res) {
                const { response } = res
                //  console.log(response.data)
            });
        });
    });
}


//////////////////////////////////////////////////////???????????????????????????????????????

function getdepartment(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'department/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.department);

            }).catch(function (res) {
                const { response } = res
                //  console.log(response.data)
            });
        });
    });
}


//////////////////////////////////////////////////////??????????????????

function getvehicleType(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'vehicleType/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.vehicleType);

            }).catch(function (res) {
                const { response } = res
                // console.log(response.data)
            });
        });
    });
}


//////////////////////////////////////////////////////?????????????????????????????????????????????

function getvisitPerson(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'visitPerson/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                resolve(response.data.message.visitPerson);

            }).catch(function (res) {
                const { response } = res
                //     console.log(response.data)
            });
        });
    });
}


//////////////////////////////////////////////////////????????????????????????????????????????????????

function getcategory(refresh_token) {
    // console.log(refresh_token)
    return new Promise(resolve => {
        $.getScript("ip.js", function (data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            axios.get(urlipaddress + 'category/' + userId, {
                headers: {
                    'Authorization': refresh_token
                }
            }).then(function (response) {
                var $select = $('#category');
                $select.find('option').remove();
                $select.append('<option value=' + ' ' + '>' + '-- ??????????????????????????????????????????????????????????????? --' + '</option>');
                $.each(response.data.message.category, function (key, value) {
                    console.log(value)
                    $select.append('<option value=' + value + '>' + value + '</option>');
                });
                resolve(response.data.message.category);
            }).catch(function (res) {
                const { response } = res
                //     console.log(response.data)
            });
        });
    });
}


$(async function () {
    const result = await acctoken();
    // console.log(result)
    const responsevisitorType = await getvisitorType(result);    //////// ?????????????????? visitor

    const responselicensePlate = await getlicensePlate(result);  ////////  ???????????????????????????

    const responsePlace = await getvisitPlace(result);   ///////  ???????????????????????????????????????

    const responsecontactTopic = await getcontactTopic(result);   /////// ????????????????????????????????????

    const responsevisitFrom = await getvisitFrom(result);   ///////  ??????????????????

    const responsedepartment = await getdepartment(result);   ///////  ???????????????????????????????????????

    const responsevehicleType = await getvehicleType(result);   ///////  ??????????????????

    const responsePerson = await getvisitPerson(result);   ///////  ?????????????????????????????????????????????

    const responsecategory = await getcategory(result);   ///////  ????????????????????????????????????????????????


    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var _arrvisitorType = new Array();
        var _arrlicensePlate = new Array();
        var _arrvisitPlace = new Array();
        var _arrcontactTopic = new Array();
        var _arrvisitFrom = new Array();
        var _arrdepartment = new Array();
        var _arrvehicleType = new Array();
        var _arrPerson = new Array();
        var _arrcategory = new Array();

        var cnt = responsevisitorType.length;
        var cnt_licensePlate = responselicensePlate.length;
        var cnt_Place = responsePlace.length;
        var cnt_contactTopic = responsecontactTopic.length;
        var cnt_visitFrom = responsevisitFrom.length;
        var cnt_department = responsedepartment.length;
        var cnt_vehicleType = responsevehicleType.length;
        var cnt_category = responsecategory.length;

        var cnt_Person = responsePerson.length;


        var n = 0;
        var _num = 1;


        /////////////////////////////////////////////////////////////////////////////////////////////////??????????????????????????????///////////////////////////
        /////////////////////////////////////////////////////////////// ??????????????????
        for (i = 0; i < cnt; i++) {
            _arrvisitorType[n] = {
                num: _num,
                visitorType: responsevisitorType[i],
                charge: ""
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#table1').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrvisitorType,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "visitorType" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                },
                { data: "charge", "visible": false },
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ????????????????????????????????????????????????
        for (i = 0; i < cnt_category; i++) {
            _arrcategory[n] = {
                num: _num,
                category: responsecategory[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablecategory').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrcategory,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "category" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_category" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_category" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ?????????????????????????????????????????????
        for (i = 0; i < cnt_Person; i++) {
            _arrPerson[n] = {
                num: _num,
                visitPerson: responsePerson[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablevisitPerson').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrPerson,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "visitPerson" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ???????????????????????????
        for (i = 0; i < cnt_licensePlate; i++) {
            _arrlicensePlate[n] = {
                num: _num,
                licensePlate: responselicensePlate[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablelicensePlate').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrlicensePlate,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "licensePlate" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ???????????????????????????????????????
        for (i = 0; i < cnt_Place; i++) {
            _arrvisitPlace[n] = {
                num: _num,
                visitPlace: responsePlace[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablevisitPlace').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrvisitPlace,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "visitPlace" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ????????????????????????????????????
        for (i = 0; i < cnt_contactTopic; i++) {
            _arrcontactTopic[n] = {
                num: _num,
                contactTopic: responsecontactTopic[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablecontactTopic').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrcontactTopic,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "contactTopic" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ??????????????????
        for (i = 0; i < cnt_visitFrom; i++) {
            _arrvisitFrom[n] = {
                num: _num,
                visitFrom: responsevisitFrom[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablevisitFrom').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrvisitFrom,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "visitFrom" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ???????????????????????????????????????

        for (i = 0; i < cnt_department; i++) {
            _arrdepartment[n] = {
                num: _num,
                department: responsedepartment[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tabledepartment').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrdepartment,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "department" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });

        n = 0;
        _num = 1;
        ////////////////////////////////////////////////////////////// ??????????????????

        for (i = 0; i < cnt_vehicleType; i++) {
            _arrvehicleType[n] = {
                num: _num,
                vehicleType: responsevehicleType[i],
            }
            n = n + 1
            _num = _num + 1;
        }
        $('#tablevehicleType').DataTable({
            "lengthMenu": [[20, 50, 100], [20, 50, 100]],
            "pageLength": 20,
            'data': _arrvehicleType,
            "responsive": true,
            "autoWidth": false,
            "order": [],
            columns: [
                { data: "num" },
                { data: "vehicleType" },
                {
                    data: null,
                    className: "center",
                    defaultContent: '<i href="" class="edit_visitor" style="font-size:16px;color:blue; cursor: pointer;">??????????????? </i>/ <i href="" class="remove_visitor" style="font-size:14px;color:red; cursor: pointer;">??????</i>'
                }
            ]
        });










        //////////////////////////////////////////////////////??????????????? ?????? ???????????????/////////////////////////////////////////////////////////////////////////////////////////
        var visitorType;


        ///////////////////////?????? ?????????????????????????????????????????????

        $('#tablevisitPerson').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablevisitPerson').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.visitPerson
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ?????????????????????????????????????????????
        $('#DeletevisitPerson').on('click', function (e) {
            const datavisitPerson = {
                userId: userId,
                visitPerson: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('visitPerson', datavisitPerson)
        });
        ////////// ??????????????? ?????????????????????????????????????????????
        $('#submitvisitPerson').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "????????????????????????????????????????????????????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datavisitPerson = {
                userId: userId,
                visitPerson: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('visitPerson', datavisitPerson);
        });

        //////////////////////// ????????????????????????????????????????????????????????????

        $('#tablevisitPerson').on('click', 'i.edit_visitor', function (e) {

            e.preventDefault();
            var table = $('#tablevisitPerson').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();

            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }

            //   console.log(visitorType.visitPerson)
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.visitPerson;
        });

        $('#updatevisitPerson').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "????????????????????????????????????????????????????????????????????????????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavisitPerson = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            // console.log(datavisitPerson)
            EditVisitor('visitPerson', datavisitPerson)
        });



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////











        ///////////////////////?????? visitorType
        $('#table1').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#table1').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.visitorType
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? visitorType
        $('#Deletevisitor').on('click', function (e) {
            const datavisitorType = {
                userId: userId,
                visitorType: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('visitorType', datavisitorType)
        });
        ////////// ??????????????? ?????????????????? Visitor
        $('#submitvisitorType').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ?????????????????? Visitor"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datavisitorType = {
                userId: userId,
                visitorType: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('visitorType', datavisitorType);
        });

        //////////////////////// ??????????????? ?????????????????? visitor
        $('#table1').on('click', 'i.edit_visitor', function (e) {
            //      console.log('dsdsdsds')
            e.preventDefault();
            var table = $('#table1').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();

            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }

            //      console.log('dsdsdsds')
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.visitorType;
        });

        $('#updatevisitorType').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ?????????????????? Visitor ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavisitorType = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('visitorType', datavisitorType)
        });



        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ////////// ??????????????? ???????????????????????????
        $('#submitlicensePlate').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ???????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datalicensePlate = {
                userId: userId,
                licensePlate: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('licensePlate', datalicensePlate);
        });
        //////////////////////// ??????????????? ???????????????????????????
        $('#tablelicensePlate').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tablelicensePlate').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            //     console.log(visitorType)
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.licensePlate;
        });
        $('#updatelicensePlate').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ??????????????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavisitorType = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('licensePlate', datavisitorType)
        });

        ///////////////////////?????? ???????????????????????????
        $('#tablelicensePlate').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablelicensePlate').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            //     console.log(visitorType.licensePlate)
            document.getElementById("_id_deletedata").value = visitorType.licensePlate
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ???????????????????????????
        $('#DeletelicensePlate').on('click', function (e) {
            const datalicensePlate = {
                userId: userId,
                licensePlate: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('licensePlate', datalicensePlate)
        });




        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////// ??????????????? ???????????????????????????????????????
        $('#submitvisitPlace').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ???????????????????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datavisitPlace = {
                userId: userId,
                visitPlace: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('visitPlace', datavisitPlace);
        });
        //////////////////////// ??????????????? ???????????????????????????????????????
        $('#tablevisitPlace').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tablevisitPlace').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            //  console.log(visitorType)
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.visitPlace;
        });
        $('#updatelvisitPlace').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ??????????????????????????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavisitorType = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('visitPlace', datavisitorType)
        });

        ///////////////////////?????? ???????????????????????????????????????
        $('#tablevisitPlace').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablevisitPlace').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            //    console.log(visitorType.visitPlace)
            document.getElementById("_id_deletedata").value = visitorType.visitPlace
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ???????????????????????????????????????
        $('#DeletevisitPlace').on('click', function (e) {
            const datavisitPlace = {
                userId: userId,
                visitPlace: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('visitPlace', datavisitPlace)
        });





        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////// ??????????????? ????????????????????????????????????
        $('#submitcontactTopic').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ????????????????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datacontactTopic = {
                userId: userId,
                contactTopic: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('contactTopic', datacontactTopic);
        });
        //////////////////////// ??????????????? ????????????????????????????????????
        $('#tablecontactTopic').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tablecontactTopic').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            //  console.log(visitorType)
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.contactTopic;
        });
        $('#updatecontactTopic').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ???????????????????????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datacontactTopic = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('contactTopic', datacontactTopic)
        });

        ///////////////////////?????? ????????????????????????????????????
        $('#tablecontactTopic').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablecontactTopic').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.contactTopic
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ????????????????????????????????????
        $('#DeletecontactTopic').on('click', function (e) {
            const datacontactTopic = {
                userId: userId,
                contactTopic: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('contactTopic', datacontactTopic)
        });







        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////// ??????????????? ??????????????????
        $('#submitvisitFrom').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ??????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datavisitFrom = {
                userId: userId,
                visitFrom: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('visitFrom', datavisitFrom);
        });
        //////////////////////// ??????????????? ??????????????????
        $('#tablevisitFrom').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tablevisitFrom').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.visitFrom;
        });
        $('#updatevisitFrom').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ?????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavisitFrom = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('visitFrom', datavisitFrom)
        });

        ///////////////////////?????? ??????????????????
        $('#tablevisitFrom').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablevisitFrom').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.visitFrom
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ??????????????????
        $('#DeletevisitFrom').on('click', function (e) {
            const datavisitFrom = {
                userId: userId,
                visitFrom: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('visitFrom', datavisitFrom)
        });






        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////// ??????????????? ???????????????????????????????????????

        $('#submitdepartment').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ???????????????????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datadepartment = {
                userId: userId,
                department: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('department', datadepartment);
        });
        //////////////////////// ??????????????? ???????????????????????????????????????
        $('#tabledepartment').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tabledepartment').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.department;
        });
        $('#updatedepartment').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ??????????????????????????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datadepartment = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('department', datadepartment)
        });

        ///////////////////////?????? ???????????????????????????????????????
        $('#tabledepartment').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tabledepartment').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.department
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ???????????????????????????????????????
        $('#Deletedepartment').on('click', function (e) {
            const datadepartment = {
                userId: userId,
                department: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('department', datadepartment)
        });





        ////////////////////////////////////////////////////////////////////////////////////////////////////
        ////////// ??????????????? ??????????????????


        $('#submitvehicleType').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtvisitorType").value == "") {
                document.getElementById("save").innerText = "??????????????????????????? ??????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datavehicleType = {
                userId: userId,
                vehicleType: document.getElementById("txtvisitorType").value
            }
            SettingVisitor('vehicleType', datavehicleType);
        });
        //////////////////////// ??????????????? ??????????????????
        $('#tablevehicleType').on('click', 'i.edit_visitor', function (e) {
            e.preventDefault();
            var table = $('#tablevehicleType').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.vehicleType;
        });
        $('#updatevehicleType').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "??????????????????????????? ?????????????????? ????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datavehicleType = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('vehicleType', datavehicleType)
        });

        ///////////////////////?????? ??????????????????
        $('#tablevehicleType').on('click', 'i.remove_visitor', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablevehicleType').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.vehicleType
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ??????????????????
        $('#DeletevehicleType').on('click', function (e) {
            const datavehicleType = {
                userId: userId,
                vehicleType: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('vehicleType', datavehicleType)
        });





        ///////////////////////???????????????????????? Log
        $('#deletedataLog').on('click', function (e) {
            $("#myModaldelete").modal();
            // console.log(userId)

            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ???????????????????????? Log
        $('#Delete_visitor_log').on('click', async function (e) {
            var datedelete = document.getElementById("datedelete").value.split('/'); /// 2 1 0
            var datedeleteEnd = document.getElementById("datedeleteend").value.split('/'); /// 2 1 0
            //   console.log(datedelete[2] + datedelete[1].toString().padStart(2, '0') + datedelete[0].toString().padStart(2, '0'))
            //  console.log(datedeleteEnd[2] + datedeleteEnd[1].toString().padStart(2, '0') + datedeleteEnd[0].toString().padStart(2, '0'))

            var cc = parseInt(datedelete[0]);
            var aa = parseInt(datedeleteEnd[0]) + 1;
            var dd = aa - cc;
            for (i = 0; i < dd; i++) {
                document.getElementById("p_ck").innerText = ""
                document.getElementById("p_ck").style.color = "red"
                var s_date = datedelete[2] + datedelete[1].toString().padStart(2, '0') + cc.toString().padStart(2, '0')
                //    console.log(s_date)
                var dataLog = {
                    userId: userId,
                    _time: s_date
                }
                deleteLog(dataLog)
                cc = cc + 1;
            }
        });






        ///////////////////////????????????????????????????????????????????????
        $('#tablecategory').on('click', 'i.remove_category', function (e) {
            e.preventDefault();
            $("#myModaldelete").modal();
            var table = $('#tablecategory').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();
            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            document.getElementById("_id_deletedata").value = visitorType.category
            $("#lbl_dalete").text('???????????????????????????????????????????????????????????? ??????????????????????????????');
        });

        ////////// ???????????????????????? ????????????????????????????????????????????????
        $('#Deletecategory').on('click', function (e) {
            const datacategory  = {
                userId: userId,
                category: document.getElementById("_id_deletedata").value
            }
            DeleteVisitor('category', datacategory)
        });
        ////////// ??????????????? ????????????????????????????????????????????????

        $('#submitcategory').on('click', function (e) {
            document.getElementById("save").innerText = "";
            if (document.getElementById("txtcategory").value == "") {
                document.getElementById("save").innerText = "???????????????????????????????????????????????????????????????????????????"
                document.getElementById("save").style.color = "red"
                return;
            }
            const datacategory = {
                userId: userId,
                category: document.getElementById("txtcategory").value
            }
            SettingVisitor('category', datacategory);
        });

        //////////////////////// ???????????????????????????????????????????????????????????????
        $('#tablecategory').on('click', 'i.edit_category', function (e) {

            e.preventDefault();
            var table = $('#tablecategory').DataTable();
            var _ro = table.row($(this).parents('tr'));
            visitorType = _ro.data();

            if (visitorType == undefined) {
                visitorType = table.row(this).data();
            }
            $("#myModaledit").modal();
            document.getElementById("oldvisitorType").value = visitorType.category;
        });

        $('#updatecategory').on('click', function (e) {
            document.getElementById("update").innerText = "";
            if (document.getElementById("newvisitorType").value == "") {
                document.getElementById("update").innerText = "????????????????????????????????????????????????????????????????????????????????????"
                document.getElementById("update").style.color = "red"
                return;
            }
            const datacategory = {
                userId: userId,
                find: document.getElementById("oldvisitorType").value,
                editTo: document.getElementById("newvisitorType").value
            }
            EditVisitor('category', datacategory)
        });














        const deleteLog = async (_time) => {
            //  console.log(_time)
            const result = await acctoken();
            try {
                const id = await axios({
                    url: urlipaddress + 'delLog',
                    method: 'delete',
                    data:
                        _time
                    ,
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    // console.log(response.data.message)
                    // displaypage(val)
                    document.getElementById("p_ck").innerText = "??????????????????????????????????????????"
                    document.getElementById("p_ck").style.color = "green"
                    document.getElementById("lbl_dalete").style.display = 'none'
                }).catch(function (res) {
                    const { response } = res
                    // console.log(response.data.message)
                    if (response.data.message == 'delete fail,Not found information') {
                        document.getElementById("p_ck").innerText = "????????????????????????????????????????????????"
                        document.getElementById("p_ck").style.color = "red"
                        document.getElementById("lbl_dalete").style.display = 'none'
                    } else {
                        //  console.log(response.data.message)
                    }
                });
            } catch (error) {
                //    console.log(error)
            }

        };
        /////////////////////////////////////////////////////////////////////////POST PUT DELETE /////////////////////////////////////////////

        ///////////////////////////////////////////////////////////     ???????????????
        function SettingVisitor(val, datavisitor) {
            axios.post(urlipaddress + val, datavisitor, {
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                displaypage(val)


            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message,'')
                //   console.log(response.data.message)
            });
        }
        ///////////////////////////////////////////////////////////     ???????????????
        function EditVisitor(val, datavisitor) {
            axios.put(urlipaddress + val, datavisitor,
                {
                    headers: {
                        'Authorization': result
                    }
                }
            ).then(function (response) {
                displaypage(val)
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message,'')
                // if (response.data.message == "update fail,This information is already in the system.") {
                //     document.getElementById("update").innerText = "?????????????????? Visitor ???????????????????????????????????????"
                //     document.getElementById("update").style.color = "red"
                // }
            });
        }
        ///////////////////////////////////////////////////////////     ??????

        function DeleteVisitor(val, datavisitor) {
            //  console.log(datavisitor)
            axios({
                url: urlipaddress + val,
                method: 'delete',
                data:
                    datavisitor
                ,
                headers: {
                    'Authorization': result
                }
            }).then(function (response) {
                displaypage(val)
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message,'')
                // if (response.data.message == 'delete fail,Not found information') {
                //     document.getElementById("p_ck").innerText = "????????????????????????????????????????????????"
                //     document.getElementById("p_ck").style.color = "red"
                //     document.getElementById("lbl_dalete").style.display = 'none'
                // } else {
                //     // console.log(response.data.message)
                // }
            });
        }


        function displaypage(val) {

            $("#myModaldelete").empty()
            if (val == 'visitorType') {
               // location.href = "visitorSetting.html";
                showSuccessMessage('visitorSetting.html')
               
            }
            if (val == 'licensePlate') {
               // location.href = "visitorlicensePlate.html";
                showSuccessMessage('visitorlicensePlate.html')
            }
            if (val == 'visitPlace') {
               // location.href = "visitPlace.html";
                showSuccessMessage('visitPlace.html')
            }
            if (val == 'contactTopic') {
                showSuccessMessage('contactTopic.html')
               // location.href = "contactTopic.html";
            }
            if (val == 'visitFrom') {
                showSuccessMessage('visitFrom.html')
               // location.href = "visitFrom.html";
            }
            if (val == 'department') {
                showSuccessMessage('department.html')
              //  location.href = "department.html";
            }
            if (val == 'vehicleType') {
                showSuccessMessage('vehicleType.html')
                //location.href = "vehicleType.html";
            }
            if (val == 'visitPerson') {
                showSuccessMessage('visiperson.html')
             //   location.href = "visiperson.html";
            }
            if (val == 'delLog') {
                showSuccessMessage('deleteLog.html')
                // document.getElementById("p_ck").innerText = "??????????????????????????????????????????"
                // document.getElementById("p_ck").style.color = "green"
                // document.getElementById("lbl_completed_official").style.display = 'block'
                // document.getElementById("lbl_delete_official").style.display = 'none'
                // document.getElementById("lbl_dalete").style.display = 'none'

                //  location.href = 'deleteLog.html';
            }

            if(val == 'category'){
                showSuccessMessage('category.html')
                //location.href = "category.html";
            }

        }



        function showCancelMessage(title, text) {
            swal({
                title: title,
                text: text,
                type: "error",
            }, function (isConfirm) {
                swal("Cancelled", "Your imaginary file is safe :)", "error");
            });
        }
        function showSuccessMessage(page) {
            swal({
                title: '??????????????????',
                text: '??????????????????????????????????????????',
                type: "success",
            }, function (isConfirm) {
                if (isConfirm) {
                    location.href = page;
                }
            });
        }

    });
});
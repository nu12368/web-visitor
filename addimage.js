var length_img;
var userId = Cookies.get('datauserId');
var obj = JSON.parse(Cookies.get('datatoken'));
var n = 0;
var arr = new Array();
var img_id = $(this).children("img").attr("id");
var num_index = 0;
var _f_name;

var datamember;
datamember = Cookies.get('datamember');
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

$(async function() {
    const result = await acctoken();
    /////////////////แสดงรูปภาพ
    var imagesPreview = function(input) {
        if (input.files) {
            var filesAmount = input.files.length;
            document.getElementById("lbl_add").innerText = '';
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                var typefile = input.files[i].name.split('.');
                _f_name = input.files[i].name;
                //   _ftype = input.files[i]
                if (typefile[1] != 'PNG' && typefile[1] != 'JPG' && typefile[1] != 'jpg' && typefile[1] != 'jpeg' && typefile[1] != 'png') {
                    document.getElementById("lbl_add").innerText = 'เลือกรูปภาพใหม่ เป็นไฟล์ JPEG, JPG, PNG !!!' + '\n' + input.files[i].name;
                    document.getElementById("lbl_add").style.color = "red";
                    return;
                }
                console.log(input.files[i])
                    // ResizeImage(input.files[i])
                if (input.files[i].size > 2192282) {
                    // document.getElementById("lbl_add").innerText = "ขนาดภาพใหญ่เกินไป !!" + '\n' + input.files[i].name;
                    //  document.getElementById("lbl_add").style.color = "red";
                    // return;
                }

                reader.onload = function(event) {
                    length_img = $("#addImagenew img");
                    if (length_img.length > 4) {
                        document.getElementById("lbl_add").innerText = "อัพไฟล์รูปได้ไม่เกิน 5 รูป !!!";
                        document.getElementById("lbl_add").style.color = "red";
                        return;
                    }


                }


                //console.log(input.files[i])
                reader.readAsDataURL(input.files[i]);
            }
        }
        return;
    };

    function resize(item) {
        //define the width to resize e.g 600px
        var resize_width = 600; //without px
        //    console.log(item.files)
        for (i = 0; i < item.files.length; i++) {
            var reader = new FileReader();
            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item.files[i]);
            reader.name = item.files[i].name; //get the image's name
            reader.size = item.files[i].size; //get the image's size
            reader.onload = function(event) {
                var img = new Image(); //create a image
                img.src = event.target.result; //result is base64-encoded Data URI
                img.name = event.target.name; //set name (optional)
                img.size = event.target.size; //set size (optional)
                img.onload = function(el) {
                    var elem = document.createElement('canvas'); //create a canvas
                    //scale the image to 600 (width) and keep aspect ratio
                    var scaleFactor = resize_width / el.target.width;
                    elem.width = resize_width;
                    elem.height = el.target.height * scaleFactor;

                    //draw in canvas
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                    //get the base64-encoded Data URI from the resize image
                    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

                    //  console.log(event.target.name)
                    var _file = dataURLtoFile(srcEncoded, event.target.name)
                    console.log(_file)






                    if ($("#profileEdit").val() != undefined) {
                        ////// แก้ไข โปรไฟล์
                        if (Cookies.get('datamember') != undefined) {
                            datamember = Cookies.get('datamember');
                            if (datamember.rule = 'member') {
                                datamember = JSON.parse(datamember)

                                $('#_logo').attr('src', srcEncoded);

                                arr[n] = dataURLtoFile(srcEncoded, event.target.name);
                                n = n + 1;
                                return;
                            } else {

                            }
                        } else {

                            $('#_logo').attr('src', srcEncoded);
                        }
                    }


                    if (title_appeal == 'imagetitle') { /////////////////// สร้าง ร้องเรียน แจ้งเหตุ ซ่อมบำรุง
                        $("#viewImage_title").append(`<a id="close"  style="font-size:18px;color:red; class="pull-right" href="#">
                        <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);

                        arr[n] = dataURLtoFile(srcEncoded, event.target.name);
                        n = n + 1;

                    } else {
                        /////// เพิ่ม รูปภาพ ทั่วไป 
                        $("#addImagenew").append(`<a id="close"  style="font-size:18px;color:red; class="pull-right" href="#">
                    <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);

                        arr[n] = dataURLtoFile(srcEncoded, event.target.name);
                        n = n + 1;
                    }



                }
            }
        }
    }

    var typename;

    ///////////////// เลือกไฟล์
    $('#fileimage').on('change', function() {
        length_img = $("#addImagenew img");
        resize(this)
        return
    });

    function dataURLtoFile(dataurl, filename) {
        var arr_1 = dataurl.split(','),
            mime = arr_1[0].match(/:(.*?);/)[1],
            bstr = atob(arr_1[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    ///////// ลบรูปภาพ
    $('#addImagenew').on('click', 'i.delete_cc', function(e) {
        var remove_index = $(this).attr("name");
        console.log(remove_index)
        arr[parseInt(remove_index)] = " ";
        $(this).remove();

    });
    ///////// ลบรูปภาพ title
    $('#viewImage_title').on('click', 'i.delete_cc', function(e) {
        var remove_index = $(this).attr("name");
        console.log(remove_index)
        arr[parseInt(remove_index)] = " ";
        $(this).remove();

    });

    var title_appeal;
    ////////////////เพิ่ม รายการ แจ้งเหตุ ร้องเรียน ซ่อมบำรุง
    $('#add_appeal').on('click', function(e) {
        $("#addappeal").modal();
        Cookies.set('imagetitle', 'imagetitle', { expires: 1 })
        title_appeal = 'imagetitle'
    });


    ////////////////////  บันทึก พัสดุ
    $('#submitsupplies').on('click', function(e) {
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'deliver';
            let formData = new FormData();
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('parcelImage', '');
                formData.append('receiverImage', '');
                formData.append('room', document.getElementById("room").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('status', 'มา');
            } else {
                formData.append('userId', userId);
                console.log(arr)
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('parcelImage', arr[i]);
                        formData.append('receiverImage', '');
                    }
                }
                formData.append('room', document.getElementById("room").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('status', 'มา');
            }
            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                // console.log(response.data.message)
                showSuccessMessage('supplies.html');
                // location.href = "supplies.html";
            }).catch(function(res) {
                const { response } = res
                // console.log(response.data.message)
                showCancelMessage(response.data.message, '')
            });
        });
    });


    ////////////////////  บันทึกรายการ จอง
    $('#submitlist').on('click', async function(e) {
        const result = await acctoken();
        var category = document.getElementById('postlist').value
        var hr = document.getElementById('starthours').value
        var mi = document.getElementById('startminutes').value
        if (category == '') {
            showCancelMessage('กรุณาระรายการจอง', '')
            return
        }
        if (hr == '00' && mi == '00') {
            showCancelMessage('กรุณาเลือกช่วงเวลา', '')
            return
        }
        var t_hr = hr / 60
        var t_mi = mi / 60
        var hms;
        if (t_hr == 0) {
            hms = t_mi
            hms = hms.toFixed(2)
        } else {
            console.log(t_mi)
            if (t_mi == 0) { /////:00
                hms = parseInt(hr)
            } else {
                hms = parseInt(hr) + t_mi
                hms = hms.toFixed(2)
            }
        }

        console.log(hms.toString())

        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'setProp';
            let formData = new FormData();
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('category', category);
                formData.append('intervalDifference', hms.toString());
                formData.append('setFormat', '0');
                formData.append('description', document.getElementById("categorydescription").value);
            } else {
                formData.append('userId', userId);
                formData.append('category', category);
                formData.append('intervalDifference', hms.toString());
                formData.append('setFormat', '0');
                formData.append('description', document.getElementById("categorydescription").value);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('imageProp', arr[i]);
                    }
                }
            }
            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                showSuccessMessage('agendar.html')

            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
                if (response.data.message == 'category already exists.') {
                    showCancelMessage('มีรายนี้อยู่ในระบบแล้ว', '')
                }

            });
        });
    });

    ////////////////////  บันทึกประกาศ
    $('#submitnotice').on('click', function(e) {
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


        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'announce';
            let formData = new FormData();
            var ddd = document.getElementById('showDate').value
            var s_time = document.getElementById('txttimenotice').value;
            document.getElementById("savelbl_notice").innerText = ''
            var timedaysshowDate;
            var strdaysshowDate;
            if (ddd == '') {
                document.getElementById("savelbl_notice").innerText = 'กรุณาระบุวันที่'
                document.getElementById("savelbl_notice").style.color = 'red'
                return
            } else {
                timedaysshowDate = document.getElementById('showDate').value.split('/');
                var aaa = new Date(`${timedaysshowDate[2] + '-' + timedaysshowDate[1] + '-' + timedaysshowDate[0]}T${s_time}:00`).toISOString()
                strdaysshowDate = aaa;
            }



            if (datamember.rule == 'member') { ///////////////  member
                if (arr.length == 0) {
                    console.log(datamember)
                    formData.append('userId', userId);
                    formData.append('uId', datamember.userId);
                    formData.append('announceImage', '');
                    formData.append('topic', document.getElementById("posttopic").value);
                    formData.append('detail', document.getElementById("postdetail").value);
                    formData.append('weblink', document.getElementById("postweblink").value);
                    var _sp = document.getElementById("input-tags").value.split(',')
                    for (i = 0; i < _sp.length; i++) {
                        formData.append('tag[]', _sp[i]);
                    }
                    formData.append('gps[latitude]', document.getElementById("latitude").value);
                    formData.append('gps[longitude]', document.getElementById("longitude").value);
                    formData.append('category', Strcategory);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdelete").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                    formData.append('approve', 'รออนุมัติ');
                } else {

                    console.log(datamember.userId)
                    formData.append('userId', userId);
                    formData.append('uId', datamember.userId);
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] != " ") {
                            formData.append('announceImage', arr[i]);
                        }
                    }
                    formData.append('topic', document.getElementById("posttopic").value);
                    formData.append('detail', document.getElementById("postdetail").value);
                    formData.append('weblink', document.getElementById("postweblink").value);
                    var _sp = document.getElementById("input-tags").value.split(',')
                    for (i = 0; i < _sp.length; i++) {
                        formData.append('tag[]', _sp[i]);
                    }
                    formData.append('gps[latitude]', document.getElementById("latitude").value);
                    formData.append('gps[longitude]', document.getElementById("longitude").value);
                    formData.append('category', Strcategory);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdelete").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                    formData.append('approve', 'รออนุมัติ');
                }

            } else { /////////////////////////admin

                if (arr.length == 0) {
                    formData.append('userId', userId);
                    formData.append('announceImage', '');
                    formData.append('topic', document.getElementById("posttopic").value);
                    formData.append('detail', document.getElementById("postdetail").value);
                    formData.append('weblink', document.getElementById("postweblink").value);
                    var _sp = document.getElementById("input-tags").value.split(',')
                    for (i = 0; i < _sp.length; i++) {
                        formData.append('tag[]', _sp[i]);
                    }
                    formData.append('gps[latitude]', document.getElementById("latitude").value);
                    formData.append('gps[longitude]', document.getElementById("longitude").value);
                    formData.append('category', Strcategory);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdelete").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                } else {
                    formData.append('userId', userId);
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] != " ") {
                            formData.append('announceImage', arr[i]);
                        }
                    }
                    formData.append('topic', document.getElementById("posttopic").value);
                    formData.append('detail', document.getElementById("postdetail").value);
                    formData.append('weblink', document.getElementById("postweblink").value);
                    var _sp = document.getElementById("input-tags").value.split(',')
                    for (i = 0; i < _sp.length; i++) {
                        formData.append('tag[]', _sp[i]);
                    }
                    formData.append('gps[latitude]', document.getElementById("latitude").value);
                    formData.append('gps[longitude]', document.getElementById("longitude").value);
                    formData.append('category', Strcategory);
                    formData.append('showDate', strdaysshowDate);
                    var isRemoved = false;
                    if (document.getElementById("selectdelete").value == 'true') {
                        isRemoved = true;
                    }
                    formData.append('isRemoved', isRemoved);
                }
            }


            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                if (Strcategory == 'announce') {
                    showSuccessMessageallnotice('allnotice.html');
                }
                if (Strcategory == 'service') {
                    showSuccessMessageallnotice('allservice.html');
                }
                if (Strcategory == 'business') {
                    showSuccessMessageallnotice('allbusiness.html');
                }
                if (Strcategory == 'asset') {
                    showSuccessMessageallnotice('allasset.html');
                }
                if (Strcategory == 'travel') {
                    showSuccessMessageallnotice('alltravel.html');
                }
            }).catch(function(res) {
                const { response } = res
                showCancelMessageallnotice(response.data.message, '')
                console.log(response.data.message)
            });
        });
    });


    ///////////////////////////////////// แก้ไขโปรไฟล์ member
    $('#updateProfile').on('click', async function(e) {
        const result = await acctoken();
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            var formData = new FormData();

            if (arr.length != 0) {
                formData.append('imageProfile', arr[0]);
            } else {
                return;
            }
            const url = urlipaddress + 'addAccount';
            formData.append('userId', userId);
            formData.append('username', datamember.username);
            formData.append('rule', 'member');
            formData.append('editMode', true);

            axios.put(url, formData, {
                headers: {
                    'Authorization': result,
                    'Content-Type': 'multipart/form-data'
                }
            }).then(function(response) {
                console.log(response.data.message)
                if (response.data.message = 'update completed') {
                    location.href = "servicedashboard.html";
                }
            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
            });
        });
    });

    ////////////////////  เพิ่มข้อมูลร้องเรียน
    $('#submitappeal').on('click', function(e) {
        Postdata('appeal')
    });

    /////// Chat
    $('#btn_sendmsg').on('click', function(e) {
        PostChat()
    });

    $("#txt_msg").keyup(function(event) {

        if (event.keyCode === 13) {
            if (document.getElementById("txt_msg").value != '') {
                PostChat()
            }

        }
    });


    ////////////////////  เพิ่มข้อมูลแจ้งเหตุ
    $('#submitinform').on('click', function(e) {
        Postdata('inform')
    });

    ////////////////////  เพิ่มข้อมูลแจ้งซ้อมบำรุง
    $('#submitmaintenance').on('click', function(e) {
        Postdata('Maintenance')
    });

    //////////////// Chat
    async function PostChat() {
        if (document.getElementById("txt_msg").value == '' && arr.length == 0) {
            return;
        }

        var datamember = Cookies.get('datamember'); ////// ลูกบ้าน
        if (datamember != undefined) {
            datamember = JSON.parse(datamember)
        } else {
            datamember = Cookies.get('datamemberID');
            datamember = JSON.parse(datamember)
        }
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'chat';
            let formData = new FormData();
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('uId', datamember.userId);
                formData.append('ticketId', document.getElementById("ticketId").value);
                formData.append('chatImage', '');
                formData.append('description', document.getElementById("txt_msg").value);
                formData.append('sender', datamember.username);
            } else {
                if (document.getElementById("txt_msg").value == '') {
                    document.getElementById("txt_msg").value = 'txt_msg_description'
                }
                formData.append('userId', userId);
                formData.append('uId', datamember.userId);
                formData.append('ticketId', document.getElementById("ticketId").value);

                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('chatImage', arr[i]);
                    }
                }
                formData.append('description', document.getElementById("txt_msg").value);
                formData.append('sender', datamember.username);
            }
            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                document.getElementById("txt_msg").value = ''


                $("#addImagenew").empty();
                $("#id_incoming_msg").empty();

                ///// ส่ง chat
                const socket = io(urlipaddress);
                socket.emit('sentMessage', document.getElementById("ticketId").value);



            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)

            });
        });
    }


    //////////////// ChatImageTiltle
    async function PostChatImageTitle(fileimage) {
        if (document.getElementById("txt_msg").value == '' && arr.length == 0) {
            return;
        }

        var datamember = Cookies.get('datamember'); ////// ลูกบ้าน
        if (datamember != undefined) {
            datamember = JSON.parse(datamember)
        } else {
            datamember = Cookies.get('datamemberID');
            datamember = JSON.parse(datamember)
        }
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'chat';
            let formData = new FormData();
            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('uId', datamember.userId);
                formData.append('ticketId', document.getElementById("ticketId").value);
                formData.append('chatImage', '');
                formData.append('description', document.getElementById("txt_msg").value);
                formData.append('sender', datamember.username);
            } else {
                if (document.getElementById("txt_msg").value == '') {
                    document.getElementById("txt_msg").value = 'txt_msg_description'
                }
                formData.append('userId', userId);
                formData.append('uId', datamember.userId);
                formData.append('ticketId', document.getElementById("ticketId").value);
                formData.append('chatImage', fileimage);
                formData.append('description', document.getElementById("txt_msg").value);
                formData.append('sender', datamember.username);
            }
            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                document.getElementById("txt_msg").value = ''


                $("#addImagenew").empty();
                $("#id_incoming_msg").empty();

                ///// ส่ง chat
                const socket = io(urlipaddress);
                socket.emit('sentMessage', document.getElementById("ticketId").value);



            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)

            });
        });
    }
    //////////////// POST
    async function Postdata(type) {
        var datamember = Cookies.get('datamember'); ////// ลูกบ้าน
        if (datamember != undefined) {
            datamember = JSON.parse(datamember)
        } else {
            datamember = Cookies.get('datamemberID');
            datamember = JSON.parse(datamember)
        }
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'ticket';

            const dataticket = {
                userId: userId,
                uId: datamember.userId,
                title: document.getElementById("title").value,
                assignee: datamember.username,
                priority: document.getElementById("priority").value,
                status: 'Open',
                type: type
            }
            axios.post(urlipaddress + 'ticket', dataticket, {
                headers: {
                    'Authorization': result
                }
            }).then(async function(response) {
                console.log(response.data.message)
                if (response.data.message == 'add ticket completed') {
                    if (type == 'appeal') {
                        var dataticket = await getserviecAll(type)
                        document.getElementById("txt_msg").value = 'txt_msg_description'
                        document.getElementById("ticketId").value = dataticket.ticketId
                        console.log(arr)
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] != " ") {
                                await PostChatImageTitle(arr[i]);
                            }
                        }
                        showSuccessMessage('appeal.html');
                    }
                    if (type == 'inform') {
                        var dataticket = await getserviecAll(type)
                        document.getElementById("txt_msg").value = 'txt_msg_description'
                        document.getElementById("ticketId").value = dataticket.ticketId
                        console.log(arr)
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] != " ") {
                                await PostChatImageTitle(arr[i]);
                            }
                        }
                        showSuccessMessage('inform.html');
                    }
                    if (type == 'Maintenance') {
                        var dataticket = await getserviecAll(type)
                        document.getElementById("txt_msg").value = 'txt_msg_description'
                        document.getElementById("ticketId").value = dataticket.ticketId
                        console.log(arr)
                        for (var i = 0; i < arr.length; i++) {
                            if (arr[i] != " ") {
                                await PostChatImageTitle(arr[i]);
                            }
                        }
                        showSuccessMessage('maintenance.html');
                    }

                }

            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
            });
        });
    }

    const getserviecAll = async(_type) => {
        return new Promise(resolve => {
            $.getScript("ip.js", function(data, textStatus, jqxhr) {
                var urlipaddress = data.substring(1, data.length - 1);

                var param = userId + '?uId=' + datamember.userId + '&type=' + _type + '&status=Open%20OR%20In%20Progress&' + '_page=1&_limit=100&_sort=1'
                axios.get(urlipaddress + 'ticket/' + param, {
                    headers: {
                        'Authorization': result
                    }
                }).then(function(response) {
                    resolve(response.data.message.result[response.data.message.result.length - 1])


                }).catch(function(res) {
                    const { response } = res
                });
            });
        });
    }


    ////////////////////  ทำรายการชำระเงิน
    $('#submitpostinvoice').on('click', function(e) {
        var Strref2 = document.getElementById("ref2").value.split('@')
        console.log(Strref2[0])
        console.log(Strref2)


        var datamember = Cookies.get('datamember');
        if (datamember != undefined) {
            datamember = JSON.parse(datamember)
        } else {
            datamember = Cookies.get('datamemberID');
            datamember = JSON.parse(datamember)
        }
        $.getScript("ip.js", function(data, textStatus, jqxhr) {
            var urlipaddress = data.substring(1, data.length - 1);
            const url = urlipaddress + 'invoice';
            let formData = new FormData();
            var d_date = document.getElementById('dueDate').value
            document.getElementById("p_saveinvoice").innerText = ''
            var s_date;
            var str_startdate
            var str_duetdate
            if (d_date == '') {
                showCancelMessage('กรุณาระบุวันที่ครบชำระ', '');
                // document.getElementById("p_saveinvoice").innerText = 'กรุณาระบุวันที่ครบชำระ'
                // document.getElementById("p_saveinvoice").style.color = 'red'
                return

            } else {
                s_date = document.getElementById('startDate').value.split('/');
                d_date = document.getElementById('dueDate').value.split('/');

                str_startdate = convertTZ(s_date[2] + '-' + s_date[1] + '-' + s_date[0], 'Asia/Bangkok').toISOString()
                str_duetdate = convertTZ(d_date[2] + '-' + d_date[1] + '-' + d_date[0], 'Asia/Bangkok').toISOString()

            }

            function convertTZ(date, tzString) {
                return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
            }


            if (document.getElementById("amount").value == '') {
                showCancelMessage('กรุณาระบุจำนวนเงิน', '');
                // document.getElementById("p_saveinvoice").innerText = 'กรุณาระบุจำนวนเงิน'
                // document.getElementById("p_saveinvoice").style.color = 'red'
                return
            }
            if (document.getElementById("category").value == '') {
                showCancelMessage('กรุณาระบุประเภทค่าใช้จ่าย', '');
                // document.getElementById("p_saveinvoice").innerText = 'กรุณาระบุประเภทค่าใช้จ่าย'
                // document.getElementById("p_saveinvoice").style.color = 'red'
                return
            }
            if (document.getElementById("ref2").value == '') {
                showCancelMessage('กรุณาเลือกบ้านเลขที่', '');
                // document.getElementById("p_saveinvoice").innerText = 'กรุณาระบุบ้านเลขที่'
                // document.getElementById("p_saveinvoice").style.color = 'red'
                return
            }

            if (arr.length == 0) {
                formData.append('userId', userId);
                formData.append('uId', Strref2[0]); ///// userID member
                formData.append('invoiceImage', '');
                formData.append('ref2', Strref2[1]);
                formData.append('category', document.getElementById("category").value);
                formData.append('status', 'ค้างชำระ');
                formData.append('amount', document.getElementById("amount").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('startDate', str_startdate);
                formData.append('dueDate', str_duetdate);

            } else {

                formData.append('userId', userId);
                formData.append('uId', Strref2[0]);
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] != " ") {
                        formData.append('invoiceImage', arr[i]);
                    }
                }
                formData.append('ref2', Strref2[1]);
                formData.append('category', document.getElementById("category").value);
                formData.append('status', 'ค้างชำระ');
                formData.append('amount', document.getElementById("amount").value);
                formData.append('description', document.getElementById("description").value);
                formData.append('startDate', str_startdate);
                formData.append('dueDate', str_duetdate);

            }


            axios.post(url, formData, {
                headers: {
                    'Authorization': result
                }
            }).then(function(response) {
                console.log(response.data.message)
                if (response.data.message == 'add invoice completed') {
                    // document.getElementById("p_saveinvoice").innerText = 'บันทึกข้อมูลสำเร็จ'
                    // document.getElementById("p_saveinvoice").style.color = 'green'
                    //return

                    showSuccessMessage('invoice.html');
                }
            }).catch(function(res) {
                const { response } = res
                console.log(response.data.message)
                showCancelMessage(response.data.message, '')
                    // if (response.data.message == 'Please specify a announceImage.') {
                    //     document.getElementById("p_saveinvoice").innerText = 'กรุณาระบุเลือกไฟล์รูปภาพ'
                    //     document.getElementById("p_saveinvoice").style.color = 'red'
                    //     return
                    // }
            });
        });
    });




    async function showCancelMessageallnotice(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function(isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }

    async function showSuccessMessageallnotice(page) {
        swal({
            title: "สำเร็จ",
            text: "บันทึกข้อมูลสำเร็จ",
            type: "success",
        }, function(isConfirm) {
            if (isConfirm) {
                location.href = page;
            }
        });
    }


    async function showCancelMessage(title, text) {
        swal({
            title: title,
            text: text,
            type: "error",
        }, function(isConfirm) {
            swal("Cancelled", "Your imaginary file is safe :)", "error");
        });
    }

    async function showSuccessMessage(page) {
        swal({
            title: "สำเร็จ",
            text: "บันทึกข้อมูลสำเร็จ",
            type: "success",
        }, function(isConfirm) {
            if (isConfirm) {
                location.href = page;
            }
        });
    }

    function getDataUrl(file, callback2) {
        var callback = function(srcOrientation) {
            var reader2 = new FileReader();
            reader2.onload = function(e) {
                var srcBase64 = e.target.result;
                var img = new Image();
                img.onload = function() {
                    var width = img.width,
                        height = img.height,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext("2d");

                    // set proper canvas dimensions before transform & export
                    if (4 < srcOrientation && srcOrientation < 9) {
                        canvas.width = height;
                        canvas.height = width;
                    } else {
                        canvas.width = width;
                        canvas.height = height;
                    }
                    // transform context before drawing image
                    switch (srcOrientation) {
                        case 2:
                            ctx.transform(-1, 0, 0, 1, width, 0);
                            break;
                        case 3:
                            ctx.transform(-1, 0, 0, -1, width, height);
                            break;
                        case 4:
                            ctx.transform(1, 0, 0, -1, 0, height);
                            break;
                        case 5:
                            ctx.transform(0, 1, 1, 0, 0, 0);
                            break;
                        case 6:
                            ctx.transform(0, 1, -1, 0, height, 0);
                            break;
                        case 7:
                            ctx.transform(0, -1, -1, 0, height, width);
                            break;
                        case 8:
                            ctx.transform(0, -1, 1, 0, 0, width);
                            break;
                        default:
                            break;
                    }
                    // draw image
                    ctx.drawImage(img, 0, 0);
                    // export base64
                    callback2(canvas.toDataURL(file.type, 1.0));
                    //console.log(canvas.toDataURL(file.type,1.0))
                };
                img.src = srcBase64;
                // arr[n] = dataURLtoFile(srcBase64, file.name);
                // arr[n] = img;
            }
            reader2.readAsDataURL(file);
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            var length = view.byteLength,
                offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++)
                        if (view.getUint16(offset + (i * 12), little) == 0x0112)
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                } else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }
    // return;





});
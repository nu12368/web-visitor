
var length_img;
var arr = new Array();
var arrimagedelete = new Array();
var n = 0;
var num_index_edit = 0;
var _idupdate;
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
console.log(userId)


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

$(async function () {
    console.log('dsdssds')
    const result = await acctoken();
    var imagesPreview = function (input) {
        if (input.files) {
            var filesAmount = input.files.length;
            document.getElementById("imgsixeedit2").innerText = '';
            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();
                var typefile = input.files[i].name.split('.');
                if (typefile[1] != 'PNG' && typefile[1] != 'JPG' && typefile[1] != 'jpg' && typefile[1] != 'jpeg' && typefile[1] != 'png') {
                    document.getElementById("imgsixeedit2").innerText = 'เลือกรูปภาพใหม่ เป็นไฟล์ JPEG, JPG, PNG !!!' + '\n' + input.files[i].name;
                    document.getElementById("imgsixeedit2").style.color = "red";
                    return;
                }
                // if (input.files[i].size > 2192282) {
                //     //  alert('1111111111111')
                //     document.getElementById("imgsixeedit2").innerText = "ขนาดภาพใหญ่เกินไป !!" + '\n' + input.files[i].name;
                //     document.getElementById("imgsixeedit2").style.color = "red";
                //     return;
                // }
                reader.onload = function (event) {
                    length_img = $("#EditaddImage2 img");
                    if (length_img.length > 4) {

                        document.getElementById("imgsixeedit2").innerText = "อัพไฟล์รูปได้ไม่เกิน 5 รูป !!!";
                        document.getElementById("imgsixeedit2").style.color = "red";
                        return;
                    }
                }
                reader.readAsDataURL(input.files[i]);
            }
        }
        return;
    };
    function resize(item) {
        //define the width to resize e.g 600px
        var resize_width = 600;//without px
        // console.log(item.files)
        for (i = 0; i < item.files.length; i++) {
            //get the image selected
            // var item = document.querySelector('#uploader').files[0];

            //create a FileReader
            var reader = new FileReader();

            //image turned to base64-encoded Data URI.
            reader.readAsDataURL(item.files[i]);
            reader.name = item.files[i].name;//get the image's name
            reader.size = item.files[i].size; //get the image's size
            reader.onload = function (event) {
                var img = new Image();//create a image
                img.src = event.target.result;//result is base64-encoded Data URI
                img.name = event.target.name;//set name (optional)
                img.size = event.target.size;//set size (optional)
                img.onload = function (el) {
                    var elem = document.createElement('canvas');//create a canvas

                    //scale the image to 600 (width) and keep aspect ratio
                    var scaleFactor = resize_width / el.target.width;
                    elem.width = resize_width;
                    elem.height = el.target.height * scaleFactor;

                    //draw in canvas
                    var ctx = elem.getContext('2d');
                    ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

                    //get the base64-encoded Data URI from the resize image
                    var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);

                    //assign it to thumb src
                    //    document.querySelector('#image').src = srcEncoded;

                    /*Now you can send "srcEncoded" to the server and
                    convert it to a png o jpg. Also can send
                    "el.target.name" that is the file's name.*/

                    //  console.log(event.target.name)
                    var _file = dataURLtoFile(srcEncoded, event.target.name)
                    console.log(_file)

                    $("#EditaddImage2").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${n}" src="${srcEncoded} "class="cc img-responsive thumbnail"></i></a>`);

                    arr[n] = dataURLtoFile(srcEncoded, event.target.name);
                    n = n + 1;

                }
            }
        }
    }
    var namefile;
    var typename;
    $('#edit_fileimage2').on('change', function () {
        length_img = $("#EditaddImage2 img");
        resize(this);
       // imagesPreview(this);
        // var file_data = $('#edit_fileimage2').prop('files');
        // var file_length = document.getElementById("edit_fileimage2").files.length;

        // for (var i = 0; i < file_length; i++) {
        //     typename = file_data[i].type;
        //     namefile = file_data[i].name
        //     _checkimage(file_data[i]);
        //     if (file_data[i].size > 2192282) {
        //         return;
        //     }
        // }
        return
    });


    function _checkimage(_file) {
        getDataUrl(_file, function (imgBase64) {
            $("#EditaddImage2").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
            <i name="${n}" class="delete_cc fa fa-times fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12"><img name="${n}" src="${imgBase64}"class="img-responsive thumbnail"></i></a>`);

            arr[n] = dataURLtoFile(imgBase64, _file.name);

            n = n + 1;

            //  console.log(n)
        });

        console.log(arr)
    }



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

    function getDataUrl(file, callback2) {
        var callback = function (srcOrientation) {
            var reader2 = new FileReader();
            reader2.onload = function (e) {
                var srcBase64 = e.target.result;
                var img = new Image();

                img.onload = function () {
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
                        case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
                        case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
                        case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
                        case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
                        case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
                        case 7: ctx.transform(0, -1, -1, 0, height, width); break;
                        case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
                        default: break;
                    }

                    // draw image
                    ctx.drawImage(img, 0, 0);

                    // export base64
                    callback2(canvas.toDataURL(file.type, 1.0));
                };
                img.src = srcBase64;
            }
            reader2.readAsDataURL(file);
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
            var length = view.byteLength, offset = 2;
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
                }
                else if ((marker & 0xFF00) != 0xFF00) break;
                else offset += view.getUint16(offset, false);
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }





    ///////// ลบรูปภาพ
    $('#EditaddImage2').on('click', 'i.delete_cc', function (e) {
        var remove_index = $(this).attr("name");
        arrimagedelete[remove_index] = arr[remove_index];
        arr[parseInt(remove_index)] = " ";
        $(this).remove();
    });





    var data;
    $.getScript("ip.js", function (dataipaddress, textStatus, jqxhr) {
        var urlipad = dataipaddress.substring(1, dataipaddress.length - 1);
        $('#table_supplies').on('click', 'i.edit_supplies', function (e) {
            e.preventDefault();
            $("#EditaddImage2").empty();
            var table = $('#table_supplies').DataTable();
            e.preventDefault();
            var _ro = table.row($(this).parents('tr'));
            data = _ro.data();

            if (data == undefined) {
                data = table.row(this).data();
            }

            $("#myModaledit2").modal();

            //     console.log(_data.parcelImage)
            var nn = 0;
            for (let i in data.parcelImage) {
                console.log(data.parcelImage[i])

                axios.get(urlipad + "view/images/" + data.parcelImage[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function (response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is

                    $("#EditaddImage2").append(`<a id="close" style="font-size:18px;color:red; class="pull-right" href="#">
                    <i name="${n}" class="delete_cc  fa fa-times col-lg-3 col-md-4 col-sm-6 col-xs-12" ><img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
                   
                    arr[n] = dataURLtoFileEdit("data:" + mimetype + ";base64," + b64encoded, nn.toString() + '.jpg');
                    n = n + 1;
                });

                nn = nn + 1;
            }
            console.log(data.status)
            if (data.status == 'new') {
                data.status = 'มา'
            }


            document.getElementById("edit_submitsupplies2").disabled = false;
            if (data.status == 'รับแล้ว' || data.status == 'ส่งคืน') {
                console.log(data.status)
                document.getElementById("edit_submitsupplies2").disabled = true;
            }

            $("#_id_updatedata2").val(data.parcelId);
            $("#roomedit2").val(data.room);
            $("#descriptionedit2").val(data.description);
            $("#statusdeit2").val(data.status);


        });


        /////////////////////////// แก้ไข
        $('#edit_submitsupplies2').on('click', function (e) {
            const url = urlipad + 'deliver';
            let formData = new FormData();
            formData.append('userId', userId);
            formData.append('parcelId', data.parcelId);
            formData.append('room', document.getElementById("roomedit2").value);
            formData.append('description', document.getElementById("descriptionedit2").value);
            formData.append('status', document.getElementById("statusdeit2").value);
         
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != " ") {
                   formData.append('parcelImage', arr[i]);
                }
            }

            axios.put(url, formData,{
                headers: {
                    'Authorization': result
                }
            }
            ).then(function (response) {
                console.log(response.data.message)
                showSuccessMessage('สำเร็จ', 'อัพเดทข้อมูลสำเร็จ','supplies.html');
             //   location.href = "supplies.html";
            }).catch(function (res) {
                const { response } = res
                showCancelMessage(response.data.message,'')
               // console.log(response.data.message)
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










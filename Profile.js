var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');

var datamember;
datamember = Cookies.get('datamember');
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

var strlogo
const getlogocompany = async(refresh_token) => {

    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);

        var param = userId
        axios.get(urlipaddress + 'logo/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(response) {
            console.log(response.data.message.data[0].name)

            if (datamember.rule == 'member') {
                document.getElementById('namecompynymember').innerText = response.data.message.data[0].name
            } else {
                document.getElementById('namecompyny').innerText = response.data.message.data[0].name
            }
            document.getElementById('editnamecompany').value = response.data.message.data[0].name

            document.getElementById('logoId').value = response.data.message.data[0].logoId
            document.getElementById('logoname').value = response.data.message.data[0].name
                // console.log( response.data.message.data[0].imageLogo[0])
            viewlogo(refresh_token, response.data.message.data[0].imageLogo[0])
        }).catch(function(res) {
            const { response } = res
        });
    });

}

function viewlogo(refresh_token, idlogo) {
    var n = 0;
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var param = userId
        axios.get(urlipaddress + "view/logo/" + idlogo, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': refresh_token
            }
        }).then(function(responseview) {
            console.log(responseview.data)
            var arrayBuffer = responseview.data; // Note: not oReq.responseText
            var u8 = new Uint8Array(arrayBuffer);
            var b64encoded = btoa(String.fromCharCode.apply(null, u8));
            var mimetype = "image/png"; // or whatever your image mime type is
            $('#imagelogoview').attr('src', "data:" + mimetype + ";base64," + b64encoded);
            //   console.log(b64encoded)

        });
    });

}

$(async function() {
    const result = await acctoken();
    getlogocompany(result)
    $.getScript("ip.js", function(data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        document.getElementById('userlogin').innerText = datamember.username
        if (datamember.imageProfile.length != 0) {
            for (let i in datamember.imageProfile) {
                axios.get(urlipaddress + "view/images/" + datamember.imageProfile[i], {
                    responseType: 'arraybuffer',
                    headers: {
                        'Authorization': result
                    }
                }).then(function(response) {
                    var arrayBuffer = response.data; // Note: not oReq.responseText
                    var u8 = new Uint8Array(arrayBuffer);
                    var b64encoded = btoa(String.fromCharCode.apply(null, u8));
                    var mimetype = "image/png"; // or whatever your image mime type is
                    $('#imageProfile').attr('src', "data:" + mimetype + ";base64," + b64encoded);
                });
            }
        }


        return


    });




});
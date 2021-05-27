

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


//////////////////////////////////////////////////////ประเภทค่าใช้จ่าย

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
                $select.append('<option value=' + ' ' + '>' + '-- เลือกประเภทค่าใช้จ่าย --' + '</option>');
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

    const responsecategory = await getcategory(result);   ///////  ประเภทค่าใช้จ่าย

});
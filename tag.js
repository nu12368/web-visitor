
var obj = JSON.parse(Cookies.get('datatoken'));
var userId = Cookies.get('datauserId');
var _arr = new Array();
var n = 0;
function acctoken() {
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
                if (response.data.message == "Unauthorized") {

                    location.href = "index.html";
                }
            });
        });
    });
}

const gettag = async (refresh_token) => {
    var _arr = new Array();
    var n = 0;
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        
        var param = userId
        axios.get(urlipaddress + 'groupAnnounce/' + param, {
            headers: {
                'Authorization': refresh_token
            }
        }).then(function (response) {
            console.log(response.data.message.result)

    
            var $select = $('#selecttag');
            $select.find('option').remove();
            $select.append('<option value=' + ' ' + '>' + '-- เลือก TAG --' + '</option>');
            $.each(response.data.message.result, function (key, value) {
              //  console.log(value.tag)
                if(value.tag !=''){
                    $select.append('<option value=' + value.tag + '>' + value.tag + '</option>');
                }
            });

            var $select = $('#editselecttag');
            $select.find('option').remove();
            $select.append('<option value=' + ' ' + '>' + '-- เลือก TAG --' + '</option>');
            $.each(response.data.message.result, function (key, value) {
              //  console.log(value.tag)
                if(value.tag !=''){
                    $select.append('<option value=' + value.tag + '>' + value.tag + '</option>');
                }
            });
        }).catch(function (res) {
            const { response } = res
        });
    });

  
}


$(async function () {
    const result = await acctoken();
    gettag(result)
});
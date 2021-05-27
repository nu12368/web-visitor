$(function () {
    var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
var data = getUrlParameter('prm');

    
  
 var jsondata =  JSON.parse(data);

 //console.log(jsondata)


//console.log(jsondata._image)

 for (let i in jsondata._image) {
    $('#a_imgtab' + i).attr('href', 'https://www.wacinfotech.com/community/'+jsondata._image[i]);
    $('#imgproduct' + i).attr('src','https://www.wacinfotech.com/community/'+jsondata._image[i]);
    $('#imgtab' + i).attr('src','https://www.wacinfotech.com/community/'+jsondata._image[i]);
}

$('#titlename').text(jsondata._title);
$('#_price').text('฿ ' +jsondata._price);
$('#_stock').val(jsondata._stock);
$('#_description').text(jsondata._description);

});
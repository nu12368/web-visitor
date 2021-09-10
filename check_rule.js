$(function () {
    var userId = Cookies.get('datamemberID');
    userId = JSON.parse(userId)



    if (userId.rule == 'Super Admin') {
        $('#rule').empty();
        var $select = $('#rule');
        $select.append('<option value=' + '0' + '>' + '-- กำหนดสิทธิ์ --' + '</option>');
        $select.append('<option value=Admin>Admin</option>');
    }
    if (userId.rule == 'Admin') {
        document.getElementById('home').style.display = 'none'
        document.getElementById('tab_home').style.display = 'none'
        document.getElementById('userhome').classList.add("active");
        
    }
});
const userId = '5fe2c8a089d27d3818e4bcba'

$(function () {
    $.getScript("ip.js", function (data, textStatus, jqxhr) {
        var urlipaddress = data.substring(1, data.length - 1);
        var today = new Date();
        var date = today.getFullYear().toString() + (today.getMonth() + 1).toString() + today.getDate().toString();
  
       const paramLog = '_id=' + userId + '&_time=' + date + '&_before=true&_page=1&_limit=1000000'


        var n = 0;
        var num = 1;
        var _arr = new Array();
        axios.get(urlipaddress + 'visitorLog?' + paramLog).then(function (responseLog) {
            var cnt_Log = responseLog.data.message.result.length;
            for (i = 0; i < cnt_Log; i++) {
                if (responseLog.data.message.result[i].visitorType == undefined && responseLog.data.message.result[i].visitorNumber == undefined) {
                } else {
                    _arr[n] = {
                       // num: num,
                       visitorNumber: responseLog.data.message.result[i].visitorNumber,
                        visitorType: responseLog.data.message.result[i].visitorType,
                        citizenId: responseLog.data.message.result[i].citizenId,
                        name: responseLog.data.message.result[i].name,
                        licensePlate: responseLog.data.message.result[i].licensePlate,
                        vehicleType: responseLog.data.message.result[i].vehicleType,
                        contactPlace: responseLog.data.message.result[i].contactPlace,
                        recordTimeIn: responseLog.data.message.result[i].recordTimeIn,
                        recordTimeOut: responseLog.data.message.result[i].recordTimeOut,
                        etc: responseLog.data.message.result[i].etc,
                        image: responseLog.data.message.result[i].image1 + " " + responseLog.data.message.result[i].image2 + " " + responseLog.data.message.result[i].image3 + " " + responseLog.data.message.result[i].image4,
                        visitorId: responseLog.data.message.result[i].visitorId                  
                    }
                    n = n + 1
                    num = num + 1
                }
            }


            var table = $('#table1').DataTable({
                "lengthMenu": [[20, 50, 100], [20, 50, 100]],
                "pageLength": 20,
                'data': _arr,
                "ordering": false,
                "responsive": true,
                "autoWidth": false,
                orderCellsTop: true,
                fixedHeader: true,
                "order": [],
                columns: [
                   // { data: "num" },
                   { data: "visitorNumber" },
                    { data: "visitorType" },
                 
                    { data: "licensePlate" },
                    { data: "contactPlace" },
                    { data: "citizenId" },
                    { data: "name" },
                    { data: "vehicleType" },
                    {
                        data: "recordTimeIn",
                        render: function (data) {
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                          if(date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date'){
                              return '-';
                          }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },
                    {
                        data: "recordTimeOut",
                        render: function (data) {
                          
                            let date = new Date(data);
                            let options = { hour12: false };
                            var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
                          if(date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date'){
                              return '-';
                          }
                            return sp[1] + "/" + sp[0] + "/" + sp[2];
                        }
                    },

                    {
                        data: null,
                        className: "center",
                        defaultContent: '<i href="" class="view_visitor" style="font-size:16px;color:blue; cursor: pointer;">รูปภาพ </i>'
                    },
                    { data: "etc" },

                ],
                dom: 'lBfrtip',
                buttons: [
                    {
                        title: 'export',
                        text:'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
                        extend: 'excel',
                        footer: false,
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4,5,6,7,8,10]
                        }

                    }
                    
                ],
                //////////////////// ประเภท Visitor  ไปเอามาจาก
                initComplete: function () {
                    this.api().columns(1).every(function () {
                        var column = this;
                        $(column.header()).append("<br/><p></p>")
                        var select = $('<select><option>ทั้งหมด</option></select>')
                            .appendTo($(column.header()))
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                  
                                );
                             //   console.log(val.toString().replace("",''))
                             //   console.log(val.length)
                                   if(val == 'ทั้งหมด'){
                                    val = '';
                                }
                                column
                                    .search(val ? '^' + val + '$' : '', true, false)
                                    .draw();
                            });
                    
                         $.each(_arrvisitorType, function (key, value) {
                            select.append('<option value=' + value.visitorType + '>' + value.visitorType + '</option>');
                        });
                       
                    });


                    /////////////// เลข Visitor
                    this.api().columns(2).every(function () {
                        var column = this;
                        $(column.header()).append("<br/><br/>")
                        var select = $('<input type="text" class="form-control" placeholder="Search เลข visitor" />')
                            .appendTo($(column.header()))
                            .on('keyup change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                column
                                    .column(2)
                                    .search(this.value)
                                    .draw();
                            });
                    });


                    /////////////// ทะเบียนรถ
                    this.api().columns(3).every(function () {
                        var column = this;
                        $(column.header()).append("<br/><br/>")
                        var select = $('<input type="text" class="form-control" placeholder="Search ทะเบียนรถ" />')
                            .appendTo($(column.header()))
                            .on('keyup change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                column
                                    .column(2)
                                    .search(this.value)
                                    .draw();
                            });
                    });

                        /////////////// สถานที่ติดต่อ
                        this.api().columns(4).every(function () {
                            var column = this;
                            $(column.header()).append("<br/><br/>")
                            var select = $('<input type="text" class="form-control" placeholder="Search ทะเบียนรถ" />')
                                .appendTo($(column.header()))
                                .on('keyup change', function () {
                                    var val = $.fn.dataTable.util.escapeRegex(
                                        $(this).val()
                                    );
                                    column
                                        .column(2)
                                        .search(this.value)
                                        .draw();
                                });
                        });
                }
            });


        }).catch(function (res) {
            const { response } = res
        });


       
    });


});
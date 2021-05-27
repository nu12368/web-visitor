// var obj = JSON.parse(Cookies.get('datatoken'));
// var userId = Cookies.get('datauserId');
// var datamember = Cookies.get('datamember');
// datamember = JSON.parse(datamember)
// var _arr = new Array();
// var n = 0;

// function acctoken() {
//     return new Promise(resolve => {
//         $.getScript("ip.js", function (data, textStatus, jqxhr) {
//             var urlipaddress = data.substring(1, data.length - 1);
//             axios.post(urlipaddress + 'token', data, {
//                 headers: {
//                     'Authorization': obj.refresh_token
//                 }
//             }).then(function (response) {
//                 resolve(response.data.message.access_token);

//             }).catch(function (res) {
//                 const { response } = res
//                 if (response.data.message == "Unauthorized") {
//                     location.href = "index.html";
//                 }
//             });
//         });
//     });
// }

// const getvisitorsupplies = async (refresh_token, page) => {
//     console.log(refresh_token)
//     var _arr = new Array();
//     var n = 0;
//     $.getScript("ip.js", function (data, textStatus, jqxhr) {
//         var urlipaddress = data.substring(1, data.length - 1);
//         var param = userId + '?_page=' + page + '&_limit=100&_sort=1'
//         axios.get(urlipaddress + 'deliver/' + param, {
//             headers: {
//                 'Authorization': refresh_token
//             }
//         }).then(function (response) {

           
//             if (response.data.message.result.length != 0) {
//                 console.log(response.data.message.result)
//                 console.log(datamember)
//                 const toDate = str => {
//                     const [d, t] = str.split(' ')
//                     return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
//                 };
//                 const compareByDate = (x, y) => toDate(y.registerDate) - toDate(x.registerDate);
//                 response.data.message.result.sort(compareByDate);
//                 const reversed = response.data.message.result.reverse()


//                 // var table = $('#table_supplies').DataTable({
//                 //     "lengthMenu": [[25, 50, 100], [25, 50, 100]],
//                 //     "pageLength": 25,
//                 //     'data': [...reversed],
//                 //     "ordering": false,
//                 //     "responsive": true,
//                 //     "autoWidth": false,
//                 //     orderCellsTop: true,
//                 //     fixedHeader: true,
//                 //     "order": [],
//                 //     columns: [
//                 //         { data: "room" },
//                 //         { data: "description" },
//                 //         { data: "status" },

//                 //         {
//                 //             data: "registerDate",
//                 //             render: function (data) {

//                 //                 let date = new Date(data);
//                 //                 let options = { hour12: false };
//                 //                 var sp = date.toLocaleString('en-US', options).replace(',', '').split('/')
//                 //                 if (date.toLocaleString('en-US', options).replace(',', '') == 'Invalid Date') {
//                 //                     return '-';
//                 //                 }
//                 //                 return sp[1].padStart(2, '0') + "/" + sp[0].padStart(2, '0') + "/" + sp[2];
//                 //             }
//                 //         },
//                 //         {
//                 //             data: null,
//                 //             className: "center",
//                 //             defaultContent: '<i href="" class="view_img" style="cursor: pointer;">รูปภาพ </i> '
//                 //         },
//                 //         {
//                 //             data: null,
//                 //             className: "center",
//                 //             defaultContent: '<i href="" class="view_receiver" style="cursor: pointer;">รูปภาพ'
//                 //         },
//                 //         {
//                 //             data: null,
//                 //             className: "center",
//                 //             defaultContent: '<i href="" class="view_edit" style="cursor: pointer;">ส่งมอบ'
//                 //         },
//                 //         {
//                 //             data: null,
//                 //             className: "center",
//                 //             defaultContent: '<i href="" class="edit_supplies" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข </i>'
//                 //         },
//                 //         { data: "parcelImage", 'visible': false },
//                 //         { data: "receiverImage", 'visible': false },
//                 //     ],

//                 //     dom: 'lBfrtip',
//                 //     buttons: [
//                 //         {
//                 //             title: 'export',
//                 //             text: 'Export <i class="fa fa-file-excel-o" style="font-size:30px"></i>',
//                 //             extend: 'excel',
//                 //             footer: false,
//                 //             exportOptions: {
//                 //                 columns: [0, 1, 2, 3]
//                 //             }
//                 //         }
//                 //     ],
//                 //     "createdRow": function (row, data, dataIndex) {
//                 //         if (data.status == "รับแล้ว") {
//                 //             $(row).addClass('green');
//                 //         } else if (data.status == "ส่งคืน") {
//                 //             $(row).addClass('red');
//                 //         }
//                 //         else {
//                 //             $(row).addClass('yellow');
//                 //         }
//                 //     }
//                 // });
//                 // table.buttons().container().appendTo($('#test'));
//             }
//         }).catch(function (res) {
//             const { response } = res
//         });
//     });

// }


// $(async function () {
//     console.log('dsdssds')
//     const result = await acctoken();
//     for (let i = 1; i < 10; i++) {
//         responseappointment = await getvisitorsupplies(result, i)
//     }
//     // $(document).ready(function () {
//     //     $.getScript("ip.js", function (data, textStatus, jqxhr) {
//     //         var urlipaddress = data.substring(1, data.length - 1);

//     //         /////// ดูรูปภาพ
//     //         $('#table_supplies').on('click', 'i.view_img', function (e) {
//     //             var table = $('#table_supplies').DataTable();
//     //             e.preventDefault();
//     //             var _ro = table.row($(this).parents('tr'));
//     //             var data = _ro.data();

//     //             if (data == undefined) {
//     //                 data = table.row(this).data();
//     //             }
//     //             $("#viewImage").empty();
//     //             console.log(data.parcelImage)
//     //             $("#myModalview").modal();
//     //             var nn = 0;
//     //             for (let i in data.parcelImage) {
//     //                 console.log(data.parcelImage[i])

//     //                 axios.get(urlipaddress + "view/images/" + data.parcelImage[i], {
//     //                     responseType: 'arraybuffer',
//     //                     headers: {
//     //                         'Authorization': result
//     //                     }
//     //                 }).then(function (response) {
//     //                     var arrayBuffer = response.data; // Note: not oReq.responseText
//     //                     var u8 = new Uint8Array(arrayBuffer);
//     //                     var b64encoded = btoa(String.fromCharCode.apply(null, u8));
//     //                     var mimetype = "image/png"; // or whatever your image mime type is

//     //                     $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
//     //                 });

//     //                 nn = nn + 1;
//     //             }

//     //         });


//     //         /////// ดูรูปภาพผู้รับ
//     //         $('#table_supplies').on('click', 'i.view_receiver', function (e) {
//     //             console.log('dsdsd')
//     //             var table = $('#table_supplies').DataTable();
//     //             e.preventDefault();
//     //             var _ro = table.row($(this).parents('tr'));
//     //             var data = _ro.data();

//     //             if (data == undefined) {
//     //                 data = table.row(this).data();
//     //             }
//     //             $("#viewImage").empty();
//     //             console.log(data.receiverImage)
//     //             $("#myModalview").modal();
//     //             var nn = 0;
//     //             for (let i in data.receiverImage) {
//     //                 console.log(data.receiverImage[i])

//     //                 axios.get(urlipaddress + "view/images/" + data.receiverImage[i], {
//     //                     responseType: 'arraybuffer',
//     //                     headers: {
//     //                         'Authorization': result
//     //                     }
//     //                 }).then(function (response) {
//     //                     var arrayBuffer = response.data; // Note: not oReq.responseText
//     //                     var u8 = new Uint8Array(arrayBuffer);
//     //                     var b64encoded = btoa(String.fromCharCode.apply(null, u8));
//     //                     var mimetype = "image/png"; // or whatever your image mime type is

//     //                     $("#viewImage").append(`<img name="${b64encoded}" style="width: 600px;" src="${"data:" + mimetype + ";base64," + b64encoded}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12" >`);
//     //                 });

//     //                 nn = nn + 1;
//     //             }
//     //         });
//     //     });

//     // });
// });

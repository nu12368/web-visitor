$(function() {
    const databeacon = [{
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000011",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647827",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:14+08:00",
            "type": "S1",
            "mac": "CC3101000034",
            "bleName": "S1",
            "rssi": -76,
            "battery": 100,
            "temperature": 21.23,
            "humidity": 43.23
        },
        {
            "timestamp": " 2017-04-28T08:16:14+08:00",
            "type": "Unknown",
            "mac": "EF3101000034",
            "bleName": "MI",
            "rssi": -76,
            "rawData": "3A4E24FB1AFCFC6EB07647825FDA50693A4E24FB1AFCFC6EB07647825"
        },
        {
            "timestamp": " 2017-04-28T08:16:14+08:00",
            "type": "Gateway",
            "mac": "EF3101000034",
            "bleName": "GW -EF3101000034",
        }, {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000012",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647825",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        }, {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000088",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647825",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },

        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000141",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647801",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000014",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647802",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000015",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647803",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000016",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647804",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000017",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647805",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000018",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647806",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000019",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647807",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000021",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647808",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000022",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647809",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000023",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647810",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000024",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647811",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000025",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647813",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000026",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647814",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000027",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647815",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
        {
            "timestamp": "2017-04-28T08:16:13+08:00",
            "type": "iBeacon",
            "mac": "CC0101000028",
            "bleName": "MiniBeacon_00012",
            "ibeaconUuid": "FDA50693A4E24FB1AFCFC6EB07647816",
            "ibeaconMajor": 10001,
            "ibeaconMinor": 19641,
            "ibeaconTxPower": -58,
            "rssi": -76,
            "battery": 100,
        },
    ]
    const datalist = [{
            "mac": 'CC0101000011',
            'name': 'อนุชา เที่ยมสม',
            'type': 'Visitor',
            'status': 'อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC3101000034',
            'name': 'วิทยา',
            'type': 'Visitor',
            'status': 'อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000012',
            'name': 'ศรัญ',
            'type': 'Visitor',
            'status': 'อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000088',
            'name': 'นิรุตต์ ศรัณฑ์ศิริ',
            'type': 'Employee',
            'status': 'ไม่อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000013',
            'name': 'สิรสา ศรีหะรัญ',
            'type': 'Employee',
            'status': 'ไม่อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000014',
            'name': 'ชาญวิทย์ ศรีสุวรรณ',
            'type': 'Employee',
            'status': 'ไม่อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000015',
            'name': 'ยศพนธิ์ ชุมภูชิต',
            'type': 'Employee',
            'status': 'ไม่อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000016',
            'name': 'โต๊ะ',
            'type': 'Asset',
            'status': 'ไม่อยู่',
            'gw': 'GW210124528225'
        },
        {
            "mac": 'CC0101000017',
            'name': 'เก้าอี้',
            'type': 'Asset',
            'status': 'ไม่อยู่',
            'gw': 'GW210124528225'
        },
        {
            "mac": 'CC0101000018',
            'name': 'เครื่องถ่ายเอกสาร',
            'type': 'Asset',
            'status': 'อยู่',
            'gw': 'GW210124528225'
        },
        {
            "mac": 'CC0101000019',
            'name': 'รถขนของ',
            'type': 'Asset',
            'status': 'อยู่',
            'gw': 'GW21016524414'
        },
        {
            "mac": 'CC0101000021',
            'name': 'คอมพิวเตอร์',
            'type': 'Asset',
            'status': 'ยืม'
        },
        {
            "mac": 'CC0101000022',
            'name': 'เครื่องสแกน',
            'type': 'Asset',
            'status': 'ยืม'
        }
    ]
    const datauser = [{
            mac: "CC0101000011",
            name: "อนุชา เที่ยมสม",
            idcard: '124545484554',
            tel: '0924458795',
            address: '12/7 กทม',
            type: 'Visitor'
        },
        {
            mac: "CC3101000034",
            name: "วิทยา",
            idcard: '548744585477',
            tel: '080154411',
            address: '134 กทม',
            type: 'Visitor'
        },
        {
            mac: "CC0101000088",
            name: "นิรุตต์ ศรัณฑ์ศิริ",
            type: 'Visitor',
            idcard: '124545484554',
            tel: '0924458795',
            address: '12/7 กทม'
        },
        {
            mac: 'CC0101000012',
            name: 'ศรัญ',
            type: 'Visitor',
            idcard: '128585854',
            tel: '0902258795',
            address: '9 ซอย ลาดพร้าว'
        },
        {
            mac: 'CC0101000088',
            name: 'นิรุตต์ ศรัณฑ์ศิริ',
            type: 'Employee',
            idcard: '0522424',
            tel: '0902148795',
            address: '25 ซอย ลาดพร้าว'

        },
        {
            mac: 'CC0101000013',
            name: 'สิรสา ศรีหะรัญ',
            type: 'Employee',
            idcard: '128585854',
            tel: '0902258795',
            address: '9 ซอย ลาดพร้าว'

        },
        {
            mac: 'CC0101000014',
            name: 'ชาญวิทย์ ศรีสุวรรณ',
            type: 'Employee',
            idcard: '128585854',
            tel: '0902258795',
            address: '9 ซอย ลาดพร้าว'

        },
        {
            mac: 'CC0101000015',
            name: 'ยศพนธิ์ ชุมภูชิต',
            type: 'Employee',
            idcard: '128585854',
            tel: '0902258795',
            address: '9 ซอย ลาดพร้าว'

        },
    ];

    const dataasset = [{
            mac: "CC0101000022",
            name: "เครื่องสแกน",
        },
        {
            mac: "CC0101000021",
            name: "คอมพิวเตอร์",
        },
        {
            mac: "CC0101000019",
            name: "รถขนของ",
        },
        {
            mac: 'CC0101000018',
            name: 'เครื่องถ่ายเอกสาร',
        },
        {
            mac: 'CC0101000017',
            name: 'เก้าอี้',

        },
        {
            mac: 'CC0101000016',
            name: 'โต๊ะ',

        }
    ];
    const dataGW = [{
            id: "GW210124578445",
            name: "ชั้น2",
        },
        {
            id: "GW210124528225",
            name: "ชั้น3",
        },
        {
            id: "GW21016524414",
            name: "ตึก B",
        },
    ];
    const data = [{
            name: "Visitor",
        },
        {
            name: "Employee",
        },
        {
            name: "Asset",
        },
    ];

    $("#tbl_tracking").append(`
    <thead>
    <tr>
        <th style="font-size: 22px;">รายการติดตาม</th>
    </tr>
</thead>
`);
    for (let i = 0; i < data.length; i++) {

        $("#tbl_tracking").append(`
    <tr  >
        <td>
        <div>
        <p style="text-align: center;">
        <div>
        <a class='name' id='${data[i].name}'> <b>
                <h3 style="text-align:justify; font-size: 20px; cursor:pointer;"
                > ${data[i].name}</h3>
            </b></a>
        </div>
        </p>
        <hr/>
        </div>
         </td>
     <td>
     </td>                
    </tr>
     `);
    }





    $('#table1_GW').DataTable().destroy();
    $('#table1_GW').DataTable({
        "pageLength": 25,
        'data': [...dataGW],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "id" },
            { data: "name" },
            {
                data: null,
                className: "center",
                defaultContent: '<i href="" class="view_img" style="cursor: pointer; color:blue;">รูปภาพ </i> '
            },
        ],
    });


    $('#table1_visitor').DataTable().destroy();
    $('#table1_visitor').DataTable({
        "pageLength": 25,
        'data': [...datauser],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "type" },
            { data: "mac" },
            { data: "idcard" },
            { data: "name" },
            { data: "tel" },
            { data: "address" },
            {
                data: null,
                className: "center",
                defaultContent: '<i href="" class="view_img" style="cursor: pointer; color:blue;">รูปภาพ </i> '
            },
        ],
    });

    $('#table1_asset').DataTable().destroy();
    $('#table1_asset').DataTable({
        "pageLength": 25,
        'data': [...dataasset],
        "responsive": true,
        "autoWidth": false,
        "order": [],
        columns: [
            { data: "mac" },
            { data: "name" },
            {
                data: null,
                className: "center",
                defaultContent: '<i href="" class="view_img" style="cursor: pointer; color:blue;">รูปภาพ </i> '
            },
        ],
    });








    $('#tbl_tracking').on('click', 'a.name', function(e) {
        var id = $(this).attr("id")
        console.log((id))
        document.getElementById('h_der').style.display = 'none'
        document.getElementById('div_list').style.display = 'none'
        document.getElementById('div_tracking').style.display = 'block'
        document.getElementById('namelist').innerText = id
        document.getElementById('a_back').style.display = 'block'

        var dataarr1 = new Array()
        var dataarr2 = new Array()
        var dataarr3 = new Array()
        var dataarr4 = new Array()
        var num = 0;
        var num1 = 0;
        var num2 = 0;
        var num3 = 0;
        for (const i in databeacon) {
            //  console.log(databeacon[i])
            for (const i2 in datalist) {
                // console.log(datalist[i])
                if (databeacon[i].mac == datalist[i2].mac) {
                    if (datalist[i2].type == id) {
                        for (const ii in dataGW) {
                            if (datalist[i2].gw == dataGW[ii].id) {
                                dataarr4[num] = {
                                    'mac': databeacon[i].mac,
                                    'name': datalist[i2].name,
                                    'property': JSON.stringify(databeacon[i]),
                                    'location': dataGW[ii].name
                                }
                                num = num + 1
                                if (datalist[i2].status == 'อยู่') {
                                    dataarr1[num1] = {
                                        'mac': databeacon[i].mac,
                                        'name': datalist[i2].name,
                                        'property': JSON.stringify(databeacon[i]),
                                        'location': dataGW[ii].name
                                    }
                                    num1 = num1 + 1
                                }
                                if (datalist[i2].status == 'ไม่อยู่') {
                                    dataarr2[num2] = {
                                        'mac': databeacon[i].mac,
                                        'name': datalist[i2].name,
                                        'property': JSON.stringify(databeacon[i]),
                                        'location': dataGW[ii].name
                                    }
                                    num2 = num2 + 1
                                }
                                if (datalist[i2].status == 'ยืม') {
                                    dataarr3[num3] = {
                                        'mac': databeacon[i].mac,
                                        'name': datalist[i2].name,
                                        'property': JSON.stringify(databeacon[i]),
                                        'location': dataGW[ii].name
                                    }
                                    num3 = num3 + 1
                                }
                            }
                        }
                    }

                }
            }

        }


        console.log(dataarr1)
        console.log(dataarr2)
        console.log(dataarr3)
        console.log(dataarr4)


        $(document).ready(function() {
            $('#tbl_list_tracking_sum').DataTable().destroy();
            $('#tbl_list_tracking_sum').DataTable({
                "pageLength": 25,
                'data': [...dataarr4],
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "mac" },
                    { data: "name" },
                    { data: "property" },
                    { data: "location" },
                ],
            });

            $('#tbl_list_tracking_still').DataTable().destroy();
            $('#tbl_list_tracking_still').DataTable({
                "pageLength": 25,
                'data': [...dataarr1],
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "mac" },
                    { data: "name" },
                    { data: "property" },
                    { data: "location" },
                ],
            });

            $('#tbl_list_tracking_missing').DataTable().destroy();
            $('#tbl_list_tracking_missing').DataTable({
                "pageLength": 25,
                'data': [...dataarr2],
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "mac" },
                    { data: "name" },
                    { data: "property" },
                    { data: "location" },
                ],
            });

            $('#tbl_list_tracking_borrow').DataTable().destroy();
            $('#tbl_list_tracking_borrow').DataTable({
                "pageLength": 25,
                'data': [...dataarr3],
                "responsive": true,
                "autoWidth": false,
                "order": [],
                columns: [
                    { data: "mac" },
                    { data: "name" },
                    { data: "property" },
                    { data: "location" },
                ],
            });
        });
    });




});
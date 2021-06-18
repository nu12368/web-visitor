var iddatauser;
$(function () {
		const url = 'https://api.utilitymanage.wacappcloud.com'
	//const url = process.env.envipaddress;
	//console.log(url);
	//const url = 'http://10.0.0.205:4002'
	// const url = 'http://3.0.95.189:4005'
	axios.get(url + '/user').then(function (response) {
		var cnt = response.data.message.length;
		var _arr = new Array();
		var n = 0;
		var $select = $('#c_address');
		$select.find('option').remove();
		$select.append('<option value=' + 0 + '>' + '-- เลือกเลขที่บ้านใหม่ --' + '</option>');

		for (i = 0; i < cnt; i++) {
			//console.log(response.data.message[i]._id)
			//_newfun(response.data.message[i].home.data, response.data.message[i].home.user)
			_newfun(response.data.message[i]._id,response.data.message[i].home.data, response.data.message[i].home.user)
			//// บ้านเลขที่ ย้ายบ้าน
			$select.append('<option value=' + response.data.message[i].home.data.address + '>' + response.data.message[i].home.data.address + '</option>');

		}
		function _newfun(idhome,home, user) {
			var cluser = user.length;

			for (a = 0; a < cluser; a++) {
				var checkterminateUsage = user[a].terminateUsage;
				if (checkterminateUsage == undefined) {
					_arr[n] = {
						address: home.address,
						buildingType: home.buildingType,
						meterId: home.meterId,
						meterVal: home.meterVal,
						"gps": {
							latitude: home.gps.latitude,
							longitude: home.gps.longitude,
						},
						timeStamp: user[a].registrationDate.substring(0, 10),
						name: user[a].name,
						tel: user[a].tel,
						status: user[a].status,
						_iduser: user[a]._idUser,
						_idhome: idhome
					}
					n = n + 1;
				}

			}
		}
//console.log(_arr)
		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		_arr.sort(compareByDate);
		const reversed = _arr.reverse()
		$("#div_registercount").text(reversed.length + " คน");

		var groupColumn = 0;
		var table = $('#table1').DataTable({
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			"order": [],
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [

				{ data: 'address', "visible": false },
				{ data: 'meterId', "visible": false },
				{ data: 'meterVal', "visible": false },
				{ data: 'name' },
				{ data: 'tel' },
				{ data: 'buildingType' },
				{ data: 'timeStamp' },
				{ data: 'status', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i  href="" class="editor_edit fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i> /<i href="" class="editor_move fa fa-minus-circle" style="font-size:14px;color:green; cursor: pointer;">ย้าย</i>  / <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				},
				{ data: '_iduser', "visible": false },
				{ data: '_idhome', "visible": false }
			],
			dom: 'Bfrtip',
			buttons: [
				'csv', 'excel', 'pdf', 'print'
			],
			"order": [[groupColumn, 'desc']],
			"displayLength": 25,
			"drawCallback": function (settings) {
				var api = this.api();
				var rows = api.rows({ page: 'current' }).nodes();
				var last = null;
				api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
					if (last !== group) {
						$(rows).eq(i).before(
							'<tr class="group"><td  colspan="8">' + 'บ้านเลขที่ ' + group + ' ' + '<i href="" class="editor_create fa fa-plus-circle" style="font-size:14px;color:green; cursor: pointer;"> เพิ่ม</i></td></tr>'
						);
						last = group;
					}
				});
			},
		});


		////////////////////เพิ่ม
		$(document).ready(function () {
			$('#table1 tbody').on('click', 'i.editor_create', function (e) {
				e.preventDefault();
				$('#table1').on('click', 'tbody td', function () {
					$("#title").text('เพิ่มข้อมูล')
					$("#h_pass").text('รหัสผ่าน');
					$("#p_update").text('');
					document.getElementById("move").style.display = 'none';
					var address = this.textContent.split(' ');

					const dataUser = {
						address: address[1]
					}
					axios.post(url + '/FindDataMeterForUser', dataUser
					).then(function (response) {

						$("#myModal").modal();


						$("#posttitle").val('');
						$("#postname").val('');
						$("#postlastName").val('');
						$("#posttel").val('');
						$("#status").val('');
						$("#password").val('');

						$("#postaddress").val(response.data.message[0].home.data.address);
						$("#postbuildingtype").val(response.data.message[0].home.data.buildingType);
						$("#postmeter").val(response.data.message[0].home.data.meterId);
						$("#meterValues").val(response.data.message[0].home.data.meterVal);
						$("#latitude").val(response.data.message[0].home.data.gps.latitude);
						$("#longitude").val(response.data.message[0].home.data.gps.longitude);
						document.getElementById("editpost").style.display = 'none';
						document.getElementById("newpassword").style.display = 'none';
						
						document.getElementById("submitpost").style.display = 'block';
						document.getElementById("submitpost").value = "บันทึก";
					}).catch(function (res) {
						const { response } = res

					});
				})
			});


			


			////////ย้าย
			$('#table1').on('click', 'i.editor_move', function (e) {
				e.preventDefault();
				$("#p_update").text('');
				$("#title").text('ย้ายที่อยู่ใหม่')
				var table = $('#table1').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}
				$("#myModal").modal();
				var _n = data.name.split(' ')
				$("#posttitle").val(_n[0]);
				$("#postname").val(_n[1]);
				$("#postlastName").val(_n[2]);
				$("#posttel").val(data.tel);
				$("#status").val(data.status);
				// $("#password").val(data.password);
				// $("#postbuildingtype").val(data.buildingType);
				// $("#postmeter").val(data.meterId);
				// $("#meterValues").val(data.meterVal);
				// $("#latitude").val(data.gps.latitude);
				// $("#longitude").val(data.gps.longitude);
				document.getElementById("submitpost").style.display = 'block';
				document.getElementById("editpost").style.display = 'none';
				document.getElementById("move").style.display = 'block';
				document.getElementById("submitpost").value = "ย้ายข้อมูล";

				$("#old_address").val('บ้านเลขที่ : ' + data.address + ('\n') +
					'ชื่อ-สกุล : ' + _n[0] + ' ' + _n[1] + ' ' + _n[2] + ('\n') +
					'ประเภทสิ่งปลูกสร้าง : ' + data.buildingType + ('\n') +
					'เลขประจำตัวมิเตอร์ : ' + data.meterId + ('\n') +
					'เลขมาตร : ' + data.meterVal + ('\n') +
					'latitude : ' + data.gps.latitude + ('\n') +
					'longitude : ' + data.gps.longitude + ('\n') +
					'เบอร์โทร : ' + data.tel);


			});

			///////////////////////ลบ
			$('#table1').on('click', 'i.editor_remove', function (e) {

				e.preventDefault();
				$("#myModaldelete").modal();
				var table = $('#table1').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				iddatauser = _ro.data();

				if (iddatauser == undefined) {
					iddatauser = table.row(this).data();
				}
				$("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

			});

			////////// ลบuser
			$('#deleteUser').on('click', function (e) {
				const urls = url + "/terminateUser/" + iddatauser._iduser;
				axios.patch(urls)
					.then(function (response) {
						console.log(response.data.message)
						location.href = "registerlist.html";

						document.getElementById("c_delete").style.display = "none";
						document.getElementById("completed").style.display = "block";
						document.getElementById("lbl_completed").innerText = 'ลบข้อมูลสำเร็จแล้ว';
						document.getElementById("deletepost").style.display = "none";

					}).catch(function (res) {
						const { response } = res
						console.log(response.data.message)

					});


			});

		});


	}).catch(function (res) {
		const { response } = res
	});





	//////////////////////////////// user admin
	axios.get(url + '/userad').then(function (response) {
		var cnt = response.data.message.length;
		var _arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			//	console.log(response.data.message[i])
			var checkterminateUsage = response.data.message[i].terminateUsage;
			if (checkterminateUsage == undefined) {
				_arr[n] = {
					username: response.data.message[i].username,
					name: response.data.message[i].name,
					email: response.data.message[i].email,
					tel: response.data.message[i].tel,
					timeStamp: response.data.message[i].timeStamp.substring(0, 10),
					_idadmin: response.data.message[i]._id
				}
				n = n + 1;
			}
		}


		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		_arr.sort(compareByDate);
		const reversed = _arr.reverse()

		var groupColumn = 0;
		var table = $('#table_admin').DataTable({
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			"order": [],
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: 'username' },
				{ data: 'name' },
				{ data: 'email' },
				{ data: 'tel' },
				{ data: 'timeStamp' },
				{
					data: null,
					className: "center",
					defaultContent: '<i  href="" class="editor_editadmin fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i> / <i href="" class="editor_removeadmin fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});


		///////////////////////ลบ
		$('#table_admin').on('click', 'i.editor_removeadmin', function (e) {

			e.preventDefault();
			$("#myModaldelete").modal();
			var table = $('#table_admin').DataTable();
			e.preventDefault();
			var _ro = table.row($(this).parents('tr'));
			iddatauser = _ro.data();

			if (iddatauser == undefined) {
				iddatauser = table.row(this).data();
			}
			console.log(iddatauser._idadmin)
			$("#lbl_completed").text('คุณต้องการจะลบข้อมูล ใช่หรือไม่');

		});

		////////// ลบAdmin
		$('#deleteUser').on('click', function (e) {
			const urls = url + "/terminateUserAd/" + iddatauser._idadmin;
			console.log(urls)
			axios.patch(urls)
				.then(function (response) {
					console.log(response.data.message)
					location.href = "registerlist.html";

					document.getElementById("c_delete").style.display = "none";
					document.getElementById("completed").style.display = "block";
					document.getElementById("lbl_completed").innerText = 'ลบข้อมูลสำเร็จแล้ว';
					document.getElementById("deletepost").style.display = "none";

				}).catch(function (res) {
					const { response } = res

					console.log(response.data.message)

				});
		});




	}).catch(function (res) {
		const { response } = res
	});





















	axios.get(url + '/allInvoice').then((response) => {
		//let columns = $("#api2[name='allInvoice']").data('columns')
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			var cl = response.data.message[i].finance.length;
			for (a = 0; a < cl; a++) {
				if (response.data.message[i].finance[a].payment.status == 'ค้างชำระ') {
					arr[n] = {
						ref1: response.data.message[i].finance[a].ref1,
						ref2: response.data.message[i].finance[a].ref2,
						meterId: response.data.message[i].finance[a].meterId,
						meterVal: response.data.message[i].finance[a].meterVal,
						category: response.data.message[i].finance[a].category,
						amount: response.data.message[i].finance[a].payment.amount + ' บาท',
						startDate: response.data.message[i].finance[a].startDate.substring(0, 10),
						dueDate: response.data.message[i].finance[a].dueDate.substring(0, 10),
						status: response.data.message[i].finance[a].payment.status,
						timeStamp: response.data.message[i].finance[a].timeStamp.substring(0, 10),
					}
					n = n + 1
				}
			}
		}
		var groupColumn = 0;
		// const sortedArray = arr.sort((a, b) => new moment(a.timeStamp).format('YYYYMMDD') - new moment(b.timeStamp).format('YYYYMMDD'))
		// const reversed = sortedArray.reverse()

		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()


		$("#div_allinvoice").text(reversed.length + " รายการ");
		$('#table_id2').DataTable({
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'order': [],
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: 'ref1' },
				{ data: 'ref2' },
				{ data: 'meterId' },
				{ data: 'meterVal' },
				{ data: 'category' },
				{ data: 'amount' },
				{ data: 'startDate' },
				{ data: 'dueDate' },
				{ data: 'status' },
				{ data: 'timeStamp' },
			],
			dom: 'Bfrtip',
			buttons: [
				'csv', 'excel', 'pdf', 'print'
			],
			"order": [[groupColumn, 'desc']],
			"displayLength": 25,
			"drawCallback": function (settings) {
				var api = this.api();
				var rows = api.rows({ page: 'current' }).nodes();
				var last = null;

				api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
					if (last !== group) {
						$(rows).eq(i).before(
							'<tr class="group"><td colspan="10">' + 'บ้านเลขที่ ' + group + '</td></tr>'
						);
						last = group;
					}
				});
			}
		});

	}).catch(function (res) {

		const { response } = res
	});









	//////////////////////////// ชำระแล้ว
	axios.get(url + '/allInvoice').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();

		var n = 0;
		for (i = 0; i < cnt; i++) {
			var cl = response.data.message[i].finance.length;
			for (a = 0; a < cl; a++) {
				if (response.data.message[i].finance[a].payment.status == 'ชำระแล้ว') {
					arr[n] = {
						ref1: response.data.message[i].finance[a].ref1,
						ref2: response.data.message[i].finance[a].ref2,
						category: response.data.message[i].finance[a].category,
						amount: response.data.message[i].finance[a].payment.amount + ' บาท',
						startDate: response.data.message[i].finance[a].startDate.substring(0, 10),
						dueDate: response.data.message[i].finance[a].dueDate.substring(0, 10),
						status: response.data.message[i].finance[a].payment.status,
						credit: response.data.message[i].finance[a].payment.credit + ' บาท',
						remain: response.data.message[i].finance[a].payment.remain + ' บาท',
						creditDate: response.data.message[i].finance[a].payment.creditDate.substring(0, 10)
					}
					n = n + 1
				}
			}
		}
		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.creditDate) - toDate(x.creditDate);
		arr.sort(compareByDate);
		const reversed = arr.reverse()
		$("#div_allpayment").text(reversed.length + " รายการ");

		var groupColumn = 0;

		$('#table_id6').DataTable({
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: 'ref1' },
				{ data: 'ref2' },
				{ data: 'category' },
				{ data: 'amount' },
				{ data: 'startDate' },
				{ data: 'dueDate' },
				{ data: 'status' },
				{ data: 'credit' },
				{ data: 'remain' },
				{ data: 'creditDate' },
				{
					data: null,
					className: "center",
					defaultContent: '<i  href="" target="_blank"  class="editor_print fa fa-print" style="font-size:14px;color:green; cursor: pointer;">พิมพ์ใบเสร็จ</i>'
				}
			],
			dom: 'Bfrtip',
			buttons: [
				'csv', 'excel', 'pdf', 'print'
			],
			"order": [[groupColumn, 'desc']],
			"displayLength": 25,
			"drawCallback": function (settings) {
				var api = this.api();
				var rows = api.rows({ page: 'current' }).nodes();
				var last = null;

				api.column(groupColumn, { page: 'current' }).data().each(function (group, i) {
					if (last !== group) {
						$(rows).eq(i).before(
							'<tr class="group"><td colspan="11">' + 'บ้านเลขที่ ' + group + '</td></tr>'
						);
						last = group;
					}
				});
			}
		});





		$(document).ready(function () {
			$('#table_id6').on('click', 'i.editor_print', function (e) {
				e.preventDefault();
				var table = $('#table_id6').DataTable();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}
				window.open(`print.html?ref2= ${data.ref2}`, '_blank');

			});

		});



	}).catch(function (res) {
		const { response } = res
	});







	/////////ข้อมูลบริการ


	axios.get(url + '/service').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		//	console.log(response.data.message[0].images[0])
		for (i = 0; i < cnt; i++) {
			arr[n] = {
				_id: response.data.message[i]._id,
				topic: response.data.message[i].topic,
				detail: response.data.message[i].detail,
				latitude: response.data.message[i].gps.latitude,
				longitude: response.data.message[i].gps.longitude,
				images: response.data.message[i].images,
				timeStamp: response.data.message[i].timeStamp.substring(0, 10)
			}
			n = n + 1
		}
		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()


		$("#div_service").text(reversed.length + " รายการ");

		$('#table_id3').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: '_id', "visible": false },
				{ data: "topic" },
				{ data: "detail" },
				{ data: "timeStamp" },
				{ data: 'latitude', "visible": false },
				{ data: 'longitude', "visible": false },
				{ data: 'images', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_create fa fa-search" style="font-size:14px;color:green; cursor: pointer;">ดู </i> / <i  href="" class="editor_editofficial fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]

		});



		$(document).ready(function () {
			$('#table_id3 ').on('click', 'i.editor_create', function (e) {
				var table = $('#table_id3').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}


				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:block");
							}
						});

					});
				}



				$("#myModalview").modal();
				for (i = 0; i < 5; i++) {
					$('#showimage' + i).attr('src', '');
					$('#a_image' + i).attr('href', '#');
				}
				var str = data.images;
				$("#viewImage").empty();
				var n = str.indexOf("//");
				if (n == '-1') {
					for (let i in data.images) {
					$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);
					//	$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);
					}
				} else {
					$('#showimage').attr('src', data.images);
				}
				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:none");
							}
						});

					});
				}

				$("#topicview").text(data.topic);
				$("#detail").text(data.detail);
				$("#la").text(data.latitude);
				$("#lo").text(data.longitude);
				$("#gps").attr("href", `gps.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);


			});


		});




	}).catch(function (res) {
		const { response } = res
	});






	//////ข้อมูลท่องเที่ยว
	axios.get(url + '/travel').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			arr[n] = {
				_id: response.data.message[i]._id,
				topic: response.data.message[i].topic,
				detail: response.data.message[i].detail,
				latitude: response.data.message[i].gps.latitude,
				longitude: response.data.message[i].gps.longitude,
				images: response.data.message[i].images,
				timeStamp: response.data.message[i].timeStamp.substring(0, 10)
			}
			n = n + 1
		}
		// const sortedArray = arr.sort((a, b) => new moment(a.timeStamp).format('YYYYMMDD') - new moment(b.timeStamp).format('YYYYMMDD'))

		// const reversed = sortedArray.reverse()
		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()
		$("#div_travel").text(reversed.length + " รายการ");


		$('#table_id4').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: '_id', "visible": false },
				{ data: "topic" },
				{ data: "detail" },
				{ data: "timeStamp" },
				{ data: 'latitude', "visible": false },
				{ data: 'longitude', "visible": false },
				{ data: 'images', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_create fa fa-search" style="font-size:14px;color:green; cursor: pointer;">ดู </i> / <i  href="" class="editor_editofficial fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});
		$(document).ready(function () {
			$('#table_id4 tbody').on('click', 'i.editor_create', function (e) {
				var table = $('#table_id4').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}
				$("#myModalview").modal();

				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:block");
							}
						});

					});
				}

				for (i = 0; i < 5; i++) {
					$('#showimage' + i).attr('src', '');
					$('#a_image' + i).attr('href', '#');
				}
				$("#viewImage").empty();
				var str = data.images;
				var n = str.indexOf("//");
				if (n == '-1') {
					for (let i in data.images) {
						$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);

					}
				} else {
					$('#showimage').attr('src', data.images);
				}
				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:none");
							}
						});

					});
				}

				$("#topicview").text(data.topic);
				$("#detail").text(data.detail);
				$("#la").text(data.latitude);
				$("#lo").text(data.longitude);
				$("#gps").attr("href", `gps.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);
				//});
			});
		});


	}).catch(function (res) {
		const { response } = res
	});



	//ข้อมูลธุรกิจ

	axios.get(url + '/business').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			arr[n] = {
				_id: response.data.message[i]._id,
				topic: response.data.message[i].topic,
				detail: response.data.message[i].detail,
				latitude: response.data.message[i].gps.latitude,
				longitude: response.data.message[i].gps.longitude,
				images: response.data.message[i].images,
				timeStamp: response.data.message[i].timeStamp.substring(0, 10)
			}
			n = n + 1
		}

		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()


		$("#div_business").text(reversed.length + " รายการ");
		$('#table_id5').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: '_id', "visible": false },
				{ data: "topic" },
				{ data: "detail" },
				{ data: "timeStamp" },
				{ data: 'latitude', "visible": false },
				{ data: 'longitude', "visible": false },
				{ data: 'images', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_create fa fa-search" style="font-size:14px;color:green; cursor: pointer;">ดู </i> / <i  href="" class="editor_editofficial fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});


		$(document).ready(function () {
			$('#table_id5 tbody').on('click', 'i.editor_create', function (e) {
				var table = $('#table_id5').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}
				$("#myModalview").modal();

				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:block");
							}
						});

					});
				}


				for (i = 0; i < 5; i++) {
					$('#showimage' + i).attr('src', '');
					$('#a_image' + i).attr('href', '#');
				}
				$("#viewImage").empty();
				var str = data.images;
				var n = str.indexOf("//");
				if (n == '-1') {
					for (let i in data.images) {
						$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);

					}
				} else {
					$('#showimage').attr('src', data.images);
				}

				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:none");
							}
						});

					});
				}

				$("#topicview").text(data.topic);
				$("#detail").text(data.detail);
				$("#la").text(data.latitude);
				$("#lo").text(data.longitude);
				$("#gps").attr("href", `gps.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);
				//});
			});


		});
	}).catch(function (res) {
		const { response } = res
	});




	//ข้อมูลทรัพย์สิน

	axios.get(url + '/asset').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			arr[n] = {
				_id: response.data.message[i]._id,
				topic: response.data.message[i].topic,
				detail: response.data.message[i].detail,
				latitude: response.data.message[i].gps.latitude,
				longitude: response.data.message[i].gps.longitude,
				images: response.data.message[i].images,
				timeStamp: response.data.message[i].timeStamp.substring(0, 10)
			}
			n = n + 1
		}
		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()

		$("#div_asset").text(reversed.length + " รายการ");


		$('#table_id7').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			'data': reversed,
			"responsive": true,
			"autoWidth": false,
			columns: [
				{ data: '_id', "visible": false },
				{ data: "topic" },
				{ data: "detail" },
				{ data: "timeStamp" },
				{ data: 'latitude', "visible": false },
				{ data: 'longitude', "visible": false },
				{ data: 'images', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_create fa fa-search" style="font-size:14px;color:green; cursor: pointer;">ดู </i> / <i  href="" class="editor_editofficial fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});




		$(document).ready(function () {
			$('#table_id7 tbody').on('click', 'i.editor_create', function (e) {
				var table = $('#table_id7').DataTable();
				e.preventDefault();
				var _ro = table.row($(this).parents('tr'));
				var data = _ro.data();

				if (data == undefined) {
					data = table.row(this).data();
				}


				$("#myModalview").modal();


				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:block");
							}
						});

					});
				}


				for (i = 0; i < 5; i++) {
					$('#showimage' + i).attr('src', '');
					$('#a_image' + i).attr('href', '#');
				}

				var str = data.images;
				var n = str.indexOf("//");
				$("#viewImage").empty();
				if (n == '-1') {
					for (let i in data.images) {
						// $('#a_image' + i).attr('href', url + '/images/' + data.images[i]);
						// $('#showimage' + i).attr('src', url + '/images/' + data.images[i]);
						$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);

					}
				} else {
					$('#showimage').attr('src', data.images);
				}

				for (i = 0; i < 5; i++) {
					$(document).ready(function () {
						$("#showimage" + i).each(function () {
							if ($("#showimage" + i).attr("src") == null || $(this).attr("src") == '') {
								$(this).attr("style", "display:none");
							}
						});

					});
				}
				$("#topicview").text(data.topic);
				$("#detail").text(data.detail);
				$("#la").text(data.latitude);
				$("#lo").text(data.longitude);
				$("#gps").attr("href", `gps.html?latitude= ${data.latitude}&longitude= ${data.longitude}`);
				//});
			});






		});


	}).catch(function (res) {
		const { response } = res;
	});





	//ประกาศ

	axios.get(url + '/notice').then((response) => {
		var cnt = response.data.message.length;
		var arr = new Array();
		var n = 0;
		//console.log(response.data.message)
		for (i = 0; i < cnt; i++) {
			arr[n] = {
				_id: response.data.message[i]._id,
				topic: response.data.message[i].topic,
				detail: response.data.message[i].detail,
				dateNotice: response.data.message[i].dateNotice,
				weblink: response.data.message[i].weblink,
				images: response.data.message[i].images,
				timeStamp: response.data.message[i].timeStamp
			}
			n = n + 1
		}

		const toDate = str => {
			const [d, t] = str.split(' ')
			return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		};
		const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		arr.sort(compareByDate);
		const reversed = arr.reverse()


		// $("#div_Notice").text(arr.length + " รายการ");
		$('#table_id8').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			"responsive": true,
			"autoWidth": false,
			'data': reversed,
			columns: [
				{ data: "_id", "visible": false },
				{ data: "topic" },
				{ data: "detail" },
				{ data: "dateNotice" },
				{ data: 'weblink', "visible": false },
				{ data: 'images', "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_view fa fa-search" style="font-size:14px;color:green ; cursor: pointer;">ดู </i> / <i  href="" class="editor_edit fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});

		$(document).ready(function () {
			try {
				/////////////// ดู
				$('#table_id8').on('click', 'tbody td i.editor_view', function (e) {
					var table = $('#table_id8').DataTable();
					e.preventDefault();
					var _ro = table.row($(this).parents('tr'));
					var data = _ro.data();

					if (data == undefined) {
						data = table.row(this).data();
					}
					$("#myModalview").modal();
					for (i = 0; i < 5; i++) {
						$('#showimage' + i).attr('src', '');
						$('#a_image' + i).attr('href', '#');
					}
					var str = data.images;
					var n = str.indexOf("//");
					$("#viewImage").empty();
					if (n == '-1') {
						for (let i in data.images) {
								$("#viewImage").append(`<img src="${url}/images/${data.images[i]}"class="view_img img-responsive thumbnail col-lg-3 col-md-4 col-sm-6 col-xs-12">`);
						}

					} else {
						$('#showimage').attr('src', data.images);
					}

					$("#topic").text(data.topic);
					$("#detail").text(data.detail);
					$('#gps').css('display', 'none');
					$('#P_gps').css('display', 'none');
					$('#p_weblink').css('display', 'block');
					$("#clickweblink").text(data.weblink);
					$("#clickweblink").attr("href", data.weblink);
				});


			

			} catch (err) {
				console.log('cath');
			}

		});

	}).catch(function (res) {
		const { response } = res;





	});












	//////จำนวนรายการร้องเรียน

	axios.get(url + '/appeal').then((response) => {
		var cnt = response.data.message.length;
		var _arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			var cl = response.data.message[i].appeal.length;
			for (a = 0; a < cl; a++) {

				_arr[n] = {
					topic: response.data.message[i].appeal[a].topic,
					detail: response.data.message[i].appeal[a].detail,
					"gps": {
						latitude: response.data.message[i].appeal[a].gps.latitude,
						longitude: response.data.message[i].appeal[a].gps.longitude,
					},

					images: response.data.message[i].appeal[a].images,
					telephone: response.data.message[i].appeal[a].telephone,
					timeStamp: response.data.message[i].appeal[a].timeStamp.replace(',', ''),
					_id: response.data.message[i].appeal[a]._id
				}
				n = n + 1
			}
		}
		//	console.log(_arr.length + "ร้องเรียน")
		$("#div_appeal").text(_arr.length + " รายการ");

	}).catch(function (res) {
		const { response } = res

	});



	//////จำนวนแจ้งเหตุ
	axios.get(url + '/inform').then((response) => {
		var cnt = response.data.message.length;
		//console.log(response.data.message)
		var _arr = new Array();
		var n = 0;

		for (i = 0; i < cnt; i++) {
			var cl = response.data.message[i].inform.length;

			for (a = 0; a < cl; a++) {

				_arr[n] = {
					topic: response.data.message[i].inform[a].topic,
					detail: response.data.message[i].inform[a].detail,
					"gps": {
						latitude: response.data.message[i].inform[a].gps.latitude,
						longitude: response.data.message[i].inform[a].gps.longitude,
					},

					images: response.data.message[i].inform[a].images,
					telephone: response.data.message[i].inform[a].telephone,
					timeStamp: response.data.message[i].inform[a].timeStamp.replace(',', ''),
					_id: response.data.message[i].inform[a]._id,

				}
				n = n + 1
			}
		}

		//console.log(_arr.length + "แจ้งเหตุ")
		$("#div_inform").text(_arr.length + " รายการ");


	}).catch(function (res) {
		const { response } = res
	});





	// console.log('dsdsdsds')


	//////สินค้า
	axios.get('https://www.wacinfotech.com/community/product.php').then((response) => {
		//console.log(response)
		var cnt = response.data.length
		var _arr = new Array();
		var n = 0;
		for (i = 0; i < cnt; i++) {
			//var cl = response.data[i].images.length;
			//console.log(response.data[i].title)
			//for (a = 0; a < cl; a++) {
			//	console.log(response.data[0].title)
			//console.log(response.data[0].description)
			_arr[n] = {
				_title: response.data[i].title,
				_description: response.data[i].description,
				_phone: response.data[i].phone,
				_image: response.data[i].images,
				_stock: response.data[i].stock,
				_price: response.data[i].price
			}
			n = n + 1
			//}
		}
		//console.log(_arr)
		$("#div_product").text(_arr.length + " รายการ");
		$('#table_id_product').DataTable({
			"order": [],
			"lengthMenu": [[50, 100, 200, 300, 400, 500, 1000, 1500, 2000, -1], [50, 100, 200, 300, 400, 500, 1000, 1500, 2000, "All"]],
			"pageLength": 50,
			"responsive": true,
			"autoWidth": false,
			'data': _arr,
			columns: [
				{ data: "_title" },
				{ data: "_description" },
				{ data: "_phone" },
				{ data: "_image", "visible": false },
				{ data: "_stock", "visible": false },
				{ data: "_price", "visible": false },
				{
					data: null,
					className: "center",
					defaultContent: '<i href=""  class="editor_view fa fa-search" style="font-size:14px;color:green; cursor: pointer;">ดูสินค้า </i> / <i  href="" class="editor_edit fa fa-edit" style="font-size:14px;color:blue; cursor: pointer;">แก้ไข</i>/ <i href="" class="editor_remove fa fa-minus-circle" style="font-size:14px;color:red; cursor: pointer;">ลบ</i>'
				}
			]
		});



		// const toDate = str => {
		// 	const [d, t] = str.split(' ')
		// 	return new Date(`${d.split('/').reverse().join('-')}T${t}Z`).getTime();
		// };
		// const compareByDate = (x, y) => toDate(y.timeStamp) - toDate(x.timeStamp);
		// arr.sort(compareByDate);
		// const reversed = arr.reverse()


		$(document).ready(function () {
			try {
				/////////////// ดู
				$('#table_id_product').on('click', 'tbody td i.editor_view', function (e) {
					var table = $('#table_id_product').DataTable();
					e.preventDefault();
					var _ro = table.row($(this).parents('tr'));
					var data = _ro.data();

					if (data == undefined) {
						data = table.row(this).data();
					}
					var myJSON = JSON.stringify(data);
					window.location.href = `product-detail.html?prm= ${myJSON}`

					//console.log(myJSON)

				});
			} catch (err) {
				console.log('cath');
			}
		});



	}).catch(function (res) {
		const { response } = res
	});










});




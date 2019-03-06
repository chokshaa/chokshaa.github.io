$(document).ready(function() {
	var list = [];
	
    $.ajax({
        type: "GET",
        url: "doc/hotList.csv",
        dataType: "text",
        success: function(data) {
        	processedData = processData(data);
			updateDataModel(processedData);
		}
     });

    $("#importBtn").click(function(){
    	$('#listupload').trigger('click'); 
    });
    
    $("#exportBtn").click(function(evt){
    	exportList(evt);
    });
    
    $("#listupload").change(function(evt){
		var importList = upload(evt);
		
    });
});

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var lines = [];

    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        lines.push(data[1]);
    }
    
    return lines;   
}

function upload(evt) {
	var data = null;
    var file = evt.target.files[0];
    var reader = new FileReader();
	
	reader.onerror = function () {
		alert('Error')
	}
		
	reader.readAsText(file);

    reader.onload = function(event) {
    	var csvData = event.target.result;
    	data = processData(csvData);
    	updateDataModel(data);
    }
}

function updateDataModel(data) {
	list = [];
	list = data;
	renderData();
}

function renderData() {
	$("#rankTable tbody").html("");
	for (var j=0; j<list.length; j++) {
		var markup = "<tr><td width='5%'>" + (j+1) + "<td width='5%'><button onclick='upSwap(" + j + ");'>UP</button></td><td width='5%'><button onclick='downSwap(" + j + ");'>DOWN</button></td><td>" + list[j] + "</td></tr>";
    	$("#rankTable tbody").append(markup);
	}
}

function exportList(e){
	var csvContent = "data:text/csv;charset=utf-8,";

	for (var j=0; j<list.length; j++) {
		dataString = (j+1)+","+list[j];
		csvContent += dataString+ "\r\n";
	}
	
	//CSV
	var encodedUri = encodeURI(csvContent);
	
	var date = new Date();
	var downloadLink = document.createElement("a");
	downloadLink.href = encodedUri;
	downloadLink.download = "hotList-" + (date.getMonth()+1) + "-" + date.getDate() + "-" + date.getFullYear() + "-" + date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds() + ".csv";
	
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
	
}

function upSwap(row) {
	if (row !== 0) {
		temp = list[row-1];
		list[row-1] = list[row];
		list[row] = temp;
		updateDataModel(list);
	}
}

function downSwap(row) {
	if (row !== list.length - 1) {
		temp = list[row+1];
		list[row+1] = list[row];
		list[row] = temp;
		updateDataModel(list);
	}
}

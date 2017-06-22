function loadData() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var data = JSON.parse(this.responseText);
      updateView(data);
    }
  };
  xhttp.open("GET", "/node_status/2", true);
  xhttp.send();
}

loadData();

function updateView(data){
  document.getElementById("summary_id").innerHTML = data.id;
  document.getElementById("summary_parent").innerHTML = data.status.parent;
  document.getElementById("summary_battery").innerHTML = data.status.battery;
  document.getElementById("summary_last_message").innerHTML = new Date(data.lastUpdate * 1000);

  const tableMessages = document.getElementById("table_messages");
  for(let i in data.lastMessages){
    const message = data.lastMessages[i];
    const row = tableMessages.insertRow(-1);
    row.insertCell(0).innerHTML = JSON.stringify(message);
  }

  const tableFlows = document.getElementById("table_flows");
  for(let i in data.volumes){
    const volume = data.volumes[i];
    const row = tableFlows.insertRow(-1);
    if(volume.dst_node == 26){
      row.insertCell(0).innerHTML = "broadcast";
    }else{
      row.insertCell(0).innerHTML = volume.dst_node;
    }
    row.insertCell(1).innerHTML = volume.octets;
    row.insertCell(2).innerHTML = volume.packets;
    row.insertCell(3).innerHTML = volume.exportTime;
  }
}

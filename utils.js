function* iterate_object(o) {
    var keys = Object.keys(o);
    for (var i=0; i<keys.length; i++) {
        yield [keys[i], o[keys[i]]];
    }
}
  
function loadTableData(items) {
    let table = document.getElementById("candidatesBody");

    for (var [key, val] of iterate_object(items)) {
        let row = table.insertRow();
        let candidate = row.insertCell(0);
        candidate.innerHTML = key;
        let votes = row.insertCell(1);
        votes.id = val;
    }
}

loadTableData(getCandidates());
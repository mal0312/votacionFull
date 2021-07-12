function* iterate_object(o) {
    var keys = Object.keys(o);
    for (var i=0; i<keys.length; i++) {
        yield [keys[i], o[keys[i]]];
    }
}
  
async function loadTableData() {
    let items = await getCandidates();
    let table = document.getElementById("candidatesBody");
    for (var [key, val] of iterate_object(items)) {
        let row = table.insertRow();
        let candidate = row.insertCell(0);
        candidate.innerHTML = key;
        let votes = row.insertCell(1);
        votes.id = val;
    }
}

async function loadWalletSelector() {
    let items = await getWallets();

    var wallets_selector = document.getElementById("wallets");
    for(var i = 0; i < items.length; i++) {
       var option = document.createElement('option');
       option.text = option.value = items[i];
       wallets_selector.add(option, 0);
    }
}

loadTableData();
loadWalletSelector();
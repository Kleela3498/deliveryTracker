document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const editingIndex = this.getAttribute('data-editing-index');
    const formData = collectFormData();

    formData.pendingBalance = (parseFloat(formData.totalAmount) - parseFloat(formData.cashReceived)).toFixed(2);

    if (editingIndex !== null) {
        updateRecord(editingIndex, formData);
    } else {
        addNewRecord(formData);
    }

    this.reset();
    this.removeAttribute('data-editing-index');
    displayRecords();
});

function collectFormData() {
    return {
        customerName: document.getElementById('customerName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        packets: document.getElementById('packets').value,
        totalAmount: document.getElementById('totalAmount').value,
        paymentMethod: document.getElementById('paymentMethod').value,
        cashReceived: document.getElementById('cashReceived').value,
        pendingBalance: '', // Will be calculated
    };
}

function addNewRecord(formData) {
    const records = getRecords();
    records.push(formData);
    saveRecords(records);
}

function updateRecord(index, formData) {
    const records = getRecords();
    records[index] = formData;
    saveRecords(records);
}

function deleteRecord(index) {
    let records = getRecords();
    records.splice(index, 1);
    saveRecords(records);
    displayRecords();
}

function getRecords() {
    return JSON.parse(localStorage.getItem('deliveryRecords')) || [];
}

function saveRecords(records) {
    localStorage.setItem('deliveryRecords', JSON.stringify(records));
}


function displayRecords() {
    const records = getRecords();
    const recordsDiv = document.getElementById('records');
    recordsDiv.innerHTML = '<h2>Customer Records</h2>';
    records.forEach((record, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.classList.add('record-entry');
        recordDiv.innerHTML = `<p>Name: ${record.customerName}<br>
        Phone: ${record.phoneNumber}<br>
        Packets: ${record.packets}<br>
        Total: ${record.totalAmount}<br>
        Payment: ${record.paymentMethod}<br>
        Received: ${record.cashReceived}<br>
        Pending: ${record.pendingBalance}</p>
        <button class="btn edit-btn" onclick="editRecord(${index})">Update</button>
        <button class="btn delete-btn" onclick="deleteRecord(${index})">Delete</button>`;
        recordsDiv.appendChild(recordDiv);
    });
}

function editRecord(index) {
    const record = getRecords()[index];
    document.getElementById('customerName').value = record.customerName;
    document.getElementById('phoneNumber').value = record.phoneNumber;
    document.getElementById('packets').value = record.packets;
    document.getElementById('totalAmount').value = record.totalAmount;
    document.getElementById('paymentMethod').value = record.paymentMethod;
    document.getElementById('cashReceived').value = record.cashReceived;
    document.getElementById('customerForm').setAttribute('data-editing-index', index);
    window.scrollTo(0, 0); // Scroll to the top to see the form
}

document.getElementById('exportExcel').addEventListener('click', function() {
    const records = getRecords();
    const ws = XLSX.utils.json_to_sheet(records.map(({ customerName, cashReceived, packets, pendingBalance }) => ({
        Name: customerName,
        CashReceived: cashReceived,
        Packets: packets,
        PendingBalance: pendingBalance,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Records");
    XLSX.writeFile(wb, 'DesiKitchenDeliveryRecords.xlsx');
});

displayRecords();

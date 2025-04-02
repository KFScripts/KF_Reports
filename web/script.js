const reportMenu = document.getElementById('playerReportScreen');
const adminMenu = document.getElementById('adminReportScreen');

const searchInput = document.querySelector('#adminReportScreen input[placeholder="Search..."]');
const reportItems = document.querySelectorAll('#adminReportScreen .neon-border');

searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        reportItems.forEach(item => {
            item.style.display = 'block';
        });
        return;
    }
    
    reportItems.forEach(item => {
        const reportId = item.querySelector('.neon-text').textContent.toLowerCase();
        const playerId = item.querySelector('.text-gray-300').textContent.toLowerCase();
        const description = item.querySelector('.text-gray-400').textContent.toLowerCase();
        const status = item.querySelector('span[class^="text-"]').textContent.toLowerCase();
        
        if (reportId.includes(searchTerm) || 
            playerId.includes(searchTerm) || 
            description.includes(searchTerm) || 
            status.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

function resetSearch() {
    searchInput.value = '';
    reportItems.forEach(item => {
        item.style.display = 'block';
    });
}

const typeFilter = document.querySelector('#adminReportScreen select:first-of-type');
const statusFilter = document.querySelector('#adminReportScreen select:nth-of-type(2)');

typeFilter.addEventListener('change', function() {
    const selectedType = this.value.toLowerCase();
    
    if (selectedType === 'all reports') {
        reportItems.forEach(item => {
            item.style.display = 'block';
        });
    } else {
        reportItems.forEach(item => {
            const reportType = item.querySelector('.neon-text').textContent.toLowerCase();
            if (reportType.includes(selectedType)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchInput.value = '';
});

statusFilter.addEventListener('change', function() {
    const selectedStatus = this.value.toLowerCase();
    
    if (selectedStatus === 'all status') {
        reportItems.forEach(item => {
            item.style.display = 'block';
        });
    } else {
        reportItems.forEach(item => {
            const status = item.querySelector('span[class^="text-"]').textContent.toLowerCase();
            if (status === selectedStatus) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    searchInput.value = '';
});

/**
 * Adds a new report item to the report list using the template.
 * @param {Object} reportData - The data for the report
 * @param {string} reportData.id - The report ID
 * @param {string} reportData.type - The report type (Bug, Player, General Question)
 * @param {string} reportData.playerId - The player's ID
 * @param {string} reportData.description - The report description
 * @param {string} reportData.status - The status (pending, resolved, rejected)
 */
function addReportItem(reportData) {
  const template = document.getElementById('report-item-template');

	if (!template) {
		return;
	}
	const reportItem = template.content.cloneNode(true);
  
  reportItem.querySelector('.report-id').textContent = reportData.id;
  reportItem.querySelector('.report-type').textContent = reportData.type;
  reportItem.querySelector('.player-id').textContent = reportData.playerId;
  reportItem.querySelector('.report-description').textContent = reportData.description;
  
  const statusLabel = reportItem.querySelector('.status-label');
  statusLabel.textContent = reportData.status.toUpperCase();
  
  switch (reportData.status.toLowerCase()) {
      case 'pending':
          statusLabel.className = 'status-label text-xs px-2 py-1 rounded text-yellow-400 bg-yellow-900 bg-opacity-20';
          break;
      case 'resolved':
          statusLabel.className = 'status-label text-xs px-2 py-1 rounded text-green-400 bg-green-900 bg-opacity-20';
          const resolveBtn = reportItem.querySelector('.resolve-button');
          const rejectBtn = reportItem.querySelector('.reject-button');
          if (resolveBtn && rejectBtn) {
              resolveBtn.parentNode.innerHTML = '<button class="text-xs px-2 py-1 text-gray-500">RESOLVED</button>';
          }
          break;
      case 'rejected':
          statusLabel.className = 'status-label text-xs px-2 py-1 rounded text-red-500 bg-red-900 bg-opacity-20';
          const resolveBtnRej = reportItem.querySelector('.resolve-button');
          const rejectBtnRej = reportItem.querySelector('.reject-button');
          if (resolveBtnRej && rejectBtnRej) {
              resolveBtnRej.parentNode.innerHTML = '<button class="text-xs px-2 py-1 text-gray-500">REJECTED</button>';
          }
          break;
  }
  
  const resolveButton = reportItem.querySelector('.resolve-button');
  const rejectButton = reportItem.querySelector('.reject-button');
	const teleportButton = reportItem.querySelector('.teleport-button');
	const bringButton = reportItem.querySelector('.bring-button');
  
  if (resolveButton) {
      resolveButton.addEventListener('click', function() {
          this.parentNode.innerHTML = '<button class="text-xs px-2 py-1 text-gray-500">RESOLVED</button>';
          statusLabel.textContent = 'RESOLVED';
          statusLabel.className = 'status-label text-xs px-2 py-1 rounded text-green-400 bg-green-900 bg-opacity-20';
					fetch('https://KF_Reports/changeReportStatus', {
						method: 'POST',
						headers: {
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({
								reportId: reportData.id,
								status: 'resolved'
						})
					});
			});
  }
  
  if (rejectButton) {
      rejectButton.addEventListener('click', function() {
          this.parentNode.innerHTML = '<button class="text-xs px-2 py-1 text-gray-500">REJECTED</button>';
          statusLabel.textContent = 'REJECTED';
          statusLabel.className = 'status-label text-xs px-2 py-1 rounded text-red-500 bg-red-900 bg-opacity-20';
					fetch('https://KF_Reports/changeReportStatus', {
						method: 'POST',
						headers: {
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({
								reportId: reportData.id,
								status: 'rejected'
						})
					});
      });
  }

	if (teleportButton) {
		teleportButton.addEventListener('click', function() {
			fetch('https://KF_Reports/teleportPlayer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					playerId: reportData.playerId
				})
			});
			closeUi();
		});
	}

	if (bringButton) {
		bringButton.addEventListener('click', function() {
			fetch('https://KF_Reports/bringPlayer', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					playerId: reportData.playerId
				})
			});
			closeUi();
		});
	}
  
  document.getElementById('report-list').prepend(reportItem);
}

const closeUi = () => {
    if (reportMenu.classList.contains('active')) {
        reportMenu.classList.remove('active');
    }
    if (adminMenu.classList.contains('active')) {
        adminMenu.classList.remove('active');
    }
    fetch('https://KF_Reports/close')
}

const Notify = (message, type) => {
    fetch('https://KF_Reports/notify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: message,
            type: type
        })
    })
}

const validateReportForm = () => {
    const reportType = document.querySelector('#playerReportScreen select').value;
    const reportDescription = document.querySelector('#playerReportScreen textarea').value;

    if (reportType === '' || reportDescription === '') {
        return false;
    }
    return true;
}

const submitReport = () => {
    let reportData = {}

    if (!validateReportForm()) { 
        Notify('Please fill in all fields.', 'error');
        return;
    }

    reportData.type = document.querySelector('#playerReportScreen select').value;
    reportData.description = document.querySelector('#playerReportScreen textarea').value;

    fetch('https://KF_Reports/submitReport', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
    })

		document.querySelector('#playerReportScreen select').value = '';
		document.querySelector('#playerReportScreen textarea').value = '';

    Notify('Report submitted successfully!', 'success');
    closeUi();
}

window.addEventListener('message', function(event) {
  if (event.data.action === 'report') {
    if (adminMenu.classList.contains('active')) {
        adminMenu.classList.remove('active');
    }
    reportMenu.classList.add('active');
  } else if (event.data.action === 'admin') {
    if (reportMenu.classList.contains('active')) {
        reportMenu.classList.remove('active');
    }
    document.getElementById('online-admins').innerText = event.data.onlineAdmins;
    adminMenu.classList.add('active');

    const reports = event.data.reports;
    const reportList = document.getElementById('report-list');

    reportList.innerHTML = '';

    reports.forEach(report => {
        addReportItem(report);
    });
  } else if (event.data.action === 'updateReports') {
    const reports = event.data.reports;
    const reportList = document.getElementById('report-list');
    
    reportList.innerHTML = '';
    
    reports.forEach(report => {
      addReportItem(report);
    });
  }
})

window.addEventListener('keydown', function(event) {
		if (event.key === 'Escape') {
				closeUi();
		}
});
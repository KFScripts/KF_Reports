RegisterCommand('report', function()
  SendNUIMessage({
      action = 'report'
  })
  SetNuiFocus(true, true)
end, false)

RegisterNUICallback('close', function(data, cb)
  SetNuiFocus(false, false)
  cb('ok')
end)

RegisterNetEvent('KF_Reports:openAdminMenu')
AddEventHandler('KF_Reports:openAdminMenu', function(reports, onlineAdmins)
    SendNUIMessage({
        action = 'admin',
        reports = reports,
        onlineAdmins = tostring(onlineAdmins)
    })
    SetNuiFocus(true, true)
end)

RegisterNetEvent('KF_Reports:UpdateReportsList')
AddEventHandler('KF_Reports:UpdateReportsList', function(reports)
    SendNUIMessage({
        action = 'updateReports',
        reports = reports
    })
end)

RegisterNUICallback('submitReport', function(data, cb)
  local reportData = {
      description = data.description,
      type = data.type
  }
  
  TriggerServerEvent('KF_Reports:sendReport', reportData)
  SetNuiFocus(false, false)
  cb('ok')
end)

RegisterNetEvent('KF_Reports:Notify')
AddEventHandler('KF_Reports:Notify', function(message, type)
  Config.Notify(message, type)
end)

RegisterNUICallback('notify', function(data, cb)
  Config.Notify(data.message, data.type)
  cb('ok')
end)

RegisterNUICallback('changeReportStatus', function(data, cb)
  TriggerServerEvent('KF_Reports:changeReportStatus', data.reportId, data.status)
  cb('ok')
end)

RegisterNUICallback('teleportPlayer', function(data, cb)
  TriggerServerEvent('KF_Reports:TeleportPlayer', data.playerId)
  cb('ok')
end)

RegisterNUICallback('bringPlayer', function(data, cb)
  TriggerServerEvent('KF_Reports:BringPlayer', data.playerId)
  cb('ok')
end)
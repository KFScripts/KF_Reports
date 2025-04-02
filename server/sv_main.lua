ESX = Config.Framework == 'esx' and exports.es_extended:getSharedObject() or nil
QBCore = Config.Framework == 'qb-core' and exports['qb-core']:GetCoreObject() or nil

local reports = {}
local totalReports = 0

local function isAdmin(source)
	if Config.Framework == 'esx' then
		local xPlayer = ESX.GetPlayerFromId(source)
		if xPlayer then
			for _, group in ipairs(Config.AdminGroups) do
				if xPlayer.getGroup() == group then
					return true
				end
			end
		end
	elseif Config.Framework == 'qbcore' then
		local Player = QBCore.Functions.GetPlayer(source)
		if Player then
			for _, group in ipairs(Config.AdminGroups) do
				if QBCore.Functions.HasPermission(src, group) then
					return true
				end
			end
		end
	end
	return false
end

local function SendNotifyToAdmins(message, type)
	for _, playerId in ipairs(GetPlayers()) do
		if isAdmin(playerId) then
			TriggerClientEvent('KF_Reports:Notify', playerId, message, type)
		end
	end
end

local function GetOnlineAdmins()
	local admins = {}
	for _, playerId in ipairs(GetPlayers()) do
		if isAdmin(playerId) then
			table.insert(admins, playerId)
		end
	end
	return #admins or 0
end

RegisterCommand('reports', function(source)
	if isAdmin(source) then
		TriggerClientEvent('KF_Reports:openAdminMenu', source, reports, GetOnlineAdmins())
	else
		TriggerClientEvent('KF_Reports:Notify', source, 'You do not have permission to access this command.', 'error')
	end
end, false)
	
RegisterNetEvent('KF_Reports:sendReport')
AddEventHandler('KF_Reports:sendReport', function(reportData)
	local src = source
	if reportData and reportData.type and reportData.description then
		totalReports = totalReports + 1
		table.insert(reports, {
			id = totalReports,
			playerId = src,
			type = reportData.type,
			description = reportData.description,
			status = 'pending',
		})

		SendNotifyToAdmins('New report from player ID: ' .. src, 'info')
		TriggerClientEvent('KF_Reports:UpdateReportsList', -1, reports)
	else
		TriggerClientEvent('KF_Reports:Notify', src, 'Invalid report data.', 'error')
	end
end)

RegisterNetEvent('KF_Reports:changeReportStatus')
AddEventHandler('KF_Reports:changeReportStatus', function(reportId, status)
	local src = source
	if isAdmin(src) then
		for i, report in ipairs(reports) do
			if report.id == reportId then
				report.status = status
				TriggerClientEvent('KF_Reports:UpdateReportsList', -1, reports)
				TriggerClientEvent('KF_Reports:Notify', report.playerId, 'Your report has been updated to ' .. status, 'info')
				TriggerClientEvent('KF_Reports:Notify', src, 'Report #' .. report.id .. ' status updated to ' .. status, 'success')
				return
			end
		end
		TriggerClientEvent('KF_Reports:Notify', src, 'Report not found.', 'error')
	else
		TriggerClientEvent('KF_Reports:Notify', src, 'You do not have permission to change report status.', 'error')
	end
end)

RegisterNetEvent('KF_Reports:BringPlayer')
AddEventHandler('KF_Reports:BringPlayer', function(playerId)
	local src = source
	if isAdmin(src) then
		local targetPlayer = GetPlayerPed(playerId)
		if targetPlayer then
			local playerPed = GetPlayerPed(src)
			local playerCoords = GetEntityCoords(playerPed)

			SetEntityCoords(targetPlayer, playerCoords.x, playerCoords.y, playerCoords.z)
			TriggerClientEvent('KF_Reports:Notify', src, 'Brought player ID: ' .. playerId .. ' to you.', 'success')
			TriggerClientEvent('KF_Reports:Notify', playerId, 'Ad admin has brought you to them.', 'info')
		else
			TriggerClientEvent('KF_Reports:Notify', src, 'Player not found.', 'error')
		end
	else
		TriggerClientEvent('KF_Reports:Notify', src, 'You do not have permission to teleport players.', 'error')
	end
end)

RegisterNetEvent('KF_Reports:TeleportPlayer')
AddEventHandler('KF_Reports:TeleportPlayer', function(playerId)
	local src = source
	if isAdmin(src) then
		local targetPlayer = GetPlayerPed(playerId)
		if targetPlayer then
			local playerPed = GetPlayerPed(src)
			local targetCoords = GetEntityCoords(targetPlayer)
			SetEntityCoords(playerPed, targetCoords.x, targetCoords.y, targetCoords.z)
			TriggerClientEvent('KF_Reports:Notify', src, 'Teleported to player ID: ' .. playerId, 'success')
			TriggerClientEvent('KF_Reports:Notify', playerId, 'Ad admin has teleported to you.', 'info')
		else
			TriggerClientEvent('KF_Reports:Notify', src, 'Player not found.', 'error')
		end
	else
		TriggerClientEvent('KF_Reports:Notify', src, 'You do not have permission to bring players.', 'error')
	end
end)
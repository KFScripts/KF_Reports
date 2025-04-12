-- ############################################### --
-- ## ██╗  ██╗███████╗██████╗ ███████╗██╗   ██╗ ## --
-- ## ██║ ██╔╝██╔════╝██╔══██╗██╔════╝██║   ██║ ## --
-- ## █████╔╝ █████╗  ██║  ██║█████╗  ██║   ██║ ## --
-- ## ██╔═██╗ ██╔══╝  ██║  ██║██╔══╝  ╚██╗ ██╔╝ ## --
-- ## ██║  ██╗██║     ██████╔╝███████╗ ╚████╔╝  ## --
-- ## ╚═╝  ╚═╝╚═╝     ╚═════╝ ╚══════╝  ╚═══╝   ## --
-- ## KF Report System                          ## --
-- ## Developed by KFDev                        ## --
-- ## DISCORD:         https://discord.gg/kfdev ## --
-- ## TEBEX:           https://kfdev.tebex.io   ## --
-- ## DOCUMENATION:    https://docs.kfdev.it/   ## --
-- ############################################### --

Config = {}

Config.Framework = 'esx' -- Change to 'qb-core' if using QBCore

Config.AdminGroups = {
    'admin', 
    'superadmin', 
    'mod'
}

-- [[ Notifications ]]
-- You can set here your own events
Config.Notify = function(msg, type)
    if Config.Framework == 'esx' then
        TriggerEvent('esx:showNotification', msg)
    elseif Config.Framework == 'qb-core' then
        QBCore.Functions.Notify(msg, type)
    end
end
fx_version 'cerulean'
game 'gta5'

author 'KFDev <info.kfdev@gmail.com> | discord.gg/kfdev'
description 'KFDev - Report System'
version '1.0.0'

lua54 'yes'

client_scripts {
  'client/**/*',
}

server_scripts {
  'server/**/*',
}

shared_scripts {
  'config.lua',
}

ui_page 'web/index.html'

files {
  'web/**/*',
}
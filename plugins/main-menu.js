import moment from "moment-timezone";
import fs from "fs";

const defaultMenu = {
  before: `
  Hello %tag,
  \n %ucpn\n
  🤖 *${botname} at Your Service!*
  
  ┏━━༻ *USER STATS* ༺━━┓
  ⚔️ *Name:* %name
  💰 *Gold:* %credit
  🎭 *Role:* %role
  📈 *Level:* %level [ %xp4levelup XP to Level Up]
  🌟 *XP:* %exp / %maxexp
  🌌 *Total XP:* %totalexp
  ╰──────────⳹

  ┏━━༻ *ROBOT INFO* ༺━━┓
  ⚙️ *Robot Name:* ${botname}
  ⚓ *Command Prefix:* *%_p*
  🚀 *Operation Mode:* %mode
  ⏰ *Uptime:* %muptime
  💾 *Database:*  %totalreg
  ╰──────────⳹

  ┏━༻ *ROBOT DETAILS* ༺━┓
  🔋 *Power Source:* High-Density Lithium Cells  
  ⚙️ *Core System:* Multi-Function Automation Unit  
  📡 *Connectivity:* Secure Encrypted Network   
  🤖 *Adaptive Learning:* Auto-Task Optimization  
  🎛️ *Control System:* Remote & Autonomous Modes  
  🔄 *Maintenance Cycle:* Auto-Diagnostics Every 24H  
  ⚡ *Processing Unit:* Multi-Core Neural Processor    
  ╰──────────⳹

  ┏༻ *COMMAND CENTER* ༺┓
  │ *%totalfeatures* Commands
  ╰──────────⳹
  %readmore
  
  ┏━❀•🎀 *GROUP* 🎀•❀━┓
◈ .getbio <@tag/reply>  Ⓛ
◈ .Setdesc <text>
◈ .setname <text>
◈ .add
◈ .approve
◈ .accept
◈ .delete
◈ .delwarn @user
◈ .unwarn @user
◈ .demote (@tag)
◈ .infogp
◈ .hidetag
◈ .invite <917xxx>
◈ .kick @user
◈ .kickcountry <country code>
◈ .link
◈ .poll question|option1|option2
◈ .profile
◈ .promote
◈ .resetlink
◈ .setbye <text>
◈ .group *open/close*
◈ .setwelcome <text>
◈ .simulate <event> @user
◈ .admins hello
◈ .tagadmins
◈ .admin
◈ .tagall
◈ .totag
◈ .warn @user
◈ .warns
◈ .main
╚══•❅•°•❈•°•❅•══╝
  ‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎‎
┏━❀•🎀 *FUN* 🎀•❀━┓
◈ .define <word>
◈ .afk <reason>
◈ .animequote
◈ .simpcard
◈ .itssostupid
◈ .iss
◈ .stupid
◈ .tweet <comment>
◈ .lolicon
◈ .ytcomment <comment>
◈ .tomp3
◈ .toav
◈ .robot
◈ .character @tag
◈ .countdown <normal|fast> <number>
◈ .dare
◈ .flirt
◈ .gay @user
◈ .hack @tag
◈ .hack group
◈ .pickupline
◈ .question
◈ .shayari
◈ .ship
◈ .yomamajoke
◈ .truth
◈ .waste @user
◈ .wouldyourather
◈ .image
◈ .meme
◈ .quote
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *TOOLS* 🎀•❀━┓
◈ .checkwa
◈ .qrcodegen <text>
◈ .fancy <key> <text>
◈ .weather *<place>*
◈ .dehaze
◈ .recolor
◈ .hdr
◈ .length <amount>
◈ .tinyurl <link>
◈ .shorten <link>
◈ .tempmail
◈ .shazam
◈ .cal <equation>
◈ ..carbon <code>
◈ .define <word>
◈ .element
◈ .itunes
◈ .lyrics
◈ .imdb
◈ .ocr
◈ .course
◈ .randomcourse
◈ .readmore <text1>|<text2>
◈ .readvo
◈ .removebg
◈ .ss <url>
◈ .ssf <url>
◈ .subreddit
◈ .tourl
◈ .translate <lang> <text>
◈ .true
◈ .tts <lang> <task>
◈ .wa
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *GAME* 🎀•❀━┓
◈ .slot <amount>
◈ .chess [from to]
◈ .chess delete
◈ .chess join
◈ .chess start
◈ .delttt
◈ .guessflag
◈ .Maths <modes>
◈ .ppt <rock/paper/scissors>
◈ .tictactoe <room name>
◈ .ttt <room name>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *ANIME* 🎀•❀━┓
◈ .anime
◈ .akira
◈ .akiyama
◈ .anna
◈ .asuna
◈ .ayuzawa
◈ .boruto
◈ .chiho
◈ .chitoge
◈ .deidara
◈ .erza
◈ .elaina
◈ .eba
◈ .emilia
◈ .hestia
◈ .hinata
◈ .inori
◈ .isuzu
◈ .itachi
◈ .itori
◈ .kaga
◈ .kagura
◈ .kaori
◈ .keneki
◈ .kotori
◈ .kurumi
◈ .madara
◈ .mikasa
◈ .miku
◈ .minato
◈ .naruto
◈ .nezuko
◈ .sagiri
◈ .sasuke
◈ .sakura
◈ .manhwa
◈ .waifu
◈ .neko
◈ .zerotwo
◈ .loli
◈ .animequote
◈ .pokedex <pokemon>
◈ .trace
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *DOWNLOADER* 🎀•❀━┓
◈ .gitclone <url>
◈ .instagram
◈ .mega
◈ .modapk
◈ .play  Ⓛ
◈ .spotify
◈ .ytsearch
◈ .ytmp4 <yt-link>
◈ .wallpaper <query>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *ECONOMY* 🎀•❀━┓
◈ .addgold <@user>
◈ .addxp <@user>
◈ .bank
◈ .buych
◈ .cock-fight <amount>
◈ .buy
◈ .buyall
◈ .daily
◈ .deposit
◈ .gamble <amount> <color(red/black)>
◈ .give credit [amount] [@tag]
◈ .levelup
◈ .rob
◈ .roulette <amount> <color(red/black)>
◈ .wallet
◈ .withdraw
◈ .work
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *CORE* 🎀•❀━┓
◈ .leaderboard
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *RELIGION* 🎀•❀━┓
◈ .bible [chapter_number|chapter_name]
◈ .gita [verse_number]
◈ .quran [number|name]
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *IMAGE* 🎀•❀━┓
◈ .blackpink
◈ .messi
◈ .cristianoronaldo
◈ .cr7
◈ .ppcouple
◈ .ppcp
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *SEARCH* 🎀•❀━┓
◈ .wiki
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *REACTION* 🎀•❀━┓
◈ .bully @tag
◈ .cuddle @tag
◈ .cry @tag
◈ .hug @tag
◈ .awoo @tag
◈ .kiss @tag
◈ .lick @tag
◈ .pat @tag
◈ .smug @tag
◈ .bonk @tag
◈ .yeet @tag
◈ .blush @tag
◈ .smile @tag
◈ .wave @tag
◈ .highfive @tag
◈ .handhold @tag
◈ .nom @tag
◈ .bite @tag
◈ .glomp @tag
◈ .slap @tag
◈ .kill @tag
◈ .happy @tag
◈ .wink @tag
◈ .poke @tag
◈ .dance @tag
◈ .cringe @tag
◈ .scream @tag
◈ .pout @tag
◈ .sigh @tag
◈ .tease @tag
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *MAIN* 🎀•❀━┓
◈ .alive
◈ .info
◈ .totalfeature
◈ .list
◈ .groupmenu
◈ .dlmenu
◈ .downloadermenu
◈ .economymenu
◈ .funmenu
◈ .gamemenu
◈ .stickermenu
◈ .nsfwmenu
◈ .logomenu
◈ .toolmenu
◈ .listprem
◈ .ping
◈ .runtime
◈ .server
◈ .blocklist
◈ .setprivacy
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *MAKER* 🎀•❀━┓
◈ .blur
◈ .difuminar2
◈ .hornycard
◈ .hornylicense
◈ .gfx1
◈ .gfx2
◈ .gfx3
◈ .gfx4
◈ .gfx5
◈ .gfx6
◈ .gfx7
◈ .gfx8
◈ .gfx9
◈ .gfx10
◈ .gfx11
◈ .gfx12
◈ .simpcard
◈ .itssostupid
◈ .iss
◈ .stupid
◈ .tweet <comment>
◈ .lolicon
◈ .ytcomment <comment>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *STICKER* 🎀•❀━┓
◈ .emojimix <emoji+emoji>
◈ .smaker
◈ .stickerwithmeme (caption|reply media)
◈ .swmeme <url>
◈ .swm(caption|reply media)
◈ .sfull
◈ .toimg <sticker>
◈ .tovid
◈ .trigger <@user>
◈ .ttp
◈ .ttp2
◈ .ttp3
◈ .ttp4
◈ .ttp5
◈ .attp
◈ .attp2
◈ .attp3
◈ .take <name>|<author>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *AI* 🎀•❀━┓
◈ .toanime
◈ .tocartoon
◈ .hd 🅟
◈ .hdr 🅟
◈ .unblur 🅟
◈ .colorize 🅟
◈ .colorizer 🅟
◈ .enhance 🅟
◈ .enhancer 🅟
◈ .dehaze 🅟
◈ .recolor 🅟
◈ .enhance 🅟
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *REGISTER* 🎀•❀━┓
◈ .reg <name.age>
◈ .mysn
◈ .unreg <Num Serie>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *NSFW* 🎀•❀━┓
◈ .genshin
◈ .swimsuit
◈ .schoolswimsuit
◈ .white
◈ .barefoot
◈ .touhou
◈ .gamecg
◈ .hololive
◈ .uncensored
◈ .sunglasses
◈ .glasses
◈ .weapon
◈ .shirtlift
◈ .chain
◈ .fingering
◈ .flatchest
◈ .torncloth
◈ .bondage
◈ .demon
◈ .wet
◈ .pantypull
◈ .headdress
◈ .headphone
◈ .tie
◈ .anusview
◈ .shorts
◈ .stokings
◈ .topless
◈ .beach
◈ .bunnygirl
◈ .bunnyear
◈ .idol
◈ .vampire
◈ .gun
◈ .maid
◈ .bra
◈ .nobra
◈ .bikini
◈ .whitehair
◈ .blonde
◈ .pinkhair
◈ .bed
◈ .ponytail
◈ .nude
◈ .dress
◈ .underwear
◈ .foxgirl
◈ .uniform
◈ .skirt
◈ .sex
◈ .sex2
◈ .sex3
◈ .breast
◈ .twintail
◈ .spreadpussy
◈ .tears
◈ .seethrough
◈ .breasthold
◈ .drunk
◈ .fateseries
◈ .spreadlegs
◈ .openshirt
◈ .headband
◈ .food
◈ .close
◈ .tree
◈ .nipples
◈ .erectnipples
◈ .horns
◈ .greenhair
◈ .wolfgirl
◈ .catgirl
◈ .nsfw
◈ .ass
◈ .boobs
◈ .lesbian
◈ .pussy
◈ .pack
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *MAKER* 🎀•❀━┓
◈ .blur
◈ .difuminar2
◈ .hornycard
◈ .hornylicense
◈ .gfx1
◈ .gfx2
◈ .gfx3
◈ .gfx4
◈ .gfx5
◈ .gfx6
◈ .gfx7
◈ .gfx8
◈ .gfx9
◈ .gfx10
◈ .gfx11
◈ .gfx12
◈ .simpcard
◈ .itssostupid
◈ .iss
◈ .stupid
◈ .tweet <comment>
◈ .lolicon
◈ .ytcomment <comment>
╚══•❅•°•❈•°•❅•══╝

┏━❀•🎀 *AUDIO* 🎀•❀━┓
◈ .bass [vn]
◈ .blown [vn]
◈ .deep [vn]
◈ .earrape [vn]
◈ .fast [vn]
◈ .fat [vn]
◈ .nightcore [vn]
◈ .reverse [vn]
◈ .robot [vn]
◈ .slow [vn]
◈ .smooth [vn]
◈ .tupai [vn]
╚══•❅•°•❈•°•❅•══╝

┏━━༻ *GUIDELINES* ༺━━┓
⚠️ *I'm a Robot, not a bot.* Calling me "bot" may lead to a ban or removal from the group.  
🚫 *Do not spam commands.* Excessive use may lead to temporary restrictions.  
📵 *Do not spam in my DM & do not call me.* Violations will result in an immediate block.  
📨 *Need Help?* DM me, and I or my support agents will assist you.  
  🔞 Use 18+ NSFW commands responsibly. If using in a group, ensure it’s allowed by the admins.
🚫 Respect Group Rules! Misuse may result in removal.
╰──────────⳹

~ Silver Fox
  
`.trimStart(),
};

let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    react: { text: "⏳", key: m.key },
  });

  try {
    let glb = global.db.data.users;
    let user = glb[m.sender];
    let tag = `@${m.sender.split("@")[0]}`;
    let mode = global.opts["self"] ? "Private" : "Public";

    let _uptime = process.uptime() * 1000;
    let uptime = clockString(_uptime);
    let muptime = uptime;

    let totalreg = Object.keys(glb).length;
    let name = await conn.getName(m.sender);
    let ucpn = `${ucapan()}`;
    let totalfeatures = "XX"; // Placeholder for total commands

    let replace = {
      "%": "%",
      tag,
      ucpn,
      name,
      credit: user.credit,
      role: user.role,
      level: user.level,
      exp: user.exp,
      maxexp: "XX",
      totalexp: "XX",
      xp4levelup: "XX",
      mode,
      muptime,
      uptime,
      totalreg,
      totalfeatures,
      readmore: readMore,
    };

    let text = defaultMenu.before.replace(/%(\w+)/g, (_, name) => replace[name] || "");

    let imageUrl = "https://i.imgur.com/Od18YBm.jpeg";

    conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: text.trim(),
    });

  } catch (e) {
    await conn.reply(m.chat, "😵 Oops! Something went wrong.", m);
    throw e;
  }
};

handler.command = /^(menu|help|\?)$/i;
export default handler;

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

function clockString(ms) {
  let h = Math.floor(ms / 3600000);
  let m = Math.floor(ms / 60000) % 60;
  let s = Math.floor(ms / 1000) % 60;
  return [h, "H", m, "M", s, "S"].map(v => v.toString().padStart(2, 0)).join(" ");
}

function ucapan() {
  const time = moment.tz("Asia/Karachi").format("HH");
  if (time < 4) return "🌙 Good Night!";
  if (time < 11) return "😎 Good Morning!";
  if (time < 15) return "🌞 Good Afternoon!";
  return "🌆 Good Evening!";
}

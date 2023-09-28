const {saveAs} = require("file-saver")

const pages = [
  "cem",
  "cem_animation_doc",
  "commands",
  "features",
  "privacy"
]

const rgxURLParams = /(?:^\?|&)([A-z0-9-]+)(?:=([^&]+)|(?=&)|$|=)/g
const E = s => $(document.createElement(s))
const measureCanvas = document.createElement("canvas")
const measure = measureCanvas.getContext("2d")
const botPrefix = "e!"
let commandData

function getURLParams(s){
  let str = s
  if (!str) str = location.search
  if (str.length < 2) return null
  let params = {}
  let m; while (m = rgxURLParams.exec(str)){
    params[m[1]] = m[2] ? decodeURIComponent(m[2].replace(/\+/g, "%20")) : true
  }
  return params
}

function toURLParams(o){
  let arr = []
  for(let k in o) if (o.hasOwnProperty(k) && o[k] != null){
    if(o[k] === true){
      arr.push(`${arr.length === 0 ? "?" : "&"}${k}`)
    }else {
      let encodedVal = encodeURIComponent(o[k])
        .replace(/%3A/g, ":")
        .replace(/%3B/g, ";")
        .replace(/%20/g, "+")
        .replace(/%2C/g, ",")
        .replace(/%2F/g, "/")
        .replace(/%40/g, "@")
      arr.push(`${arr.length === 0 ? "?" : "&"}${k}=${encodedVal}`)
    }
  }
  return arr.join("")
}

function pageLoad(){
  const params = getURLParams()
  if (params != null){
    const pageName = Object.keys(params).find(e => ~pages.indexOf(e))
    if(pageName){
      showPage(pageName, false)
    }else{
      showPage("home", false)
    }
  }else{
    showPage("home", false)
  }
}

async function showPage(pageName, updateState = true){
  if(pageName in pageFunctionsSingle){
    await pageFunctionsSingle[pageName]()
    delete pageFunctionsSingle[pageName]
  }
  if(pageName in pageFunctions){
    pageFunctions[pageName]()
  }
  if(updateState){
    if(pageName === "home"){
      history.pushState(null, "", "/")
    }else{
      history.pushState(null, "", `?${pageName}`)
    }
  }
  gtag("config", "UA-155158328-3", {
    "page_title": pageName,
    "page_path": location.pathname+location.search
  })
  for(let page of document.querySelectorAll(".page")){
    page.classList.add("hidden")
  }
  document.querySelector(`#${pageName}`).classList.remove("hidden")
  $(".banner .selected").removeClass("selected")
  $(`#${pageName}Button`).addClass("selected")
  window.scrollTo(0, 0)
}

function addCommandDetails(commandName, commandElement, categoryData, commandData, className, fomattingClassName){
  const commandDetails = document.createElement("div")
  commandDetails.classList.add("hidden")
  commandElement.classList.add("dropdownButton")
  commandElement.addEventListener("click", evt => {
    commandDetails.classList.toggle("hidden")
    evt.currentTarget.classList.toggle("dropped")
  })
  categoryData.appendChild(commandDetails)
  if ("description" in commandData.commands[commandName]){
    const commandDescription = document.createElement("div")
    commandDescription.classList.add(className)
    commandDescription.textContent = commandData.commands[commandName].description
    commandDetails.appendChild(commandDescription)
  }
  const commandFormatting = document.createElement("div")
  commandFormatting.classList.add(fomattingClassName)
  loop:
  for (let category of Object.values(commandData.categories)){
    for (let command of category.commands){
      if (command.startsWith(commandName)){
        const formattingString = command.replace(/[^\s]+\s+(.+)/, "$1").replace(/([\]\>])([\[\<])/g, "$1 $2")
        if (formattingString != "[n/a]"){
          commandFormatting.textContent = `${botPrefix}${commandName} ${formattingString}`
        } else {
          commandFormatting.textContent = `${botPrefix}${commandName}`
        }
        break loop
      }
    }
  }
  commandDetails.appendChild(commandFormatting)
  if ("permissions" in commandData.commands[commandName]){
    const commandPermissions = document.createElement("div")
    commandPermissions.classList.add(className)
    commandPermissions.textContent = `Permissions: ${commandData.commands[commandName].permissions}`
    commandDetails.appendChild(commandPermissions)
  }
  if ("cooldown" in commandData.commands[commandName]){
    const commandCooldown = document.createElement("div")
    commandCooldown.classList.add(className)
    commandCooldown.textContent = `${commandData.commands[commandName].cooldown} second cooldown`
    commandDetails.appendChild(commandCooldown)
  }
}

document.body.addEventListener("touchend", e => {
  if (e.currentTarget.classList.contains("bannerDrop")) {
    for (const menu of document.querySelectorAll(".menu.touch-open")) {
      if (menu == e.currentTarget.querySelector(".menu")){
        continue
      }
      menu.classList.remove("touch-open")
    }
  } else {
    for (const menu of document.querySelectorAll(".menu.touch-open")) {
      menu.classList.remove("touch-open")
    }
  }
})

window.addEventListener("popstate", pageLoad)

document.querySelector("#commandsButton").addEventListener("click", evt => {
  evt.preventDefault()
  showPage("commands")
})

document.querySelector("#featuresButton").addEventListener("click", evt => {
  evt.preventDefault()
  showPage("features")
})

document.querySelector("#cemButton").addEventListener("click", evt => {
  evt.preventDefault()
  showPage("cem")
})

document.querySelector("#privacyButton").addEventListener("click", evt => {
  evt.preventDefault()
  showPage("privacy")
})

document.querySelector("#cem_animation_docButton").addEventListener("click", evt => {
  evt.preventDefault()
  showPage("cem_animation_doc")
})

for (let button of document.querySelectorAll('[href="/"]')){
  button.addEventListener("click", evt => {
    evt.preventDefault()
    showPage("home")
  })
}

const pageFunctionsSingle = {
  async commands(){
    commandData = await fetch("https://www.wynem.com/bot_assets/json/commands.json").then(e => e.json())
  },
  async cem(){
    const entityData = await fetch("https://www.wynem.com/bot_assets/json/cem_template_models.json").then(e => e.json())
    const categoryList = [
      "supported",
      "legacy",
      "unsupported",
      "unreleased"
    ]
    for(const categoryName of categoryList){
      const category = entityData.categories.find(e => e.name.toLowerCase() === categoryName)
      if(!category){
        continue
      }
      $("#entityListBox").append(E("h1").css({
        fontSize: "1.8em",
        display: "list-item",
        "list-style-position": "inside",
        padding: "20px 0 0 0"
      }).text(categoryName)).append(E("div").addClass("categoryEntities").attr("id", `${categoryName}Entities`))
      for(const entity of category.entities){
        const entityID = typeof entity === "string" ? entity : entity.name
        const entityName = typeof entity === "string" ? entity.replace(/_/g, " ") : entity.display_name ? entity.display_name : entity.name.replace(/_/g, " ")
        const modelID = typeof entity === "string" ? entity : entity.model ? entity.model : entity.name
        const model = entityData.models[modelID].model
        const fileName = entity.file_name ? entity.file_name : entityID
        $(`#${categoryName}Entities`).append(
          E("div").addClass("entityBox").attr("data-entityid", entityID).append(
            E("label").text(entityName),
            E("img").attr("src", `https://www.wynem.com/bot_assets/images/minecraft/renders/${entityID}.png`)
          ).on("click", evt => {
            const params = getURLParams()
            params.cem = entityID
            history.replaceState(null, "", toURLParams(params))
            gtag("config", "UA-155158328-3", {
              "page_title": "cem",
              "page_path": location.pathname+toURLParams(params)
            })
            $(".entityBox.selected").removeClass("selected")
            $(evt.currentTarget).addClass("selected")
            $(".stickyEntityBox").remove()
            $("#boneListBox").append(E("div").addClass("stickyEntityBox").append(
              E("h1").text(entityName),
              entity.vanilla_textures
                ? E("div").addClass("entityTextureCycle").append(...entity.vanilla_textures.map((e, i) => E("div").addClass(`entityTextureWrapper ${i ? "hidden" : ""}`).append(E("img").addClass("entityTexture").attr("src", `https://www.wynem.com/bot_assets/images/minecraft/entities/${entityID}${i ? i : ""}.png`))))
                : E("div").addClass("entityTextureWrapper").append(E("img").addClass("entityTexture").attr("src", `https://www.wynem.com/bot_assets/images/minecraft/entities/${entityID}.png`)),
              E("button").addClass("entityDownload").text("Download Model").on("click", evt => saveAs(new Blob([compileJSON(JSON.parse(model))]), `${fileName}.jem`)),
              E("button").text("Open in Blockbench").attr("title", "Requires the CEM Template Loader plugin to be installed in the web app").on("click", evt => window.open(`https://web.blockbench.net/?plugins=cem_template_loader&model=${entityID}&texture`, "_blank").focus()),
              E("h2").text("Model Structure:"),
              E("table").addClass("entityBones").append(E("tr").append(
                E("th").text("Part name"),
                E("th").text("Pivot point location")
              ))
            ))
            const table = $(".entityBones")
            for (const part of JSON.parse(model).models) {
              table.append(E("tr").append(
                E("td").text(part.part),
                E("td").text(`${part.translate[0]}, ${part.translate[1] * -1}, ${part.translate[2]}`)
              ))
            }
            console.log(JSON.stringify(JSON.parse(model), null, 2))
          })
        )
      }
    }
    const params = getURLParams()
    if(params){
      if(typeof params.cem === "string"){
        $(`.entityBox[data-entityid="${params.cem}"]`).click()
        if(params.download){
          $(`.entityDownload`).click()
          delete params.download
          history.replaceState(null, "", toURLParams(params))
        }
      }
      if(typeof params.search === "string"){
        $("#entitySearch>input").val(params.search).trigger("input").select()
      }
    }
    setInterval(() => {
      const cycleBox = $(".entityTextureCycle")
      if(cycleBox.length > 0 && cycleBox.is(":hover")){
        return
      }
      const prev = cycleBox.find(".entityTextureWrapper:not(.hidden)").addClass("hidden")
      let next = prev.next()
      if(next.length === 0){
        next = prev.parent().children().first()
      }
      next.removeClass("hidden")
    }, 2000)
  },
  async cem_animation_doc(){
    const docData = await fetch("https://www.wynem.com/bot_assets/json/cem_animation_doc.json").then(e => e.json())
    const doc = $("#cem_doc")
    const tabs = $("#cem_doc_tabs")
    for (const tab of docData.tabs){
      const name = tab.name.replace(/ /g, "_")
      tabs.append(E("div").attr("id", `cem_doc_tab_${tab.name.replace(/ /g, "-")}`).html(tab.name).on("click", evt => {
        $("#cem_doc_tabs>div").removeClass("selected")
        $("#cem_doc>div").removeClass("selected")
        $(evt.target).addClass("selected")
        $(`#cem_doc_page_${name}`).addClass("selected")
        window.scrollTo(0, 0)
      }))
      const page = E("div").attr("id", `cem_doc_page_${name}`).appendTo(doc)
      for (const element of tab.elements) {
        if (element.type === "heading") page.append(E("h2").html(element.text))
        else if (element.type === "text") page.append(E("p").html(element.text))
        else if (element.type === "code") page.append(E("pre").html(element.text))
        else if (element.type === "table") {
          const table = E("table").appendTo(page)
          if (element.tableType === "list") table.addClass("cem_doc_table_list")
          for (const row of element.rows) {
            const tr = E("tr").appendTo(table)
            for (const [i, cell] of row.entries()) {
              tr.append(E("td").html(cell))
            }
          }
        }
        else if (element.type === "image") page.append(E("img").attr({
          src: element.url,
          width: element.width,
          height: element.height
        }))
      }
    }
    $("#cem_doc_tabs>:first-child").addClass("selected")
    $("#cem_doc>:first-child").addClass("selected")
    $(".cem_doc_tab_link").on("click", evt => {
      $("#cem_doc_tabs>div").removeClass("selected")
      $("#cem_doc>div").removeClass("selected")
      $(`#cem_doc_tab_${evt.target.textContent.replace(/ /g, "-")}`).addClass("selected")
      $(`#cem_doc_page_${evt.target.textContent}`).addClass("selected")
      window.scrollTo(0, 0)
    })
    $(".cem_doc_display_web").css("display", "none")
    doc.append(
      E("hr"),
      E("p").html(`Documentation version:   <span style="font-family:var(--font-code)">v${docData.version}</span>\nUpdated to:   <span style="font-family:var(--font-code)">OptiFine ${docData.optifineVersion}</span>`)
    )
  }
}

const pageFunctions = {
  cem(){
    setTimeout(() => $("#entitySearch>input").select(), 0)
  },
  commands(){
    const params = getURLParams()
    showCategory(params && typeof params.commands === "string" ? params.commands.split("/") : [], false, params ? params.command : undefined)
  }
}

window.processEntitySearch = function(evt){
  const query = $("#entitySearch>input").val().toLowerCase()
  $(".entityBox").each((i, e) => {
    const label = $(e).children().first()
    if(~label.text().toLowerCase().indexOf(query)){
      $(e).css("display", "")
    }else{
      $(e).css("display", "none")
    }
  })
  $("#entityListBox>h1").each((i, e) => {
    e.style.display = $(e).next().children().toArray().some(e => e.style.display === "") ? "" : "none"
  })
  const params = getURLParams()
  if(query === ""){
    delete params.search
  }else{
    params.search = query
  }
  history.replaceState(null, "", toURLParams(params))
}

window.processEndEntitySearch = function(evt){
  const query = evt.currentTarget.value.toLowerCase()
  const params = getURLParams()
  params.search = query
  gtag("config", "UA-155158328-3", {
    "page_title": "search",
    "page_path": location.pathname+toURLParams(params)
  })
}

async function showCategory(path, updateState, scrollTo){
  if(updateState) history.pushState("", null, toURLParams({commands: path.length === 0 ? true : path.join("/")}))
  const commands = $("#commandlist").empty()
  const categoryList = document.getElementById("categories")
  const categoryPath = document.getElementById("category-path")
  categoryList.innerHTML = ""
  categoryPath.innerHTML = ""
  E("div").addClass("category-path-stage").append(E("div").text("Wynem").on("click", evt => showCategory([], true))).appendTo(categoryPath)
  let data = commandData
  for(const [i, stage] of path.entries()){
    if(!data.categories || !data.categories[stage]){
      path = path.slice(0, i)
      const params = getURLParams()
      params.commands = path.join("/")
      history.replaceState("", null, toURLParams(params))
      break
    }
    E("div").addClass("category-path-stage").append(E("div").text(stage).on("click", evt => showCategory(path.slice(0, i + 1), true))).appendTo(categoryPath)
    data = data.categories[stage]
  }
  gtag("config", "UA-155158328-3", {
    "page_title": "commands",
    "page_path": location.pathname+location.search
  })
  const categoryName = path.length > 0 ? path[path.length - 1] : "Wynem"
  const categoryNameBox = document.getElementById("category-name")
  categoryNameBox.innerHTML = ""
  if(categoryName !== "Wynem"){
    const backButton = document.createElement("div")
    backButton.classList.add("category-back-button")
    backButton.innerHTML = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>`
    backButton.addEventListener("click", evt => showCategory(path.slice(0, -1), true))
    categoryNameBox.appendChild(backButton)
  }else{
    commands.append(E("div").addClass("commands-logo-container").html(await fetch(require("../assets/images/logo/wynem.svg").default).then(e => e.text())))
  }
  const newName = document.createElement("div")
  newName.textContent = categoryName
  categoryNameBox.appendChild(newName)
  setTimeout(() => {
    let fontSize = 50
    measure.font = `${fontSize}px AlteDin`
    const width = $("#category-name").width() - 60
    while(measure.measureText(categoryName).width > width){
      fontSize--
      measure.font = `${fontSize}px AlteDin`
    }
    $("#category-name div").css("font-size", fontSize + "px")
  }, 0)
  if(data.categories) for(const name of Object.keys(data.categories)){
    const category = document.createElement("div")
    category.textContent = name
    category.classList.add("category-button")
    category.addEventListener("click", evt => showCategory(path.concat(name), true))
    categoryList.appendChild(category)
  }
  if(data.description){
    commands.append(E("div").addClass("category-heading").text("Description"), E("div").addClass("category-description").text(data.description.replace(/``````/g, "\n\n")))
  }
  if(data.commands){
    commands.append(E("div").addClass("category-heading").text("Commands"))
    for(const [name, command] of Object.entries(data.commands)){
      const contents = E("div").addClass("command-contents")
      if(command.description) contents.append(E("div").addClass("command-content-heading").text("Description"), E("div").addClass("command-content-field").text(command.description.replace(/``````/g, "\n\n")))
      contents.append(E("div").addClass("command-content-heading").text("Formatting"), E("div").addClass("command-content-formatting").text(botPrefix + name + (command.arguments ? " " + command.arguments : "")))
      contents.append(E("div").addClass("command-content-heading").text("Cooldown"), E("div").addClass("command-content-field").text(`${command.cooldown} Second${command.cooldown === 1 ? "" : "s"}`))
      if(command.aliases) contents.append(E("div").addClass("command-content-heading").text("Aliases"), E("div").addClass("command-content-field").text(command.aliases.join(", ")))
      if(command.permissions) contents.append(E("div").addClass("command-content-heading").text("Permissions"), E("div").addClass("command-content-field").text(command.permissions.join(", ")))
      E("div").addClass("command").append(E("div").addClass("command-title").attr("data-name", name).append(E("a").text(name).attr("href", toURLParams({
        commands: path.length === 0 ? true : path.join("/"),
        command: name
      })).on("click", evt => {
        evt.preventDefault()
        if(evt.currentTarget.parentNode.childNodes.length === 1){
          copyText(location.origin + evt.currentTarget.getAttribute("href"))
          const copied = E("span").addClass("command-copied").text("copied link...").appendTo(evt.currentTarget.parentNode)  
          setTimeout(() => copied.remove(), 1000)
        }
      })), contents).appendTo(commands)
    }
  }
  commands[0].scrollTo(0, 0)
  if(scrollTo){
    const command = document.querySelector(`[data-name="${scrollTo}"]`)
    if(command) setTimeout(() => command.scrollIntoView(), 0)
    else history.replaceState("", null, toURLParams({commands: path.length === 0 ? true : path.join("/")}))
  }
}

function copyText(text){
  const input = $("#text-copier")
  input.val(text).select()
  document.execCommand("Copy")
  input.blur()
}

function compileJSON(object){
  function newLine(tabs){
    let s = "\n"
    for(let i = 0; i < tabs; i++) s += "\t"
    return s
  }
  function escape(string){
    return string.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n|\r\n/g, "\\n").replace(/\t/g, "\\t")
  }
  function handleVar(o, tabs){
    let out = ""
    if(typeof o === "string") out += '"' + escape(o) + '"'
    else if(typeof o === "boolean") out += (o ? "true" : "false")
    else if(o === null || o === Infinity || o === -Infinity) out += "null"
    else if(typeof o === "number"){
      o = (Math.round(o*100000)/100000).toString()
      out += o
    }else if(o instanceof Array){
      let has_content = false
      let has_objects = !!o.find(item => typeof item === "object")
      out += "["
      for(let i = 0; i < o.length; i++){
        let compiled = handleVar(o[i], tabs+1)
        if(compiled){
          if(has_content){out += ',' + (has_objects ? "" : " ")}
          if(has_objects){out += newLine(tabs)}
          out += compiled
          has_content = true
        }
      }
      if(has_objects) out += newLine(tabs-1)
      out += "]"
    }else if(typeof o === "object"){
      let breaks = o.constructor.name !== 'oneLiner'
      let has_content = false
      out += "{"
      for(const key in o){
        if(o.hasOwnProperty(key)){
          let compiled = handleVar(o[key], tabs+1)
          if(compiled){
            if(has_content){out += "," + (breaks ? "" : " ")}
            if(breaks){out += newLine(tabs)}
            out += '"' + escape(key) + '":' + " "
            out += compiled
            has_content = true
          }
        }
      }
      if(breaks && has_content) out += newLine(tabs - 1)
      out += "}"
    }
    return out
  }
  return handleVar(object, 1)
}

pageLoad()
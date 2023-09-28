!function(e){var t={};function n(o){if(t[o])return t[o].exports;var a=t[o]={i:o,l:!1,exports:{}};return e[o].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(o,a,function(t){return e[t]}.bind(null,a));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){n(1),e.exports=n(2)},function(e,t,n){},function(e,t,n){const{saveAs:o}=n(3),a=["cem","cem_animation_doc","commands","features","privacy"],s=/(?:^\?|&)([A-z0-9-]+)(?:=([^&]+)|(?=&)|$|=)/g,c=e=>$(document.createElement(e)),i=document.createElement("canvas").getContext("2d"),r="e!";let d;function l(e){let t=e;if(t||(t=location.search),t.length<2)return null;let n,o={};for(;n=s.exec(t);)o[n[1]]=!n[2]||decodeURIComponent(n[2].replace(/\+/g,"%20"));return o}function p(e){let t=[];for(let n in e)if(e.hasOwnProperty(n)&&null!=e[n])if(!0===e[n])t.push(`${0===t.length?"?":"&"}${n}`);else{let o=encodeURIComponent(e[n]).replace(/%3A/g,":").replace(/%3B/g,";").replace(/%20/g,"+").replace(/%2C/g,",").replace(/%2F/g,"/").replace(/%40/g,"@");t.push(`${0===t.length?"?":"&"}${n}=${o}`)}return t.join("")}function m(){const e=l();if(null!=e){const t=Object.keys(e).find((e=>~a.indexOf(e)));u(t||"home",!1)}else u("home",!1)}async function u(e,t=!0){e in f&&(await f[e](),delete f[e]),e in g&&g[e](),t&&("home"===e?history.pushState(null,"","/"):history.pushState(null,"",`?${e}`)),gtag("config","UA-155158328-3",{page_title:e,page_path:location.pathname+location.search});for(let e of document.querySelectorAll(".page"))e.classList.add("hidden");document.querySelector(`#${e}`).classList.remove("hidden"),$(".banner .selected").removeClass("selected"),$(`#${e}Button`).addClass("selected"),window.scrollTo(0,0)}document.body.addEventListener("touchend",(e=>{if(e.currentTarget.classList.contains("bannerDrop"))for(const t of document.querySelectorAll(".menu.touch-open"))t!=e.currentTarget.querySelector(".menu")&&t.classList.remove("touch-open");else for(const e of document.querySelectorAll(".menu.touch-open"))e.classList.remove("touch-open")})),window.addEventListener("popstate",m),document.querySelector("#commandsButton").addEventListener("click",(e=>{e.preventDefault(),u("commands")})),document.querySelector("#featuresButton").addEventListener("click",(e=>{e.preventDefault(),u("features")})),document.querySelector("#cemButton").addEventListener("click",(e=>{e.preventDefault(),u("cem")})),document.querySelector("#privacyButton").addEventListener("click",(e=>{e.preventDefault(),u("privacy")})),document.querySelector("#cem_animation_docButton").addEventListener("click",(e=>{e.preventDefault(),u("cem_animation_doc")}));for(let e of document.querySelectorAll('[href="/"]'))e.addEventListener("click",(e=>{e.preventDefault(),u("home")}));const f={async commands(){d=await fetch("https://wynem.com/bot_assets/json/commands.json").then((e=>e.json()))},async cem(){const e=await fetch("https://wynem.com/bot_assets/json/cem_template_models.json").then((e=>e.json())),t=["supported","legacy","unsupported","unreleased"];for(const n of t){const t=e.categories.find((e=>e.name.toLowerCase()===n));if(t){$("#entityListBox").append(c("h1").css({fontSize:"1.8em",display:"list-item","list-style-position":"inside",padding:"20px 0 0 0"}).text(n)).append(c("div").addClass("categoryEntities").attr("id",`${n}Entities`));for(const a of t.entities){const t="string"==typeof a?a:a.name,s="string"==typeof a?a.replace(/_/g," "):a.display_name?a.display_name:a.name.replace(/_/g," "),i="string"==typeof a?a:a.model?a.model:a.name,r=e.models[i].model,d=a.file_name?a.file_name:t;$(`#${n}Entities`).append(c("div").addClass("entityBox").attr("data-entityid",t).append(c("label").text(s),c("img").attr("src",`https://wynem.com/bot_assets/images/minecraft/renders/${t}.png`)).on("click",(e=>{const n=l();n.cem=t,history.replaceState(null,"",p(n)),gtag("config","UA-155158328-3",{page_title:"cem",page_path:location.pathname+p(n)}),$(".entityBox.selected").removeClass("selected"),$(e.currentTarget).addClass("selected"),$(".stickyEntityBox").remove(),$("#boneListBox").append(c("div").addClass("stickyEntityBox").append(c("h1").text(s),a.vanilla_textures?c("div").addClass("entityTextureCycle").append(...a.vanilla_textures.map(((e,n)=>c("div").addClass("entityTextureWrapper "+(n?"hidden":"")).append(c("img").addClass("entityTexture").attr("src",`https://wynem.com/bot_assets/images/minecraft/entities/${t}${n||""}.png`))))):c("div").addClass("entityTextureWrapper").append(c("img").addClass("entityTexture").attr("src",`https://wynem.com/bot_assets/images/minecraft/entities/${t}.png`)),c("button").addClass("entityDownload").text("Download Model").on("click",(e=>o(new Blob([v(JSON.parse(r))]),`${d}.jem`))),c("button").text("Open in Blockbench").attr("title","Requires the CEM Template Loader plugin to be installed in the web app").on("click",(e=>window.open(`https://web.blockbench.net/?plugins=cem_template_loader&model=${t}&texture`,"_blank").focus())),c("h2").text("Model Structure:"),c("table").addClass("entityBones").append(c("tr").append(c("th").text("Part name"),c("th").text("Pivot point location")))));const i=$(".entityBones");for(const e of JSON.parse(r).models)i.append(c("tr").append(c("td").text(e.part),c("td").text(`${e.translate[0]}, ${-1*e.translate[1]}, ${e.translate[2]}`)));console.log(JSON.stringify(JSON.parse(r),null,2))})))}}}const n=l();n&&("string"==typeof n.cem&&($(`.entityBox[data-entityid="${n.cem}"]`).click(),n.download&&($(".entityDownload").click(),delete n.download,history.replaceState(null,"",p(n)))),"string"==typeof n.search&&$("#entitySearch>input").val(n.search).trigger("input").select()),setInterval((()=>{const e=$(".entityTextureCycle");if(e.length>0&&e.is(":hover"))return;const t=e.find(".entityTextureWrapper:not(.hidden)").addClass("hidden");let n=t.next();0===n.length&&(n=t.parent().children().first()),n.removeClass("hidden")}),2e3)},async cem_animation_doc(){const e=await fetch("https://wynem.com/bot_assets/json/cem_animation_doc.json").then((e=>e.json())),t=$("#cem_doc"),n=$("#cem_doc_tabs");for(const o of e.tabs){const e=o.name.replace(/ /g,"_");n.append(c("div").attr("id",`cem_doc_tab_${o.name.replace(/ /g,"-")}`).html(o.name).on("click",(t=>{$("#cem_doc_tabs>div").removeClass("selected"),$("#cem_doc>div").removeClass("selected"),$(t.target).addClass("selected"),$(`#cem_doc_page_${e}`).addClass("selected"),window.scrollTo(0,0)})));const a=c("div").attr("id",`cem_doc_page_${e}`).appendTo(t);for(const e of o.elements)if("heading"===e.type)a.append(c("h2").html(e.text));else if("text"===e.type)a.append(c("p").html(e.text));else if("code"===e.type)a.append(c("pre").html(e.text));else if("table"===e.type){const t=c("table").appendTo(a);"list"===e.tableType&&t.addClass("cem_doc_table_list");for(const n of e.rows){const e=c("tr").appendTo(t);for(const[t,o]of n.entries())e.append(c("td").html(o))}}else"image"===e.type&&a.append(c("img").attr({src:e.url,width:e.width,height:e.height}))}$("#cem_doc_tabs>:first-child").addClass("selected"),$("#cem_doc>:first-child").addClass("selected"),$(".cem_doc_tab_link").on("click",(e=>{$("#cem_doc_tabs>div").removeClass("selected"),$("#cem_doc>div").removeClass("selected"),$(`#cem_doc_tab_${e.target.textContent.replace(/ /g,"-")}`).addClass("selected"),$(`#cem_doc_page_${e.target.textContent}`).addClass("selected"),window.scrollTo(0,0)})),$(".cem_doc_display_web").css("display","none"),t.append(c("hr"),c("p").html(`Documentation version:   <span style="font-family:var(--font-code)">v${e.version}</span>\nUpdated to:   <span style="font-family:var(--font-code)">OptiFine ${e.optifineVersion}</span>`))}},g={cem(){setTimeout((()=>$("#entitySearch>input").select()),0)},commands(){const e=l();h(e&&"string"==typeof e.commands?e.commands.split("/"):[],!1,e?e.command:void 0)}};async function h(e,t,o){t&&history.pushState("",null,p({commands:0===e.length||e.join("/")}));const a=$("#commandlist").empty(),s=document.getElementById("categories"),m=document.getElementById("category-path");s.innerHTML="",m.innerHTML="",c("div").addClass("category-path-stage").append(c("div").text("Wynem").on("click",(e=>h([],!0)))).appendTo(m);let u=d;for(const[t,n]of e.entries()){if(!u.categories||!u.categories[n]){e=e.slice(0,t);const n=l();n.commands=e.join("/"),history.replaceState("",null,p(n));break}c("div").addClass("category-path-stage").append(c("div").text(n).on("click",(n=>h(e.slice(0,t+1),!0)))).appendTo(m),u=u.categories[n]}gtag("config","UA-155158328-3",{page_title:"commands",page_path:location.pathname+location.search});const f=e.length>0?e[e.length-1]:"Wynem",g=document.getElementById("category-name");if(g.innerHTML="","Wynem"!==f){const t=document.createElement("div");t.classList.add("category-back-button"),t.innerHTML='<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" /></svg>',t.addEventListener("click",(t=>h(e.slice(0,-1),!0))),g.appendChild(t)}else a.append(c("div").addClass("commands-logo-container").html(await fetch(n(5).default).then((e=>e.text()))));const v=document.createElement("div");if(v.textContent=f,g.appendChild(v),setTimeout((()=>{let e=50;i.font=`${e}px AlteDin`;const t=$("#category-name").width()-60;for(;i.measureText(f).width>t;)e--,i.font=`${e}px AlteDin`;$("#category-name div").css("font-size",e+"px")}),0),u.categories)for(const t of Object.keys(u.categories)){const n=document.createElement("div");n.textContent=t,n.classList.add("category-button"),n.addEventListener("click",(n=>h(e.concat(t),!0))),s.appendChild(n)}if(u.description&&a.append(c("div").addClass("category-heading").text("Description"),c("div").addClass("category-description").text(u.description.replace(/``````/g,"\n\n"))),u.commands){a.append(c("div").addClass("category-heading").text("Commands"));for(const[t,n]of Object.entries(u.commands)){const o=c("div").addClass("command-contents");n.description&&o.append(c("div").addClass("command-content-heading").text("Description"),c("div").addClass("command-content-field").text(n.description.replace(/``````/g,"\n\n"))),o.append(c("div").addClass("command-content-heading").text("Formatting"),c("div").addClass("command-content-formatting").text(r+t+(n.arguments?" "+n.arguments:""))),o.append(c("div").addClass("command-content-heading").text("Cooldown"),c("div").addClass("command-content-field").text(`${n.cooldown} Second${1===n.cooldown?"":"s"}`)),n.aliases&&o.append(c("div").addClass("command-content-heading").text("Aliases"),c("div").addClass("command-content-field").text(n.aliases.join(", "))),n.permissions&&o.append(c("div").addClass("command-content-heading").text("Permissions"),c("div").addClass("command-content-field").text(n.permissions.join(", "))),c("div").addClass("command").append(c("div").addClass("command-title").attr("data-name",t).append(c("a").text(t).attr("href",p({commands:0===e.length||e.join("/"),command:t})).on("click",(e=>{if(e.preventDefault(),1===e.currentTarget.parentNode.childNodes.length){y(location.origin+e.currentTarget.getAttribute("href"));const t=c("span").addClass("command-copied").text("copied link...").appendTo(e.currentTarget.parentNode);setTimeout((()=>t.remove()),1e3)}}))),o).appendTo(a)}}if(a[0].scrollTo(0,0),o){const t=document.querySelector(`[data-name="${o}"]`);t?setTimeout((()=>t.scrollIntoView()),0):history.replaceState("",null,p({commands:0===e.length||e.join("/")}))}}function y(e){const t=$("#text-copier");t.val(e).select(),document.execCommand("Copy"),t.blur()}function v(e){function t(e){let t="\n";for(let n=0;n<e;n++)t+="\t";return t}function n(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\n|\r\n/g,"\\n").replace(/\t/g,"\\t")}return function e(o,a){let s="";if("string"==typeof o)s+='"'+n(o)+'"';else if("boolean"==typeof o)s+=o?"true":"false";else if(null===o||o===1/0||o===-1/0)s+="null";else if("number"==typeof o)s+=o=(Math.round(1e5*o)/1e5).toString();else if(o instanceof Array){let n=!1,c=!!o.find((e=>"object"==typeof e));s+="[";for(let i=0;i<o.length;i++){let r=e(o[i],a+1);r&&(n&&(s+=","+(c?"":" ")),c&&(s+=t(a)),s+=r,n=!0)}c&&(s+=t(a-1)),s+="]"}else if("object"==typeof o){let c="oneLiner"!==o.constructor.name,i=!1;s+="{";for(const r in o)if(o.hasOwnProperty(r)){let d=e(o[r],a+1);d&&(i&&(s+=","+(c?"":" ")),c&&(s+=t(a)),s+='"'+n(r)+'": ',s+=d,i=!0)}c&&i&&(s+=t(a-1)),s+="}"}return s}(e,1)}window.processEntitySearch=function(e){const t=$("#entitySearch>input").val().toLowerCase();$(".entityBox").each(((e,n)=>{~$(n).children().first().text().toLowerCase().indexOf(t)?$(n).css("display",""):$(n).css("display","none")})),$("#entityListBox>h1").each(((e,t)=>{t.style.display=$(t).next().children().toArray().some((e=>""===e.style.display))?"":"none"}));const n=l();""===t?delete n.search:n.search=t,history.replaceState(null,"",p(n))},window.processEndEntitySearch=function(e){const t=e.currentTarget.value.toLowerCase(),n=l();n.search=t,gtag("config","UA-155158328-3",{page_title:"search",page_path:location.pathname+p(n)})},m()},function(e,t,n){(function(n){var o,a,s;a=[],void 0===(s="function"==typeof(o=function(){"use strict";function t(e,t){return void 0===t?t={autoBom:!1}:"object"!=typeof t&&(console.warn("Deprecated: Expected third argument to be a object"),t={autoBom:!t}),t.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)?new Blob(["\ufeff",e],{type:e.type}):e}function o(e,t,n){var o=new XMLHttpRequest;o.open("GET",e),o.responseType="blob",o.onload=function(){r(o.response,t,n)},o.onerror=function(){console.error("could not download file")},o.send()}function a(e){var t=new XMLHttpRequest;t.open("HEAD",e,!1);try{t.send()}catch(e){}return 200<=t.status&&299>=t.status}function s(e){try{e.dispatchEvent(new MouseEvent("click"))}catch(n){var t=document.createEvent("MouseEvents");t.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),e.dispatchEvent(t)}}var c="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof n&&n.global===n?n:void 0,i=c.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),r=c.saveAs||("object"!=typeof window||window!==c?function(){}:"download"in HTMLAnchorElement.prototype&&!i?function(e,t,n){var i=c.URL||c.webkitURL,r=document.createElement("a");t=t||e.name||"download",r.download=t,r.rel="noopener","string"==typeof e?(r.href=e,r.origin===location.origin?s(r):a(r.href)?o(e,t,n):s(r,r.target="_blank")):(r.href=i.createObjectURL(e),setTimeout((function(){i.revokeObjectURL(r.href)}),4e4),setTimeout((function(){s(r)}),0))}:"msSaveOrOpenBlob"in navigator?function(e,n,c){if(n=n||e.name||"download","string"!=typeof e)navigator.msSaveOrOpenBlob(t(e,c),n);else if(a(e))o(e,n,c);else{var i=document.createElement("a");i.href=e,i.target="_blank",setTimeout((function(){s(i)}))}}:function(e,t,n,a){if((a=a||open("","_blank"))&&(a.document.title=a.document.body.innerText="downloading..."),"string"==typeof e)return o(e,t,n);var s="application/octet-stream"===e.type,r=/constructor/i.test(c.HTMLElement)||c.safari,d=/CriOS\/[\d]+/.test(navigator.userAgent);if((d||s&&r||i)&&"undefined"!=typeof FileReader){var l=new FileReader;l.onloadend=function(){var e=l.result;e=d?e:e.replace(/^data:[^;]*;/,"data:attachment/file;"),a?a.location.href=e:location=e,a=null},l.readAsDataURL(e)}else{var p=c.URL||c.webkitURL,m=p.createObjectURL(e);a?a.location=m:location.href=m,a=null,setTimeout((function(){p.revokeObjectURL(m)}),4e4)}});c.saveAs=r.saveAs=r,e.exports=r})?o.apply(t,a):o)||(e.exports=s)}).call(this,n(4))},function(e,t){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(e){"object"==typeof window&&(n=window)}e.exports=n},function(e,t,n){"use strict";n.r(t),t.default=n.p+"assets/images/logo/wynem.svg"}]);
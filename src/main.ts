import "./style.css"

const menu = document.getElementById("menu")!;
const files: any = import.meta.glob("@/packages/*/*/*.html");

const menuData = Object.keys(files).reduce((res, cur) => {
  const [_, category1, category2] = cur.replace("/src/", "").split("/")
  if (!res[category1]) {
    res[category1] = {}
  }

  res[category1][category2] = cur
  return res
}, {} as any)


function genMenu(data: any, domList: string[] = []) {
  if (!data) return domList;

  const keys = Object.keys(data)

  keys.forEach(k => {
    domList.push(`<li class='menu_item' ${
      typeof data[k] === "string" ? `link="${data[k]}"` : ""
    }><span class="menu_expand_btn"> > </span>${k}`)

    if (data[k] && typeof data[k] !== "string") {
      domList.push(`<ul class='menu_list close'>`)
      genMenu(data[k], domList)
      domList.push(`</ul>`)
    }
    domList.push(`</li>`)
  })
  return domList
}


menu.addEventListener("click", function (e) {
  const target = (e.target as HTMLElement)
  const link = target.getAttribute("link")
  if (link) {
    const content = document.getElementById("content") as any;
    content["src"] = link;
  } else if (target.className.includes("menu_expand_btn")) {
    const menuList = target.parentElement!.querySelector(".menu_list");
    let menuListCls = menuList!.className;

    if(menuListCls.includes("close")){
      menuList!.className = menuListCls.replace("close", "");
      target.innerHTML = " | "

    }else{
      menuList!.className = menuListCls + " close"
      target.innerHTML = " > "
    }
  }
})


const menuList = genMenu(menuData)
menu.innerHTML = menuList.join("")
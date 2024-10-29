(async ()=>{
	const url = new URL(window.location.href)
	const params = new URLSearchParams(url.search);
	let filename = params.get("name");
	let fileset = params.get("set");
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const filesets_datalist = document.getElementById("filesets")
	for (let key of Object.keys(filesets)) {
		const option = document.createElement("option")
		option.setAttribute("value", key)
		filesets_datalist.append(option)
	}
	const fileset_buttons = filesets[fileset?.buttons] ?? []
	const control = document.getElementById("control")
	const splitter = document.createElement("_")
	function updateUrl(){
		url.params = params;
		window.location.updateUrl(url)
	}
	if (fileset_buttons.length > 0) {
		try {
			control.append(splitter)
			let i = 0;
			for (let {type="invalid", props={}} of fileset_buttons) {
				i++;
				const el_type = type?.startsWith?.("#")
				? type.slice(1, type.length)
				: ["url", "file"].includes(type)
					? "button"
					: undefined
				const button = document.createElement(el_type)
				button.innerText = props?.label;
				switch (type) {
					case "file":
						button.setAttribute("id", "btn/file/"+i)
						button.addEventListener("click", () => {
							filename = props?.url;
							showImage(filename);
						})
						break;
					case "url":
						button.setAttribute("id", "btn/url/"+i)
						button.addEventListener("click", () => location.replace(props?.url));
						break
					default:
						if (type !== undefined) break;
						const div = document.createElement("invalid")
						div.innerText = JSON.stringify({type,props}, 0, "\t")
						div.innerHTML = div.innerHTML.replaceAll("\t", "&emsp;")
						control.append(div)
						continue;
				}
				control.append(button)
			}
		} catch (e) {
			console.error(e)
		}
	}
	const view = document.getElementById("view")
	function showImage(filename, type) {
		view.style.backgroundImage = `url(./assets/viewer/${filename}.${type})`
	}
	showImage(filename, filetype)
	const buttons = {
		png: document.getElementById("btn/picker/png"),
		svg: document.getElementById("btn/picker/svg")
	}
	buttons.png.addEventListener("click", () => showImage(filename, "png"))
	buttons.svg.addEventListener("click", () => showImage(filename, "svg"))
})()
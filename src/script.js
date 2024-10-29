(async ()=>{
	const url = new URL(window.location.href)
	const params = new URLSearchParams(url.search);
	let filename = params.get("name");
	let fileset = params.get("set");
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const filesets_datalist = document.getElementById("filesets")
	const filesets_span = document.getElementById("fileset_choice")
	filesets_span.innerText = fileset
	for (let key of Object.keys(filesets)) {
		const option = document.createElement("option")
		option.setAttribute("value", key)
		filesets_datalist.append(option)
	}
	const control_btns = document.getElementById("control_btns")

	const fileset_input = document.getElementById("fileset_input");
	const fileset_button = document.querySelector("label:has(input#fileset_input) button");
	fileset_button.addEventListener("click", () => {
		control_btns.innerHTML = "";
		const new_fileset = filesets[fileset_input.value];
		
		if (!new_fileset) alert(`Пакета файлів під назвою <<${fileset_input.value}>> немає`)
		filesets_span.innerText = fileset_input.value
		console.log(new_fileset)

		fileset = new_fileset;
		updateUrl({fileset});
		addFilesetButtons(fileset, control_btns)
	})
	const fileset_buttons = filesets[fileset?.buttons] ?? []
	const control = document.getElementById("control")
	function updateUrl(modifieds={}){
		for (const key of Object.keys(modifieds)) {
			params[key] = modifieds[key]
		}
		url.params = params;
		window.location.updateUrl(url)
	}
	const view = document.getElementById("view")
	function showImage(filename) {
		view.style.backgroundImage = `url(./assets/viewer/${filename})`
	}
    function addFilesetButtons(fileset_buttons, control) {
		if (fileset_buttons.length > 0) {
		try {
			control.append(document.createElement("_"))
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
							updateUrl({filename});
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
		}}
    }
	if (filename) showImage(filename)
	if (fileset) {
		addFilesetButtons(fileset_buttons, control_btns)
		if (fileset.default_filename) {
			filename = fileset.default_filename;
			showImage(filename)
			updateUrl({filename});
		}		
	}
})()
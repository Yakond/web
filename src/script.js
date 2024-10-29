const url = new URL(window.location.href)
const params = new URLSearchParams(url.search);
let filename = params.get("name");
let fileset = params.get("set");
function updateUrl(modifieds={}){
	for (const key of Object.keys(modifieds)) {
		params[key] = modifieds[key]
	}
	url.params = params;
	window.location.updateUrl(url)
}

const filesets_datalist = document.getElementById("filesets")
const filesets_span = document.getElementById("fileset_choice")
const fileset_input = document.getElementById("fileset_input");
const fileset_button = document.querySelector("label:has(input#fileset_input) button");

(async ()=>{
	const view = document.getElementById("view")
	const control_btns = document.getElementById("control_btns")

	// get filesets
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const getFileset = (fileset) => filesets[fileset]

	for (let key of Object.keys(filesets)) {
		const option = document.createElement("option")
		option.setAttribute("value", key)
		filesets_datalist.append(option)
	}
	fileset_button.addEventListener("click", () => {
		if (!fileset_input.value) return;

		const new_fileset = filesets[fileset_input.value];
		
		if (!new_fileset) return alert(`Пакета файлів під назвою <<${fileset_input.value}>> немає`)
		else showFileset(new_fileset)
	})	

	if (filename) showImage(filename)
	if (fileset) showFileset(fileset);

	function showImage(filename) {
		view.style.backgroundImage = `url(./assets/viewer/${filename})`
	}
    function swapFilesetButtons(fileset_buttons, control) {
		control.innerHTML = ""
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
	function showFileset(filesetName) {
		filesets_span.innerText = filesetName || "Ніякий"
		fileset = filesetName;
		updateUrl({fileset});
		const filesetData = getFileset(filesetName)
		if (filesetData?.buttons) {
			swapFilesetButtons(filesetData.buttons, control_btns)
		}
		if (filesetData?.default_filename) {
			filename = filesetData.default_filename;
			showImage(filename)
			updateUrl({filename});
		}	
	}
})()


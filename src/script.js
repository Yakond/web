const url = new URL(window.location.href)
const params = new URLSearchParams(url.search);
function updateUrl() {
	url.search = params.toString();
	window.history.pushState({}, '', url);
}
const filesets_datalist = document.getElementById("filesets")
const filesets_span = document.getElementById("fileset_choice")
const fileset_input = document.getElementById("fileset_input");
const fileset_button = document.querySelector("label:has(input#fileset_input) button");
exports = {};
(async ()=>{
	const image_elem = document.querySelector("#view > img")
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

		const new_fileset = fileset_input.value;
		
		if (!new_fileset) return alert(`Пакета файлів під назвою <<${fileset_input.value}>> немає`)
		else showFileset(new_fileset)
	})

	if (params.get("name")) showImage(params.get("name"))
	if (params.get("set")) showFileset(params.get("set"));

	function showImage(filename) {
		if (!filename) alert("Filenamen't")
		image_elem.setAttribute("src", `./assets/viewer/${filename}`)
	}
	function resetImage() {
		
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
							params.set("name", props?.filename);
							updateUrl();
							showImage(decodeURIComponent(params.get("name")));
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
		params.set("set", filesetName);
		updateUrl();
		const filesetData = getFileset(filesetName)
		if (filesetData?.buttons) {
			swapFilesetButtons(filesetData.buttons, control_btns)
		}
		if (filesetData?.default_filename) {
			params.set("name", filesetData.default_filename);
			showImage(params.get("name"))
			updateUrl();
		}	
	}
	exports = {getFileset, showImage, swapFilesetButtons, showFileset, resetImage}
})()


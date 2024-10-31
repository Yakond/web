const url = new URL(window.location.href)
const params = new URLSearchParams(url.search);
function updateUrl() {
    for (const [key, value] of params.entries()) {
        if (value === null) {
            params.delete(key);
		}	
	}
	url.search = params.toString();
	window.history.pushState({}, '', url);
}
const fileset_select = document.getElementById("fileset_select");

const waiter = document.querySelector(".waiter");
exports = {};
(async ()=>{
	const image_elem = document.querySelector("#view > img")
	const control_btns = document.getElementById("control_btns")

	// get filesets
	let filesets = await fetch("./assets/filesets.json").then(res=>res.json());
	const getFileset = (fileset) => filesets[fileset]
	let optgroup;
	for (let key of Object.keys(filesets)) {
		let split = key.split(" / ");
		let name = undefined;
		if (split.length > 1) {
			name = split[1];
			if (optgroup?.label !== split[0]) {
				optgroup = document.createElement("optgroup");
				optgroup.label = split[0];
				fileset_select.append(optgroup)
			}
		} else optgroup = undefined;

		const option = document.createElement("option");
		option.setAttribute("value", key);
		option.innerText = filesets?.[key]?.label || name || key;
		(optgroup||fileset_select).append(option);
	}
	fileset_select.addEventListener("change", () => {	
		let new_fileset = fileset_select.getAttribute("value");
		if (new_fileset === "null") new_fileset = null;
		if (!getFileset(new_fileset) && new_fileset !== null) {
			fileset_select.selectedIndex = 0
			return alert(`Пакета файлів під назвою «${fileset_select.value}» немає`)
		}
		return showFileset(new_fileset)
	})
	if (params.get("name")) showImage(params.get("name"));
	if (params.get("set")) showFileset(params.get("set"));

	function showImage(filename) {
		if (!filename) {
			resetImage();
			return alert("Filename not provided");
		}
		image_elem.classList.remove("hidden");
		image_elem.setAttribute("src", `./assets/viewer/${filename}`);
	
		waiter.classList.add("hidden")
	}
	
	function resetImage() {
		image_elem.setAttribute("src", "");
		image_elem.classList.add("hidden");
	
		waiter.classList.remove("hidden")
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
		const filesetData = getFileset(filesetName)
		swapFilesetButtons(filesetData?.buttons || [], control_btns)

		if (	(
					(params.get("set") !== filesetName && params.get("name") !== filesetData?.default_filename) // Файлсет обраний з першої сторінки, файл не вказаний в посиланні
				||	(params.get("set") === filesetName && params.get("name") === null) // Цей файлсет вже був обраний (відкрито з посилання), але немає імені (в посиланні)
				) 
			&& filesetData?.default_filename
		) {
			params.set("name", filesetData.default_filename);
			showImage(params.get("name"))
		}

		params.set("set", filesetName || null);
		updateUrl();
		if (filesetName !== null) for (let i = 0; i < fileset_select.children.length; i++) {
			const child = fileset_select.children[i];
	
			// Check if the child is an <optgroup>
			if (child.tagName === "OPTGROUP") {
				// Loop through each <option> inside the <optgroup>
				for (let j = 0; j < child.children.length; j++) {
					const option = child.children[j];
					if (option.getAttribute("value") === filesetName) {
						fileset_select.selectedIndex = i;
						return;
					}
					i++;
				}
			} else if (child.tagName === "OPTION") {
				// If it's a direct <option> (not inside an <optgroup>)
				if (child.getAttribute("value") === filesetName) {
					fileset_select.selectedIndex = i;
					return;
				}
				i++;
			}
		}
	}
	exports = {getFileset, showImage, swapFilesetButtons, showFileset, resetImage}
})()


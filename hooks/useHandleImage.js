import { compressingFiles } from "firebase/client";
import { useRouter } from "next/router";

const useHandleImage = () => {

    const router = useRouter();

    const setupReader = async file => {
        return new Promise((resolve, reject) =>{
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if(file.type != "video/mp4")
                    resolve({base64: reader.result, name:file.name, rotation:0, type:file.type, baseurl: URL.createObjectURL(file)})
                else
                    resolve({base64: '', name:file.name, rotation:0, type:file.type, baseurl: URL.createObjectURL(file)})
            }
            reader.onerror = () => {
                reject(reader);
            };
        })
    }

    const handleImage = async (e) => {
			let files = [];
			let compressImg;
			for (let index = 0; index < e.target.files.length; index++) {
				if (e.target.files[index].type != "video/mp4")
					compressImg = await compressingFiles(e.target.files[index]);
				else compressImg = e.target.files[index];

				files.push(await setupReader(compressImg));
			}

			localStorage.setItem("filesSelected", JSON.stringify(files));
			router.push("/preview/");
		};

    return {
			handleImage,
		};
}

export default useHandleImage

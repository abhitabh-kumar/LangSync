export class extract{
    public static  async translate(outputLanguage:string,inputText:string):Promise<any>{
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${outputLanguage}&dt=t&q=${encodeURI(
      inputText
    )}`;
    let text = {};
    await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const t1 = json[0].map((item:any) => item[0]).join("");
        text = {
          "mess": "success",
          "result": `${t1}`
        }
      })
      .catch((error) => {
        text = {
          "mess": "error",
          "result": `${error}`
        }
      });
    return new Promise((resolve,reject)=>resolve(text));
    }
    public static fileTranslate(outputLanguage:string, file:File):Promise<any>{
        if (
            file.type === "application/pdf" ||
            file.type === "image/jpeg"||
            file.type==="image/png"
          ) {
      
            let api = "https://script.google.com/macros/s/AKfycbxKVrSdWjBe2BbgifTkacrjy8H4zk6PS3bb9JDdNoOT_pi9XV_k_zYQ7piTgtpEMG8c/exec";
            let fr = new FileReader();
      
            return new Promise((resolve, reject) => {
              fr.readAsDataURL(file)
              fr.onload = async () => {
                let res = fr.result;
                let b64;
                if(res!=null ) b64 = (<string>res).split("base64,")[1];
                try{
                  await fetch(api, {
                    method: "POST",
                    body: JSON.stringify({
                      file: b64,
                      type: file.type,
                      name: file.name
                    })
                  })
                    .then(res => res.text())
                    .then((data) => {
                      let size=data.length>10000?10000:data.length;
                      this.translate(outputLanguage, data.substring(0,size)).then((e) => {
                        resolve(e);
                      });
                    });
                }
                catch(error){
                  reject(error);
                }
              }
            })
          } else if(file.type === "text/plain" ||
          file.type === "application/msword" ||
          file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
      
      
            const url = 'https://converter12.p.rapidapi.com/api/converter/1/FileConverter/Convert';
            const data = new FormData();
            data.append('file', file);
            
            const options = {
              method: 'POST',
              headers: {
                'X-RapidAPI-Key': '7a74449aa2mshc25fe54b88bde00p1ab0bfjsn58e683732736',
                'X-RapidAPI-Host': 'converter12.p.rapidapi.com'
              },
              body: data
            };
            
            return new Promise(async (resolve,reject)=>{
              try {
                const response = await fetch(url, options);
                const result = await response.text();
                let text =JSON.parse(result).text;
                let val="";
                for(let i=0;i<text.length;i++){
                  if(val.length>10000) break;
                  val+=text[i]+"\n";
      
                }
                this.translate(outputLanguage,val).then((e)=>{
                  resolve(e);
                })
              } catch (error) {
                reject(error)
              }
            })
          } else {
            let text = {
                "mess": "error",
                "result": "please upload valid file"
              }
            return new Promise((resolve,reject)=>resolve(text));
          }
    }
}
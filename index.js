#!/usr/bin/env node
console.log(`
Abhitabh Kumar Pandey
Site- https://portfolio-7c348.web.app/
Email - abhitabhkumar9718@gmail.com
`)

const translation = async (outputLanguage, inputText) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${outputLanguage}&dt=t&q=${encodeURI(
      inputText
    )}`;
    let text = {};
    await fetch(url)
      .then((response) => response.json())
      .then((json) => {
        const t1 = json[0].map((item) => item[0]).join("");
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
    return text;
  }
  // let text={};
  module.exports = {
    translate: (outputLanguage, inputText) => {
      return translation(outputLanguage, inputText);
    },
    fileTranslate: (outputLanguage, file) => {
      if (
        file.type === "application/pdf" ||
        file.type === "image/jpeg"||
        file.type==="image/png"
      ) {
  
        let api = "https://script.google.com/macros/s/AKfycbw6fQAkjkhp3zkHKlVJ3OW546ovhp_MapjYybmQBuMLzeH26bYxoTV8WTOGPluszb_R/exec";
        let fr = new FileReader();
  
        return new Promise((resolve, reject) => {
          fr.readAsDataURL(file)
          fr.onload = async () => {
            let res = fr.result;
            let b64 = res.split("base64,")[1];
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
                  translation(outputLanguage, data.substring(0,size)).then((e) => {
                    resolve(e);
                  });
                });
            }
            catch(error){
              reject(e);
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
            for( i=0;i<text.length;i++){
              if(val.length>10000) break;
              val+=text[i]+"\n";
  
            }
            translation(outputLanguage,val).then((e)=>{
              resolve(e);
            })
          } catch (error) {
            reject(error)
          }
        })
      } else {
        return text = {
          "mess": "error",
          "result": "please upload valid file"
        }
      }
    }
  }
  
  
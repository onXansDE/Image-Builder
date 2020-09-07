const colorpicker = require('./colorpicker.js')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Jimp = require('jimp');

const adapter = new FileSync('db.json')
const db = low(adapter)

const fs = require('fs');

async function proccesimage(path, name, type) {
    const img = await Jimp.read(path);
    console.log("Reading " + name);
    // img.resize(256,256);
    let image = new Jimp(img.bitmap.width * 16, img.bitmap.height * 16,(err, image) => {
        if (err) throw err
    });
    var arrayvalues = db.get("blocks").value();
    for(var x = 0; x <= img.bitmap.width; x++) {
        // console.log("X: " +x);
        for(var y = 0; y <= img.bitmap.height; y++) {
            var precolor = img.getPixelColor(x,y);
            var color = {
                b:  (precolor >> 8) & 255,
                g: (precolor >> 16) & 255,
                r: (precolor >> 24) & 255,
                a: (precolor >> 32) & 255
            }
            if(color.a != 0) {
                var element = colorpicker.getClosestColor(color, arrayvalues);
                var _img = await Jimp.read("./images/" + element.id + ".png");
                image.composite(_img, x*16,y*16);
            }
        }
    }
    image.write("./"+ type +"/" + name);
    console.log("Writing ./"+type+"/" + name);
}

const main = async () => {

    fs.readdir("./blockdefaults/", (err, images) => {
        images.forEach(file => {
            console.log("Proccessing File: " + file);
          if(file.endsWith(".png")) proccesimage("./blockdefaults/" + file,file, "block");
        })
      });

      fs.readdir("./itemdefaults/", (err, images) => {
        images.forEach(file => {
            console.log("Proccessing File: " + file);
          if(file.endsWith(".png")) proccesimage("./itemdefaults/" + file,file,"item");
        })
      });

      fs.readdir("./entitydefaults/", (err, images) => {
        images.forEach(file => {
            console.log("Proccessing File: " + file);
          if(file.endsWith(".png")) proccesimage("./entitydefaults/" + file,file,"entity");
        })
      });

    
}


main();
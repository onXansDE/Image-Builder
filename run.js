const colorpicker = require('./colorpicker.js')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const Jimp = require('jimp');

const adapter = new FileSync('db.json')
const db = low(adapter)

const main = async () => {
    const img = await Jimp.read("input.jpg");
    img.resize(274,152);
    let image = new Jimp(img.bitmap.width * 16, img.bitmap.height * 16, "white",(err, image) => {
        if (err) throw err
    });
    var arrayvalues = db.get("blocks").value();
    for(var x = 0; x <= img.bitmap.width; x++) {
        console.log("X: " +x);
        for(var y = 0; y <= img.bitmap.height; y++) {
            var precolor = img.getPixelColor(x,y);
            var color = {
                b:  (precolor >> 8) & 255,
                g: (precolor >> 16) & 255,
                r: (precolor >> 24) & 255
            }
            var element = colorpicker.getClosestColor(color, arrayvalues)
            var _img = await Jimp.read("./images/" + element.id + ".png");
            image.composite(_img, x*16,y*16);
        }
    }
    return image;
}


main().then(image => image.write("output.png"));